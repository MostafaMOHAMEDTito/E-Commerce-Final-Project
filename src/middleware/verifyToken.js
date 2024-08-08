import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const {token} = req.headers; 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "mostafa", (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token", error });
    }
    req.user = decoded; 
    next(); 
  });
};
