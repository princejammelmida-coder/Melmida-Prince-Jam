const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Register a new team
router.post("/register", (req, res) => {
    const { team_name, captain_name, email, game, team_logo } = req.body;

    if (!team_name || !captain_name || !email || !game) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO teams (team_name, captain_name, email, game, team_logo) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [team_name, captain_name, email, game, team_logo], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to register team" });
        }
        res.json({ message: "Team registered successfully", team_id: result.insertId });
    });
});

// Get all teams
router.get("/", (req, res) => {
    const sql = "SELECT * FROM teams ORDER BY registration_date DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch teams" });
        }
        res.json(results);
    });
});

// Get team by ID
router.get("/:team_id", (req, res) => {
    const { team_id } = req.params;

    const sql = "SELECT * FROM teams WHERE team_id = ?";

    db.query(sql, [team_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch team" });
        }
        res.json(results[0]);
    });
});

// Update team
router.put("/:team_id", (req, res) => {
    const { team_id } = req.params;
    const { team_name, captain_name, email, game, team_logo, status } = req.body;

    const sql = "UPDATE teams SET team_name = ?, captain_name = ?, email = ?, game = ?, team_logo = ?, status = ? WHERE team_id = ?";

    db.query(sql, [team_name, captain_name, email, game, team_logo, status, team_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update team" });
        }
        res.json({ message: "Team updated successfully" });
    });
});

// Delete team
router.delete("/:team_id", (req, res) => {
    const { team_id } = req.params;

    const sql = "DELETE FROM teams WHERE team_id = ?";

    db.query(sql, [team_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete team" });
        }
        res.json({ message: "Team deleted successfully" });
    });
});

module.exports = router;