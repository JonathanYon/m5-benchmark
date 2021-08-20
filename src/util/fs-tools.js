import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const mediaJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../service/data/media.json"
);
console.log(mediaJsonPath);

export const getMedias = () => fs.readJSON(mediaJsonPath);
export const writeMedias = (content) => fs.writeJson(mediaJsonPath, content);
