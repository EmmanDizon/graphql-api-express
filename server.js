require("dotenv").config();
require("./config/database")();

const cors = require("cors");
const graphqlServer = require("./graphql-server");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

graphqlServer.start().then((res) => {
  graphqlServer.applyMiddleware({ app, path: "/graphql" });
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
});
