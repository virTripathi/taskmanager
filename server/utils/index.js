import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
  });
};

export const validate = (req,res,next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      statusCode: 400,
      message: 'Validation failed',
      stack: errors.array(),
    });
  }
  next();
}