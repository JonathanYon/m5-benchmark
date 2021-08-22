import { body } from "express-validator";

export const mediaValidator = [
  body("Title").isLength({ min: 1 }).exists().withMessage("Title Requierd!"),
  body("Type").exists().withMessage("Type is Required!"),
  body("Year").exists().isLength({ min: 4 }),
  body("Year").exists().isLength({ min: 4 }),
];

export const reviewValidator = [
  body("comment")
    .isLength({ min: 10 })
    .exists()
    .withMessage("comments should be atleast 10 characters!"),
  body("rate")
    .exists()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rate is Required!"),
];
