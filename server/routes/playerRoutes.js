const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Register a new player
router.post("/register", (req, res) => {
    const { team_id, player_name, game_username, email, phone, role } = req.body;

    if (!team_id || !player_name || !game_username || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO players (team_id, player_name, game_username, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [team_id, player_name, game_username, email, phone, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to register player" });
        }
        res.json({ message: "Player registered successfully", player_id: result.insertId });
    });
});

// Get all players
router.get("/", (req, res) => {
    const sql = "SELECT p.*, t.team_name FROM players p LEFT JOIN teams t ON p.team_id = t.team_id";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch players" });
        }
        res.json(results);
    });
});

// Get players by team
router.get("/team/:team_id", (req, res) => {
    const { team_id } = req.params;

    const sql = "SELECT * FROM players WHERE team_id = ?";

    db.query(sql, [team_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch team players" });
        }
        res.json(results);
    });
});

// Update player
router.put("/:player_id", (req, res) => {
    const { player_id } = req.params;
    const { player_name, game_username, email, phone, role } = req.body;

    const sql = "UPDATE players SET player_name = ?, game_username = ?, email = ?, phone = ?, role = ? WHERE player_id = ?";

    db.query(sql, [player_name, game_username, email, phone, role, player_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update player" });
        }
        res.json({ message: "Player updated successfully" });
    });
});

// Delete player
router.delete("/:player_id", (req, res) => {
    const { player_id } = req.params;

    const sql = "DELETE FROM players WHERE player_id = ?";

    db.query(sql, [player_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete player" });
        }
        res.json({ message: "Player deleted successfully" });
    });
});

module.exports = router;
