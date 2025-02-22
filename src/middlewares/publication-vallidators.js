import { body, param } from "express-validator";
import { publicationExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

export const addPublicationValidator = [
    body("title").notEmpty().withMessage("El titulo es requerido"),
    body("category").notEmpty().withMessage("La categoria es requerida"),
    body("content").notEmpty().withMessage("El contenido es requerido"),
    body("author").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
]

export const editPublicationValidator = [
    param("id").isMongoId().withMessage("No es un ID valido de MongoDB"),
    param("id").custom(publicationExists),
    validarCampos,
    handleErrors
]

export const deletePublicationValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id").custom(publicationExists),
    validarCampos,
    handleErrors
]