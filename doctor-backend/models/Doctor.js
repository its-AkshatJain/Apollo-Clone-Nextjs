// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  location: String,
  experience: String,
  rating: Number,
  image: String,                
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
