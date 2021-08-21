import { Router } from "express";
import {
  getMedias,
  writeMedias,
  upload,
  fileParse,
} from "../../util/fs-tools.js";
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
      imdbID: uniqid(),
      createdAt: new Date().toISOString(),
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
        updatedAt: new Date().toISOString(),
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

//post Poster to the local
mediaRouters.post(
  "/:id/poster",
  upload.single("poster"),
  fileParse,
  async (req, res, next) => {
    try {
      const films = await getMedias();
      const indexOfFilm = films.findIndex((fil) => fil.id === req.params.id);
      const unchangeFilm = films[indexOfFilm];
      if (indexOfFilm !== -1) {
        const updateFilm = {
          ...unchangeFilm,
          ...req.body,
          Poster: req.file,
          createdAt: new Date().toISOString(),
        };
        films[indexOfFilm] = updateFilm;
        await writeMedias(films);
        res.status(201).send(updateFilm);
      }
    } catch (error) {
      next(error);
    }
  }
);

mediaRouters.put(
  "/:id/poster",
  upload.single("poster"),
  fileParse,
  async (req, res, next) => {
    try {
      const films = await getMedias();
      const indexOfFilm = films.findIndex((fil) => fil.id === req.params.id);
      if (indexOfFilm !== -1) {
        const film = films[indexOfFilm];
        const updateFilm = {
          Poster: req.file,
          ...film,
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        console.log(updateFilm);
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
  }
);

mediaRouters.post("/:id/review", async (req, res, next) => {
  try {
    const films = await getMedias();
    const indexOfFilm = films.findIndex((fil) => fil.id === req.params.id);
    if (indexOfFilm !== -1) {
      const unchangeFilm = films[indexOfFilm];
      const changedFilm = {
        ...unchangeFilm,
        reviews: [
          {
            ...req.body,
            elementId: req.params.id,
            _id: uniqid(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
      films[indexOfFilm] = changedFilm;
      films.push(changedFilm);
      await writeMedias(films);
      res.status(201).send(changedFilm);
    } else {
      next(createHttpError(404, `Id ${req.params.id} NOT found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediaRouters;
