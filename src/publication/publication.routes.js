import { Router } from "express";
import { addPublication, addComment, getPublications, editPublication, editComment, deletePublication, deleteComment } from "./publication.controller.js";
import { addPublicationValidator, addCommentValidator, editPublicationValidator, editCommentValidator, deletePublicationValidator, deleteCommentValidator } from "../middlewares/publication-vallidators.js";

const router = Router();

router.post("/addPublication", addPublicationValidator, addPublication);

router.put("/addComment/:id", addCommentValidator, addComment);

router.get("/", getPublications);

router.put("/editPublication/:id", editPublicationValidator, editPublication)

router.patch("/editPublication/:id/editComment/:commentId", editCommentValidator, editComment )

router.delete("/deletePublication/:id", deletePublicationValidator, deletePublication);

router.delete("/deletePublication/:id/deleteComment/:commentId", deleteCommentValidator, deleteComment )

export default router;