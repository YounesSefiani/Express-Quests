require("dotenv").config();

const port = process.env.APP_PORT;
const express = require("express");

const app = express();

app.use(express.json());

const movieControllers = require("./controllers/movieControllers");
const validateMovie = require("./middlewares/validateMovie");
// const validateUser = require("./middlewares/validateUser");
const { body, validationResult } = require('express-validator');

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", movieControllers.getUsers);
app.get("/api/users/:id", movieControllers.getUsersById);
app.post("/api/movies", validateMovie, movieControllers.postMovie);
app.post(
  "/api/users",
  body("firstname").isLength({ min: 1, max: 255 }),
  body("lastname").isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
  movieControllers.postUsers
);
app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", movieControllers.updateUsers);

module.exports = app;
