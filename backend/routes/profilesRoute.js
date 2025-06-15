import express from "express";
import {sql} from "../config/db.js";
const router = express.Router();

router.post("/", async (req, res) => {
    const { profile_id, username } = req.body;
    try {
        const result = await sql`
            INSERT INTO profiles (profile_id, custom_startMonth, username)
            VALUES (${profile_id}, 1, ${username})
                RETURNING *`;
        res.status(201).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to create profile" });
    }
});

export default router;
