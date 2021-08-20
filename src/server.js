import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(cors());

console.table(listEndpoints, server);
server.listen(port, () => {
  console.log("server running on port-", port);
});
