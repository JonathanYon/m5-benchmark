import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const mediaJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
);

export const getMedias = () => fs.readFileSync(mediaJsonPath);
export const writeMedias = (content) =>
  fs.writeFileSync(mediaJsonPath, content);
