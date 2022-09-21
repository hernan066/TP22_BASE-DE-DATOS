const db = require("../database/models");
const sequelize = db.sequelize;
const moment = require("moment");
const { validationResult } = require("express-validator");

//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    db.Genre.findAll({
      order: ["name"],
    })
      .then((genres) => {
        res.render("moviesAdd", { genres });
      })
      .catch((err) => console.log(err));
  },
  create: function (req, res) {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      db.Movie.create({
        title: req.body.title,
        rating: req.body.rating,
        length: req.body.length,
        awards: req.body.awards,
        release_date: req.body.release_date,
        genre_id: req.body.genre,
      })
        .then((movie) => {
          res.redirect("/movies");
        })
        .catch((error) => console.log(error));
    } else {
      db.Genre.findAll({
        order: ["name"],
      })
        .then((genres) => {
          res.render("moviesAdd", {
            genres,
            errors: errors.mapped(),
            old: req.body,
          });
        })
        .catch((err) => console.log(err));
    }
  },
  edit: function (req, res) {
    let Movie = Movies.findByPk(req.params.id, {
      include:[
        {
          association: "genre"
        }
      ]
    });
    let allGenres = Genres.findAll({
      order: ["name"],
    });
    Promise.allSettled([Movie, allGenres])
      .then(([Movie, allGenres]) => {
        //return res.send(allGenres)
        //return res.send(Movie)
        return res.render("moviesEdit", {
          Movie: Movie.value,
          allGenres: allGenres.value,
          moment,
        });
      })
      .catch((error) => console.log(error));
  },
  update: function (req, res) {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
      const { title, rating, awards, length, genre, release_date } =
        req.body;
      Movies.update(
        {
          title: title.trim(),
          rating,
          awards,
          length,
          genre_id: genre,
          release_date,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() => res.redirect("/movies/detail/" + req.params.id))
        .catch((error) => console.log(error));
    } else {
      let Movie = Movies.findByPk(req.params.id);
      let allGenres = Genres.findAll({
        order: ["name"],
      });
      Promise.allSettled([Movie, allGenres])
        .then(([Movie, allGenres]) => {
          //return res.send(allGenres)
          return res.render("moviesEdit", {
            Movie: Movie.value,
            allGenres: allGenres.value,
            moment,
            errors: errors.mapped(),
            old: req.body,
          });
        })
        .catch((error) => console.log(error));
    }
  },
  delete: function (req, res) {
    db.Movie.findByPk(req.params.id).then((Movie) => {
      res.render("moviesDelete.ejs", { Movie });
    });
  },
  destroy: function (req, res) {
    db.Movie.destroy({
      where: { id: req.params.id },
    });
    res.redirect("/movies");
  },
};

module.exports = moviesController;
