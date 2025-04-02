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
    price_range: { type: Double, required: true },
    water_resistance_m: { type: String, required: true },
    features: { type: [String], required: true },
    use_case: { type: String, required: true },
    images: { type: [String], required: false }
});

// Create the Watch model based on the schema
const Watch = mongoose.model("Watch", WatchSchema);

// Define Routes (API endpoints)

// Get all watches
app.get("/watches", async (req, res) => {
    try {
        let filters = {};  

        // Loop through query parameters and add them as filters
        for (let key in req.query) {
            if (req.query[key]) {
                // Handle special case for arrays (features)
                if (key === "features") {
                    filters[key] = { $in: req.query[key].split(",") }; // Allow multiple feature search
                } 
                // Handle case-insensitive string matching
                else if (typeof req.query[key] === "string") {
                    filters[key] = new RegExp(req.query[key], "i");
                } 
                // Handle number fields
                else {
                    filters[key] = req.query[key];
                }
            }
        }

        console.log("Filters applied:", filters); // Debugging
        const watches = await Watch.find(filters);
        res.json(watches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new watch
app.post("/watches", async (req, res) => {
    const { brand, model, type, movement, price_range, water_resistance_m, features, use_case, images } = req.body;

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
        use_case,
        images
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
