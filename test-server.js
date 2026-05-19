const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const mysql = require("mysql2");

const app = express();

// Create uploads directory
const uploadsDir = path.join(__dirname, "client", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    }
});

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "esports_system"
});

db.connect(err => {
    if (err) {
        console.log("⚠️  Database not connected. Please import database/schema.sql in phpMyAdmin");
    } else {
        console.log("✅ Database Connected");
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload route
app.post("/api/upload", upload.single("logo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ message: "File uploaded successfully", fileUrl: fileUrl });
});

// Team routes
const teamRoutes = require("./server/routes/teamRoutes");
const playerRoutes = require("./server/routes/playerRoutes");
const matchRoutes = require("./server/routes/matchRoutes");
const lineupRoutes = require("./server/routes/lineupRoutes");

app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/lineups", lineupRoutes);

// Serve static files
app.use(express.static("client"));

// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
});
