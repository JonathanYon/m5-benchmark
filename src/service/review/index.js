import { Router } from "express";

const reviewRouter = Router();

reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await getMedias();
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
});
reviewRouter.get("/:id", async (req, res, next) => {
  try {
    const reviews = await getMedias();
    const review = reviews.find((fil) => fil.id === req.params.id);
    if (review) {
      res.status(200).send(review);
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
reviewRouter.post("/", async (req, res, next) => {
  try {
    const reviews = await getMedias();
    const newReview = {
      ...req.body,
      id: uniqid(),
      createdAt: new Date(),
    };
    reviews.push(newReview);
    await writeMedias(reviews);
    res.status(201).send(newReview);
  } catch (error) {
    next(error);
  }
});
reviewRouter.put("/:id", async (req, res, next) => {
  try {
    const reviews = await getMedias();
    const indexOfReview = reviews.findIndex((fil) => fil.id === req.params.id);
    if (indexOfReview !== -1) {
      const review = reviews[indexOfReview];
      const updateReview = {
        ...review,
        ...req.body,
        updatedAt: new Date(),
      };
      reviews[indexOfReview] = updateReview;
      await writeMedias(reviews);
      res.status(201).send(updateReview);
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
reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getMedias();
    const allreviews = reviews.filter((review) => review.id !== req.params.id);
    await writeMedias(allreviews);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
