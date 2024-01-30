import jwt from "jsonwebtoken";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Please authenticate using a valid token",
    });
  }

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Please authenticate using a valid token",
    });
  }
};

export default fetchuser;
