// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();

const app = express();
connectDB();

// __dirname hack for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.CLIENT_URL,  // allow your Vite frontend
  credentials: true,                // if you send cookies / auth headers
}));
app.use(express.json());

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
