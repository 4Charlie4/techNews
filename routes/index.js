const router = require("express").Router();
const apiRoutes = require("./apiRoutes");

router.use("/api", apiRoutes);

//RESTful API practice
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
