import fs from "fs-extra";
import { fileURLToPath } from "url";
import { extname, dirname, join } from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const mediaJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../service/data/media.json"
);

const reviewJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../service/data/review.json"
);
const publicPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public"
);

// const storage = new CloudinaryStorage({
//   cloudinary,
//   folder: "netflix",
// });

// export const parser = multer({ storage: storage });

console.log(mediaJsonPath);

export const upload = multer();
export const fileParse = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extention = extname(originalname);
    const fileName = `${req.params.id}${extention}`;
    const pathToFile = join(publicPath, fileName);
    fs.writeFile(pathToFile, buffer);
    const link = `http://localhost:${process.env.PORT}/${fileName}`;
    req.file = link;
    console.log(
      `req.file =>📁: ${req.file}, fs.writeFile(pathToFile, buffer) is => 🏁: ${fileName}`
    );
    next();
  } catch (error) {
    next(error);
  }
};

export const getMedias = () => fs.readJSON(mediaJsonPath);
export const writeMedias = (content) => fs.writeJson(mediaJsonPath, content);
export const getReviews = () => fs.readJSON(reviewJsonPath);
export const writeReviews = (content) => fs.writeJson(reviewJsonPath, content);
