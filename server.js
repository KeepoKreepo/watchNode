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
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }
});

// Create the Watch model based on the schema
const Watch = mongoose.model("Watch", WatchSchema);

// Define Routes (API endpoints)

// Get all watches
app.get("/watches", async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new watch
app.post("/watches", async (req, res) => {
    const { name, brand, price, category } = req.body;

    const watch = new Watch({
        name,
        brand,
        price,
        category
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
