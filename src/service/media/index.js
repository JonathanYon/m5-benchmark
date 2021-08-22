import { Router } from "express";
import {
  getMedias,
  writeMedias,
  upload,
  fileParse,
} from "../../util/fs-tools.js";
import createHttpError from "http-errors";
import uniqid from "uniqid";
import { validationResult } from "express-validator";
import { mediaValidator, reviewValidator } from "./validation.js";
import axios from "axios";

const mediaRouters = Router();

// get all film
// mediaRouters.get("/", async (req, res, next) => {
//   try {
//     const films = await getMedias();
//     // console.log("all them films", films);
//     res.status(200).send(films);
//   } catch (error) {
//     next(error);
//   }
// });
// search by title
mediaRouters.get("/search", async (req, res, next) => {
  try {
    const films = await getMedias();
    // console.log("all them films", films);
    console.log(req.query);
    console.log("title", req.query.Title);
    if (req.query) {
      const movies = films.filter((film) =>
        film.Title.toLowerCase().includes(req.query.Title.toLowerCase())
      );
      res.send(movies);
    } else {
      res.send(films);
    }
    console.log(movies);
  } catch (error) {
    next(error);
  }
});
//get one film
mediaRouters.get("/:id", async (req, res, next) => {
  try {
    const films = await getMedias();
    const film = films.find((fil) => fil.imdbID === req.params.id);
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
//post film
mediaRouters.post("/", mediaValidator, async (req, res, next) => {
  try {
    const films = await getMedias();
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      next(createHttpError(400, { error: errorList }));
    } else {
      const newFilm = {
        ...req.body,
        imdbID: uniqid(),
        createdAt: new Date().toISOString(),
      };
      films.push(newFilm);
      await writeMedias(films);
      res.status(201).send(newFilm);
    }
  } catch (error) {
    next(error);
  }
});
//update film
mediaRouters.put("/:id", async (req, res, next) => {
  try {
    const films = await getMedias();
    const indexOfFilm = films.findIndex((fil) => fil.imdbID === req.params.id);
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
//delete film
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
      const indexOfFilm = films.findIndex(
        (fil) => fil.imdbID === req.params.id
      );
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
//update Poster to the local
mediaRouters.put(
  "/:id/poster",
  upload.single("poster"),
  fileParse,
  async (req, res, next) => {
    try {
      const films = await getMedias();
      const indexOfFilm = films.findIndex(
        (fil) => fil.imdbID === req.params.id
      );
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
//post review
mediaRouters.post("/:id/review", reviewValidator, async (req, res, next) => {
  try {
    const films = await getMedias();
    const errorList = validationResult(req);
    if (!errorList.isEmpty()) {
      next(createHttpError(400, { error: errorList }));
    } else {
      const indexOfFilm = films.findIndex(
        (fil) => fil.imdbID === req.params.id
      );
      const film = films.find((fil) => fil.imdbID === req.params.id);
      if (indexOfFilm !== -1 && film.reviews === undefined) {
        let unchangeFilm = films[indexOfFilm];
        let changedFilm = {
          ...unchangeFilm,
          reviews: [
            {
              ...req.body,
              elementID: req.params.id,
              _id: uniqid(),
              createdAt: new Date().toISOString(),
            },
          ],
        };

        films[indexOfFilm] = changedFilm;
        await writeMedias(films);
        res.status(201).send(changedFilm);
      } else if (indexOfFilm !== -1 && film.reviews) {
        let unchangeFilm = films[indexOfFilm];
        let changedFilm = {
          ...unchangeFilm,
        };
        changedFilm.reviews.push({
          ...req.body,
          elementID: req.params.id,
          _id: uniqid(),
          createdAt: new Date().toISOString(),
        });
        films[indexOfFilm] = changedFilm;
        await writeMedias(films);
        res.status(201).send(changedFilm);
      } else {
        next(createHttpError(404, `Id ${req.params.id} NOT found!`));
      }
    }
  } catch (error) {
    next(error);
  }
});
// delete review
mediaRouters.delete("/:id/review/:commentId", async (req, res, next) => {
  try {
    const films = await getMedias();
    // console.log("allfilms-->", films);
    const film = films.find((fil) => fil.imdbID === req.params.id);
    // console.log("film-->", film);
    if (film) {
      const allReviews = film.reviews.filter(
        (review) => review._id !== req.params.commentId
      );
      // console.log("film-->", allReviews);
      film.reviews = allReviews;
      await writeMedias(films);
      res.send();
    } else {
      next(createHttpError(404, `${req.params.id} is not Found!`));
    }
  } catch (error) {
    next();
  }
});

export default mediaRouters;
