import { Router } from "express";
import { getMedias, writeMedias } from "../../util/fs-tools.js";
import createHttpError from "http-errors";
import uniqid from "uniqid";

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
    const films = await getMedias();
    const newFilm = {
      ...req.body,
      id: uniqid(),
      createdAt: new Date(),
    };
    films.push(newFilm);
    await writeMedias(films);
    res.status(201).send(newFilm);
  } catch (error) {
    next(error);
  }
});
mediaRouters.put("/:id", async (req, res, next) => {
  try {
    const films = await getMedias();
    const indexOfFilm = films.findIndex((fil) => fil.id === req.params.id);
    if (indexOfFilm !== -1) {
      const film = films[indexOfFilm];
      const updateFilm = {
        ...film,
        ...req.body,
        updatedAt: new Date(),
      };
      films[indexOfFilm] = updateFilm;
      await writeMedias(films);
      res.status(201).send(updateFilm);
    } else {
      next(
        createHttpError(
          404,
          `The movie with id ${req.params.id} could NOT found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
mediaRouters.delete("/:id", async (req, res, next) => {
  try {
    const films = await getMedias();
    const allFilms = films.filter((film) => film.id !== req.params.id);
    await writeMedias(allFilms);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default mediaRouters;
