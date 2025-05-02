// routes/doctorRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// configure multer to save into /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// POST /api/add-doctor (now accepts image)
router.post(
  "/add-doctor",
  upload.single("image"),               // ← multer middleware
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        rating: parseFloat(req.body.rating),
      };
      if (req.file) {
        // save the public URL or file path
        data.image = `/uploads/${req.file.filename}`;
      }
      const doctor = new Doctor(data);
      await doctor.save();
      res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add doctor" });
    }
  }
);

// GET /api/list-doctor-with-filter?page=1&limit=10&specialty=...&location=...
router.get("/list-doctor-with-filter", async (req, res) => {
  const { page = 1, limit = 10, specialty, location } = req.query;

  const filters = {};
  if (specialty) filters.specialty = specialty;
  if (location) filters.location = location;

  try {
    const doctors = await Doctor.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Doctor.countDocuments(filters);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// NEW: GET /api/specialties
router.get("/specialties", async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialty");
    res.json({ specialties });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specialties" });
  }
});

// NEW: GET /api/locations
router.get("/locations", async (req, res) => {
  try {
    const locations = await Doctor.distinct("location");
    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

export default router;
