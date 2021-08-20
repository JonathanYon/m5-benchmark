import { Router } from "express";
import { getMedias, writeMedias } from "../../util/fs-tools.js";
import createHttpError from "http-errors";

const mediaRouters = Router();

mediaRouters.get("/", async (req, res, next) => {
  try {
    const films = await getMedias();
    res.status(200).send(films);
  } catch (error) {
    next(error);
  }
});
mediaRouters.get("/:id", async (req, res, next) => {
  try {
    const films = await getMedias();
    const film = films.find((fil) => fil.id === req.params.id);
    if (film) {
      res.status(200).send(film);
    } else {
      next(
        createHttpError(
          404,
          `The movie with an id ${req.params.id} is not Found!`
        )
      );
    }
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