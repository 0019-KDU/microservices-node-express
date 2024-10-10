import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader === null || authHeader === undefined) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const token = authHeader;

  //Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized",
      });
    }
    req.user = payload;
    next();
  });
};

export default authMiddleware;
