const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

//GET / property;
const getAllProperties = async (req, res) => {
  res.send("getAllProperties");
};

// POST /property
const createProperty = async (req, res) => {
  res.send("createProperty");
};

// GET /property/:propertyId
const getPropertyById = async (req, res) => {
  res.send("getPropertyById");
};

// PUT /property/:propertyId
const updateProperty = async (req, res) => {
  res.send("updateProperty");
};

// DELETE /property/:propertyId
const deleteProperty = async (req, res) => {
  res.send("deleteProperty");
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
