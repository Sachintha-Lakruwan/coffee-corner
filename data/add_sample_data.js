const category_data = require("./sample_categories.json");
const product_data = require("./sample_products.json");
const Category = require("../backend/model/category");
const Product = require("../backend/model/product");

const API = process.env.API_URL || "/api/v1";
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 3001;

const categories = category_data["categories"];
const products = product_data["products"];

async function createAdminAccount() {
  try {
    const response = await fetch(`${BASE_URL}${PORT}${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Admin2",
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
  const saved_categories = [];
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
    saved_categories.push(result);
  }
  return saved_categories;
}

async function postProdcuts(saved_categories, token) {
  let id_map = {};

  for (let i = 0; i < categories.length; i++) {
    id_map[categories[i]["id"]] = saved_categories[i]["id"];
  }

  for (let i = 0; i < products.length; i++) {
    const response = await fetch(
      BASE_URL + PORT.toString() + API + "/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...products[i],
          category: id_map[products[i]["category"]["$oid"]],
        }),
      }
    );

    const result = await response.json();
    console.log(result);
  }
}

async function postData() {
  const token = await createAdminAccount();
  const result = await postCategories(token);
  postProdcuts(result, token);
}

postData();
