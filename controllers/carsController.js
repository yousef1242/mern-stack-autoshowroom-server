const expressAsyncHandler = require("express-async-handler");
const { Cars } = require("../models/cars");
const cloudinary = require("../utils/cloudinary");
const { json } = require("express");

/**-------------------------------------
 *  @dec add car
 * @route /api/cars/add
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const addCarController = expressAsyncHandler(async (req, res) => {
  const existCarObject = {
    name: req.body.name,
    model: req.body.model,
  };
  const findCar = await Cars.findOne(existCarObject);
  if (findCar) {
    return res.status(400).json({ ok: false, message: "Car already exist" });
  }
  if (!req.files) {
    return res.status(400).json({ ok: false, message: "No files provided" });
  }
  const createCar = new Cars({ ...req.body });
  const files = req.files;
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path, {
        resource_type: "image",
        format: "jpg",
        folder: "cars-showroom-1", // Adjust folder naming for compatibility
        transformation: {
          width: 1200,
          height: 800,
          quality: "auto:best",
        },
      });
      createCar.files.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  }
  await createCar.save();
  return res
    .status(200)
    .json({ ok: true, message: "Car created successfully" });
});

/**-------------------------------------
 *  @dec get all cars
 * @route /api/cars/get/all
 * @method GET
 * @access private (all : any one)
 -------------------------------------*/
const getAllCarsController = expressAsyncHandler(async (req, res) => {
  const query = req.query;

  // Check if any search parameters are provided
  const hasSearchParameters =
    (query.name && query.name !== "undefined") ||
    (query.category && query.category !== "undefined") ||
    (query.model && query.model !== "undefined") ||
    (query.color && query.color !== "undefined");

  if (hasSearchParameters) {
    // Build filters based on provided search parameters
    const filters = {
      ...(query.name !== "undefined" && {
        name: { $regex: query.name, $options: "i" },
      }),
      ...(query.category !== "undefined" && {
        category: { $regex: query.category, $options: "i" },
      }),
      ...(query.model !== "undefined" && {
        model: { $regex: query.model, $options: "i" },
      }),
      ...(query.color !== "undefined" && {
        color: { $regex: query.color, $options: "i" },
      }),
    };

    // Query the database using the filters
    const cars = await Cars.find({ $and: [filters] }).sort({ createdAt: -1 });

    // Paginate the results
    const page = parseInt(query.page) || 1;
    const limits = 10;
    const firstIndex = (page - 1) * limits;
    const lastIndex = page * limits;
    const data = cars.slice(firstIndex, lastIndex);

    return res.status(200).json({ ok: true, data: data });
  } else {
    // If no search parameters are provided, retrieve all cars
    if (query.page && query.page !== "undefined") {
      // Paginate the results
      const cars = await Cars.find({}).sort({ createdAt: -1 });
      const page = parseInt(query.page);
      const limits = 5;
      const firstIndex = (page - 1) * limits;
      const lastIndex = page * limits;
      const data = cars.slice(firstIndex, lastIndex);
      return res.status(200).json({ ok: true, data: data });
    } else {
      const cars = await Cars.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ ok: true, data: cars });
    }
  }
});

/**-------------------------------------
 *  @dec get single car
 * @route /api/cars/get/single/:carname
 * @method GET
 * @access private (all : any one)
 -------------------------------------*/
const getSingleCarController = expressAsyncHandler(async (req, res) => {
  const findCar = await Cars.findOne({ name: req.params.carname });
  if (!findCar) {
    return res.status(400).json({ ok: false, message: "Car doesn't exist" });
  }
  res.status(200).json({ ok: true, data: findCar });
});

/**-------------------------------------
 *  @dec delete car
 * @route /api/cars/delete/:carId
 * @method DELETE
 * @access private (admin only)
 -------------------------------------*/
const deleteCarController = expressAsyncHandler(async (req, res) => {
  const { carId } = req.params;
  const findCar = await Cars.findById(carId);
  if (!findCar) {
    return res.status(400).json({ ok: false, message: "Car doesn't exist" });
  }
  for (let i = 0; i < findCar.files.length; i++) {
    const publicId = findCar.files[i].publicId;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
    }
  }
  await Cars.findByIdAndDelete(carId);
  return res
    .status(200)
    .json({ ok: true, message: "Car deleted successfully" });
});

/**-------------------------------------
 *  @dec update car
 * @route /api/cars/update/:carname
 * @method PUT
 * @access private (admin only)
 -------------------------------------*/
const updateCarController = expressAsyncHandler(async (req, res) => {
  const { carname } = req.params;
  const findCar = await Cars.findOne({ name: carname });
  if (!findCar) {
    return res.status(400).json({ ok: false, message: "Car doesn't exist" });
  }
  const allFiles = [];
  const { existingFiles } = req.body;
  if (existingFiles && existingFiles !== "undefined") {
    const parsedExistingFiles = Array.isArray(existingFiles)
      ? existingFiles.map((file) => JSON.parse(file))
      : JSON.parse(existingFiles);
    if (
      parsedExistingFiles &&
      Array.isArray(parsedExistingFiles) &&
      parsedExistingFiles.length > 0
    ) {
      for (let i = 0; i < parsedExistingFiles.length; i++) {
        allFiles.push({
          url: parsedExistingFiles[i].url,
          publicId: parsedExistingFiles[i].publicId,
          place: parsedExistingFiles[i].place,
        });
      }
    } else {
      allFiles.push({
        url: parsedExistingFiles.url,
        publicId: parsedExistingFiles.publicId,
        place: parsedExistingFiles.place,
      });
    }
  }

  if (req.files) {
    const files = req.files;
    if (files.length > 0) {
      const places = Array.isArray(req.body.place)
        ? req.body.place
        : [req.body.place];
      for (let i = 0; i < files.length; i++) {
        const result = await cloudinary.uploader.upload(files[i].path, {
          resource_type: "image",
          format: "jpg",
          folder: "cars-showroom-1", // Adjust folder naming for compatibility
          transformation: {
            width: 1200,
            height: 800,
            quality: "auto:best",
          },
        });
        allFiles.push({
          url: result.secure_url,
          publicId: result.public_id,
          place: places[i],
        });
      }
    }
  }

  const sortFiles = allFiles.sort((a, b) => a.place - b.place);

  if (sortFiles) {
    await Cars.findOneAndUpdate(
      { name: carname },
      {
        $set: {
          ...req.body,
          files: allFiles,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      ok: true,
      message: "Car updated successfully",
    });
  } else {
    return res.status(200).json({
      ok: false,
      message: "Somthing went wront with sort files",
    });
  }
});

module.exports = {
  addCarController,
  getAllCarsController,
  getSingleCarController,
  deleteCarController,
  updateCarController,
};
