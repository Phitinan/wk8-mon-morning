const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

//GET / property;
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch {
    res.status(500).json({ message: "failed to get properties" });
  }
};

// // POST /property
// const createProperty = async (req, res) => {
//   const { title, type, description, price, location, squareFeet, yearBuilt } = req.body;

//   let emptyFields = [];
//   if (!title) emptyFields.push('title');
//   if (!type) emptyFields.push('type');
//   if (!description) emptyFields.push('description');
//   if (!price) emptyFields.push('price');
//   if (!location || !location.address || !location.city || !location.state || !location.zipCode)
//     emptyFields.push('location');
//   if (!squareFeet) emptyFields.push('squareFeet');
//   if (!yearBuilt) emptyFields.push('yearBuilt');

//   if (emptyFields.length > 0) {
//     return res.status(400).json({
//       error: 'Please fill in all the fields',
//       emptyFields
//     });
//   }

//   try {
//     const newProperty = await Property.create({
//       title,
//       type,
//       description,
//       price,
//       location:{
//         address,
//         city,
//         state,
//         zipCode,
//       },
//       squareFeet,
//       yearBuilt
//     });

//     res.status(201).json(newProperty);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const createProperty = async (req, res) => {

  try {
    // const user_id = req.user._id;
    const newProperty = new Property({
      ...req.body,
      // user_id,
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET /property/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: 'No such property' })
  }
  try {
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ error: 'No such property' })
    }
    res.status(200).json(property)
  } catch (error) {
    res.status(500).json({ error: "can't get property" });
  }

};

// PUT /property/:propertyId
const updateProperty = async (req, res) => {
  const { propertyId } = req.params

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: 'No such property' })
  }

  const property = await Property.findOneAndUpdate({ _id: propertyId }, {
    ...req.body
  }, { new: true, runValidators: true })

  if (!property) {
    return res.status(400).json({ error: 'No such property' })
  }

  res.status(200).json(property)
};

// DELETE /property/:propertyId
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(404).json({ error: 'No such property' })
  }
  try {
    const property = await Property.findOneAndDelete({ _id: propertyId })

    if (!property) {
      return res.status(400).json({ error: 'No such property' })
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
