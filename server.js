const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true, 
}));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/candidates", require("./routes/candidates"));
app.use("/api/auth", require("./routes/auth"));


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});


const PORT = process.env.PORT || 5000; // Default to 5000 if PORT not set
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1); 
});