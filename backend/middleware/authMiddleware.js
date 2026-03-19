const asyncHandler = require("express-async-handler");
const { getUser } = require("./helpers/user.js");

const protect = asyncHandler(async (req, res, next) => {
  const { status, response } = await getUser(req);

  if (status === 200) {
    req.user = response;
    next();
  } else {
    res.status(status).json(response);
  }
});

module.exports = protect;