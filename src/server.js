import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouters from "./service/media/index.js";

const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use("/media", mediaRouters);

console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("server running on port-", port);
});
