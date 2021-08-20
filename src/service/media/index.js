import { Router } from "express";

const mediaRouters = Router();

mediaRouters.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
mediaRouters.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
mediaRouters.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
mediaRouters.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
mediaRouters.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default mediaRouters;
