import { Router } from "express"
import { updateUser, updateProfilePicture } from "./user.controller.js"
import { updateUserValidator, updateProfilePictureValidator } from "../middlewares/user-validators.js"
import { uploadProfilePicture } from "../middlewares/multer-uploads.js"

const router = Router()

router.patch("/updateUser/:uid", updateUserValidator, updateUser)

router.patch("/updateImage/:uid", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator,  updateProfilePicture)

export default router