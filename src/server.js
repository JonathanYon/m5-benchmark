import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouters from "./service/media/index.js";
import {
  notFoundHandler,
  forbidenHandler,
  genericErrorHandler,
  badRequestHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use("/media", mediaRouters);

server.use(notFoundHandler);
server.use(forbidenHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("server running on port-", port);
});
