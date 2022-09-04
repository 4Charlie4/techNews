const router = require("express").Router();
const { User, Vote, Post } = require("../../models");

router.get("/", (req, res) => {
  //access User model and runs .findAll() method(equivalent to SELECT * FROM users) which comes from the Model class via Sequelize
  User.findAll({
    //excludes password column to hide passwords. in an array incase more needs to be added.
    //attributes: { exclude: ["password"] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  //findOne utilizes params to find specific data based on parameters in this case being the id(similar to SELECT * FROM users WHERE id=1)
  User.findOne({
    //attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_url", "created_at"],
      },
      {
        model: Post,
        attributes: ["title"],
        through: Vote,
        as: "voted_posts",
      },
    ],
  })
    //any data received from .findAll() passed through here
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  //We utilize .create() method to insert data (similar too INSERT INTO users(username, email, password) VALUES("x", "y", "z"))
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST carries req.body while GET carries request parameter in the URL string lik id:1. POST is better for login information
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "The email you entered was not found" });
      return;
    }
    //res.json({ user: dbUserData });
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: "Invalid Password" });
      return;
    }
    res.json({ user: dbUserData, message: "You are now logged in!" });
  });
});

router.put("/:id", (req, res) => {
  //this expects req.body to already match key/value pairs for username, password, and email

  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  //deletes data based on id then
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
