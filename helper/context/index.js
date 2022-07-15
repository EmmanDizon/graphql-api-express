const jwt = require("jsonwebtoken");
const User = require("../../config/models/user.model");

module.exports.verifyUser = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;

    const authToken = req.headers.authorization;

    if (authToken) {
      const payload = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });

      req.loggedInUserId = user.id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
