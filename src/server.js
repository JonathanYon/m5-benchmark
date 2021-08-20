import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouters from "./service/media/index.js";
import reviewRouter from "./service/review/index.js";

const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use("/media", mediaRouters);
server.use("/review", reviewRouter);

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("server running on port-", port);
});
