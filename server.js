const express = require("express");
const routes = require("./routes");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//utilize routes (no need to import all other files/folders within routes folder)
app.use(routes);

//turns on connection to db and server
//sync pulls models and connects them to associated databases
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
