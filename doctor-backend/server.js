import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // Added for directory creation
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";

dotenv.config();

const app = express();
connectDB();

// __dirname hack for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created');
}

app.use(cors());
app.use(express.json());

// 2. Enhanced static file serving with error handling
// app.use("/uploads", (req, res, next) => {
//   express.static(path.join(__dirname, "uploads"), {
//     setHeaders: (res, path) => {
//       // Set proper cache headers
//       res.set('Cache-Control', 'public, max-age=31536000');
//     }
//   })(req, res, next);
// }, (err, req, res, next) => {
//   if (err) {
//     console.error('Static file error:', err);
//     res.status(404).json({ error: 'Image not found' });
//   }
// });

// Replace your current static file serving with this:
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=31536000');
  },
  fallthrough: false // Important for production
}));

// Add this for your placeholder image
app.use(express.static(path.join(__dirname, 'public')));

// 3. Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", doctorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});