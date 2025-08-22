const data = require("./sample_categories.json");
const Category = require("../backend/model/category");
const { error } = require("console");

const API = process.env.API_URL || "/api/v1";
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 3001;

const categories = data["categories"];

async function createAdminAccount() {
  try {
    const response = await fetch(`${BASE_URL}${PORT}${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Admin1",
        email: "admin@example.com",
        password: "password123",
        street: "123 Main St",
        apartment: "Apt 4B",
        city: "New York",
        zip: "10001",
        country: "USA",
        phone: "1234567890",
        isAdmin: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    const loginResponse = await fetch(`${BASE_URL}${PORT}${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "password123",
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(errorData.message || loginResponse.statusText);
    }

    const data = await loginResponse.json();

    if (!data.token) {
      throw new Error("Login successful but token not returned");
    }

    return data.token;
  } catch (err) {
    console.error("Error creating admin account:", err.message);
    throw err;
  }
}

async function postCategories(token) {
  for (let i = 0; i < categories.length; i++) {
    const response = await fetch(
      BASE_URL + PORT.toString() + API + "/categories",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categories[i]),
      }
    );

    const result = await response.json();
    console.log(result);
  }
}

async function postData() {
  const token = await createAdminAccount();
  postCategories(token);
}

postData();
