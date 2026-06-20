const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  console.log("AUTH HEADER:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("VERIFY SECRET:", process.env.JWT_SECRET);
      
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded;

      next();

    } catch (error) {
        console.log(error);

        return res.status(401).json({
        success: false,
        message: error.message
  });
}
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }
};

module.exports = { protect };