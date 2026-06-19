const express = require("express");
const router = express.Router();

const {
  createService,
  getServices,
  getSingleService,
  updateService,
  deleteService
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createService);
router.get("/", getServices);
router.get("/:id", getSingleService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;