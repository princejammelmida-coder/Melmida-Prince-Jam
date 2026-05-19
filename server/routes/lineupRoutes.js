const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Register match lineup
router.post("/register", (req, res) => {
    const { match_id, team_id, player_id, position, is_substitute } = req.body;

    if (!match_id || !team_id || !player_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO match_lineups (match_id, team_id, player_id, position, is_substitute) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [match_id, team_id, player_id, position, is_substitute || false], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to register lineup" });
        }
        res.json({ message: "Lineup registered successfully", lineup_id: result.insertId });
    });
});

// Get lineup for a specific match
router.get("/match/:match_id", (req, res) => {
    const { match_id } = req.params;

    const sql = `
        SELECT ml.*, p.player_name, p.game_username, t.team_name 
        FROM match_lineups ml
        JOIN players p ON ml.player_id = p.player_id
        JOIN teams t ON ml.team_id = t.team_id
        WHERE ml.match_id = ?
        ORDER BY ml.team_id, ml.is_substitute, ml.position
    `;

    db.query(sql, [match_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch lineup" });
        }
        res.json(results);
    });
});

// Get lineup for a specific team in a match
router.get("/match/:match_id/team/:team_id", (req, res) => {
    const { match_id, team_id } = req.params;

    const sql = `
        SELECT ml.*, p.player_name, p.game_username 
        FROM match_lineups ml
        JOIN players p ON ml.player_id = p.player_id
        WHERE ml.match_id = ? AND ml.team_id = ?
        ORDER BY ml.is_substitute, ml.position
    `;

    db.query(sql, [match_id, team_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch team lineup" });
        }
        res.json(results);
    });
});

// Update lineup
router.put("/:lineup_id", (req, res) => {
    const { lineup_id } = req.params;
    const { position, is_substitute } = req.body;

    const sql = "UPDATE match_lineups SET position = ?, is_substitute = ? WHERE lineup_id = ?";

    db.query(sql, [position, is_substitute, lineup_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update lineup" });
        }
        res.json({ message: "Lineup updated successfully" });
    });
});

// Delete lineup entry
router.delete("/:lineup_id", (req, res) => {
    const { lineup_id } = req.params;

    const sql = "DELETE FROM match_lineups WHERE lineup_id = ?";

    db.query(sql, [lineup_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to delete lineup" });
        }
        res.json({ message: "Lineup deleted successfully" });
    });
});

module.exports = router;
