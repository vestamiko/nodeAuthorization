const express = require("express");
const router = express.Router();

const {
  createAd,
  getAllMyAds,
  getOneAd,
  getAllAds,
  updateAd,
  deleteAd,
} = require("../controller/adControllers.js");
const protect = require("../middleware/authMiddleware.js");

router.route("/").post(protect, createAd).get(protect, getAllMyAds);
router.route("/all").get(getAllAds);
router
  .route("/:id")
  .get(getOneAd)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

module.exports = router;
