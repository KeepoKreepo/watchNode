# 🧠 watchNode - Backend API for WatchShop

**watchNode** is a RESTful backend API built with **Node.js**, **Express**, and **MongoDB**, developed for the WatchShop Android app (created as part of a university Mobile Applications module). It handles product data (watches), supports query-based filtering, and exposes endpoints for retrieving and adding watch entries.

---

## 🚀 Features

- 🌐 **REST API** to serve watch data
- 🔍 **Flexible filtering** via query parameters (e.g., brand, type, features, etc.)
- ➕ **Add new watches** via POST request
- 🧩 **MongoDB integration** using Mongoose
- 🛡️ **CORS-enabled** for frontend compatibility
- 🛠️ **Environment-based config** via `.env`
- ☁️ **Deployed to Render**

---

## 📦 Endpoints

### ✅ `GET /watches`

Fetches all watches, or filters results using query parameters.

#### Example Query:

```http
GET /watches?brand=Seiko&type=dress&features=chronograph,solar
````

#### Example Response:

```json
[
  {
    "_id": "615cbd...",
    "brand": "seiko",
    "model": "Presage SRPB41",
    "type": "dress",
    "movement": "automatic",
    "price_range": 3,
    "features": ["chronograph", "solar"],
  }
]
```

---

### ➕ `POST /watches`

Adds a new watch to the database.

#### Required Fields in Body:

```json
{
  "brand": "Seiko",
  "model": "Presage SRPB41",
  "type": "dress",
  "movement": "automatic",
  "case_material": "stainless steel",
  "bracelet_material": "leather",
  "price_range": 3,
  "water_resistance_m": "50m",
  "diameter": "40mm",
  "features": ["chronograph", "solar"],
  "use_case": "formal",
  "description": "A classy automatic dress watch with a blue dial.",
  "images": ["https://example.com/image1.jpg"]
}
```

Returns the newly created watch object upon success.

---

## ☁️ Deployment

The API is deployed using [Render](https://render.com/).

```
https://watchapi-r08y.onrender.com/

```
---
