const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Create a new match
router.post("/create", (req, res) => {
    const { match_name, game, match_date, venue } = req.body;

    if (!match_name || !game || !match_date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO matches (match_name, game, match_date, venue) VALUES (?, ?, ?, ?)";

    db.query(sql, [match_name, game, match_date, venue], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to create match" });
        }
        res.json({ message: "Match created successfully", match_id: result.insertId });
    });
});

// Get all matches
router.get("/", (req, res) => {
    const sql = "SELECT * FROM matches ORDER BY match_date DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch matches" });
        }
        res.json(results);
    });
});

// Get match by ID
router.get("/:match_id", (req, res) => {
    const { match_id } = req.params;

    const sql = "SELECT * FROM matches WHERE match_id = ?";

    db.query(sql, [match_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch match" });
        }
        res.json(results[0]);
    });
});

// Update match status
router.put("/:match_id/status", (req, res) => {
    const { match_id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE matches SET status = ? WHERE match_id = ?";

    db.query(sql, [status, match_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update match status" });
        }
        res.json({ message: "Match status updated successfully" });
    });
});

module.exports = router;
