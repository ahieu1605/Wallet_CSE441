import express from "express";
import {sql} from "../config/db.js";
const router = express.Router();

router.post("/", async (req, res) => {
    const { userId, username } = req.body;
    try {
        const result = await sql.query(
            "INSERT INTO profiles (profile_id,0, username) VALUES ($1, $3) RETURNING *",
            [userId, username]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to create profile" });
    }
});

export default router;
