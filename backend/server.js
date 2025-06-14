import express from "express";
import {sql} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import dotenv from "dotenv";
import job from "./config/cron.js";
import profilesRoute from "./routes/profilesRoute.js";

dotenv.config();
const app = express();

if(process.env.NODE_ENV !== "production") job.start();

//middleware
// app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;





//////////////////////

app.use("/api/transactions",transactionsRoute);
app.use("/api/profiles", profilesRoute);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
