const Service = require("../models/Service");
const mongoose = require("mongoose");

// Create Service
const createService = async (req, res) => {
  try {
    const {
      serviceName,
      description,
      category,
      price,
      duration,
      image
    } = req.body;

    const service = await Service.create({
      serviceName,
      description,
      category,
      price,
      duration,
      image,
      providerId: req.user._id
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate(
      "providerId",
      "name email"
    );

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Single Service
const getService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id).populate(
      "providerId",
      "name email"
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Service
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Service ID"
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService
};