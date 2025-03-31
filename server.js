require("dotenv").config();  // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());  // Allow CORS
app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define a Watch Schema
const WatchSchema = new mongoose.Schema({
    brand: { type: String, required: true, lowercase: true }, // 🔹 Stores brands in lowercase
    model: { type: String, required: true },
    type: { type: String, required: true },
    movement: { type: String, required: true },
    price_range: { type: Number, required: true },
    water_resistance_m: { type: Number, required: true },
    features: { type: [String], required: true },
    use_case: { type: String, required: true }
});

// Create the Watch model based on the schema
const Watch = mongoose.model("Watch", WatchSchema);

// Define Routes (API endpoints)

// Get all watches
app.get("/watches", async (req, res) => {
    try {
        const { brand, maxPrice, type, movement, use_case } = req.query;
        let filters = {};

        if (brand) filters.brand = new RegExp(`^${brand}$`, "i");
        if (maxPrice) filters.price_range = { $lte: parseInt(maxPrice) };
        if (type) filters.type = type;
        if (movement) filters.movement = movement;
        if (use_case) filters.use_case = use_case;

        console.log("Filters applied:", filters); // ✅ Logs applied filters

        const watches = await Watch.find(filters);
        console.log("Query results:", watches); // ✅ Logs database results

        res.json(watches);
    } catch (err) {
        console.error("Error fetching watches:", err);
        res.status(500).json({ message: err.message });
    }
});

// Add a new watch
app.post("/watches", async (req, res) => {
    const { brand, model, type, movement, price_range, water_resistance_m, features, use_case } = req.body;

    if (!brand || !model || !type || !movement || !price_range || !water_resistance_m || !features || !use_case) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const watch = new Watch({
        brand,
        model,
        type,
        movement,
        price_range,
        water_resistance_m,
        features,
        use_case
    });

    try {
        const savedWatch = await watch.save();
        res.status(201).json(savedWatch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
