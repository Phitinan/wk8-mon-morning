const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app
const api = supertest(app);
const Property = require("../models/propertyModel");
const User = require("../models/userModel");

let token = null;

// --- Mock Property Data ---
const properties = [
  {
    title: "Cozy Apartment in Helsinki",
    type: "Apartment",
    description: "A cozy apartment located in the heart of Helsinki.",
    price: 1200,
    location: {
      address: "Mannerheimintie 10",
      city: "Helsinki",
      state: "Uusimaa",
      zipCode: "00100",
    },
    squareFeet: 850,
    yearBuilt: 2010,
  },
  {
    title: "Modern House in Espoo",
    type: "House",
    description: "A spacious house with a beautiful garden.",
    price: 350000,
    location: {
      address: "Länsiväylä 25",
      city: "Espoo",
      state: "Uusimaa",
      zipCode: "02100",
    },
    squareFeet: 2000,
    yearBuilt: 2015,
  },
];

// --- Setup User and Token ---
beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    email: "john@example.com",
    password: "R3g5T7#gh",
  });
  token = result.body.token;
});

// --- Test Suite ---
describe("Protected Property Routes", () => {
  beforeEach(async () => {
    await Property.deleteMany({});
    await Promise.all([
      api.post("/api/properties").set("Authorization", "Bearer " + token).send(properties[0]),
      api.post("/api/properties").set("Authorization", "Bearer " + token).send(properties[1]),
    ]);
  });

  // GET all
  it("should return all properties as JSON when GET /api/properties is called", async () => {
    const response = await api
      .get("/api/properties")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(properties.length);
  });


  // POST create
  it("should create one property when POST /api/properties is called", async () => {
    const newProperty = {
      title: "Charming Cottage in Tampere",
      type: "House",
      description: "A peaceful countryside cottage with lake view.",
      price: 180000,
      location: {
        address: "Lakeside 12",
        city: "Tampere",
        state: "Pirkanmaa",
        zipCode: "33100",
      },
      squareFeet: 1100,
      yearBuilt: 2000,
    };

    const response = await api
      .post("/api/properties")
      .set("Authorization", "Bearer " + token)
      .send(newProperty)
      .expect(201);

    expect(response.body.title).toBe(newProperty.title);
  });

  // GET by ID
  it("should return one property by ID", async () => {
    const property = await Property.findOne();
    const response = await api
      .get(`/api/properties/${property._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(property.title);
  });

  // PATCH update
  it("should update one property by ID", async () => {
    const property = await Property.findOne();
    const updatedProperty = { description: "Updated description.", price: 999999 };

    const response = await api
      .put(`/api/properties/${property._id}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedProperty)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.description).toBe(updatedProperty.description);

    const updatedPropertyCheck = await Property.findById(property._id);
    expect(updatedPropertyCheck.price).toBe(updatedProperty.price);
  });

  // DELETE
  it("should delete one property by ID", async () => {
    const property = await Property.findOne();
    await api
      .delete(`/api/properties/${property._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const propertyCheck = await Property.findById(property._id);
    expect(propertyCheck).toBeNull();
  });
});

// Close DB
afterAll(async () => {
  await mongoose.connection.close();
});
