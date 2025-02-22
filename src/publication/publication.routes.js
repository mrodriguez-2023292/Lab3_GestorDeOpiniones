import { Router } from "express";
import { addPublication, getPublications, editPublication, deletePublication } from "./publication.controller.js";
import { addPublicationValidator, editPublicationValidator, deletePublicationValidator } from "../middlewares/publication-vallidators.js";

const router = Router();

router.post("/addPublication", addPublicationValidator, addPublication);

router.get("/", getPublications);

router.put("/editPublication/:id", editPublicationValidator, editPublication)

router.delete("/deletePublication/:id", deletePublicationValidator, deletePublication);

export default router;