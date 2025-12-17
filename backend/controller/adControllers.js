const asyncHandler = require("express-async-handler");
const Ad = require("../model/Ad.js");

// Create ad
// POST
// @route  /ads
/// Private owner, admin

const createAd = asyncHandler(async (req, res) => {
  //  const {title, description, price} = req.body;

  if (!req.body.title || !req.body.description || !req.body.price) {
    res.status(400);
    throw new Error("Please fill required fields");
  }

  const ad = await Ad.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    userID: req.user.id,
  });
  res.status(200).json(ad);
});

/// get all my ads
/// get
// @route /ads

const getAllMyAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({
    userID: req.user.id,
  });
  res.status(200).json(ads);
});

// get one ad
// GET
// @route /ads/:id
// PRIVATE
const getOneAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  res.status(200).json(ad);
});

// Get all ads
// GET
// @route /ads/all
// PUBLIC
const getAllAds = asyncHandler(async (req, res) => {
  const allAds = await Ad.find();
  res.status(200).json(allAds);
});

/// UPDATE ad
/// put
/// @route /ads/:id
/// private
const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (ad.userID.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }
  if (req.user.role === "admin" || ad.userID.toString() === req.user.id) {
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedAd);
  }
});

/// Delete one ad
/// DELETE
/// @route / ad/:id
/// PRIVATE
const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    res.status(404);
    throw new Error("Ad not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (ad.userID.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Ad.findByIdAndDelete(req.params.id);

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  createAd,
  getAllMyAds,
  getOneAd,
  getAllAds,
  updateAd,
  deleteAd,
};
