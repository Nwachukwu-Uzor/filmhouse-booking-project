import { validationResult } from "express-validator";

export const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let error = "";

    errors.array().forEach((err) => {
      error += ` ${err?.msg};`;
    });
    return res.status(400).json({ message: error });
  }

  next();
};
