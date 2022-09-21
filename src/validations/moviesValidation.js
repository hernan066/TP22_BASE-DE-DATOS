const { check } = require("express-validator");

module.exports = [
  check("title")
    .notEmpty()
    .withMessage("Requerido"),

  check("rating")
    .notEmpty()
    .withMessage("Requerido")
    .bail()
    .isNumeric()
    .withMessage("El valor debe ser numérico"),

  check("release_date")
    .notEmpty()
    .withMessage("Requerido"),

  check("length")
    .notEmpty()
    .withMessage("Requerido")
    .bail()
    .isNumeric()
    .withMessage("El valor debe ser numérico"),

  check("awards")
    .notEmpty()
    .withMessage("Requerido")
    .bail()
    .isNumeric()
    .withMessage("El valor debe ser numérico"),

  check("genre")
    .notEmpty()
    .withMessage("Requerido"),
];
