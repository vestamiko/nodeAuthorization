const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");

const {
  createAd,
  getAllMyAds,
  getOneAd,
  getAllAds,
  updateAd,
  deleteAd,
} = require("../controller/adControllers.js");
const protect = require("../middleware/authMiddleware.js");

///
router.post("/:id/like", protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const userId = req.user.id;

    const alreadyLiked = ad.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      ad.likes = ad.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      ad.likes.push(userId);
    }

    await ad.save();
    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Like failed" });
  }
});
///

router.route("/").post(protect, createAd).get(protect, getAllMyAds);
router.route("/all").get(getAllAds);
router
  .route("/:id")
  .get(getOneAd)
  .put(protect, updateAd)
  .delete(protect, deleteAd);

module.exports = router;
