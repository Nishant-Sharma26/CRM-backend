const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const Joi = require("joi");
const multer = require("multer");
const AWS = require("aws-sdk");
const auth = require("../middleware/auth");


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const upload = multer({ dest: "uploads/" });

const candidateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  jobTitle: Joi.string().required(),
});

router.use(auth);

router.post("/", upload.single("resume"), async (req, res) => {
  const { error } = candidateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let resumeUrl = "";
  if (req.file) {
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${Date.now()}_${req.file.originalname}`,
      Body: require("fs").createReadStream(req.file.path),
    };
    const data = await s3.upload(params).promise();
    resumeUrl = data.Location;
  }

  const candidate = new Candidate({ ...req.body, resumeUrl });
  await candidate.save();
  res.status(201).json({ candidateId: candidate._id, message: "Candidate referred", resumeUrl });
});


router.get("/", async (req, res) => {
  const { jobTitle, status } = req.query;
  const query = {};
  if (jobTitle) query.jobTitle = new RegExp(jobTitle, "i");
  if (status) query.status = status;

  const candidates = await Candidate.find(query);
  res.json(candidates);
});


router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Reviewed", "Hired"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  await Candidate.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() });
  res.json({ message: "Status updated" });
});


router.delete("/:id", async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: "Candidate deleted" });
});

module.exports = router;