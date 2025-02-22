import User from "./user.model.js"
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath} from "url"
import { verify } from "argon2"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const getUserById = async (req, res) => {
    try{
        const { uid } = req.params;
        const user = await User.findById(uid)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try{
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { password, ...data } = req.body;

        const user = await User.findById(uid);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Credenciales inválidas",
                error: "El usuario no existe"
            })
        }

        const validPassword = await verify(user.password, password);

        if(!validPassword){
            return res.status(400).json({
                success: false,
                error: "Contraseña incorrecta",
                message: "La contraseña ingresada es no es la actual"
            })
        }

        if(data.profilePicture){
            return res.status(400).json({
                success: false,
                message: "No puedes actualizar la foto de perfil aquí"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true })

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            user: updatedUser
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: err.message
        })
    }
}


export const updateProfilePicture = async (req, res) => {
    try{
        const { uid } = req.params
        let newProfilePicture = req.file ? req.file.filename : null

        if(!newProfilePicture){
            return res.status(400).json({
                success: false,
                message: "No hay archivo en la petición"
            })
        }

        const user = await User.findById(uid)

        if(user.profilePicture){
            const oldProfilePicture = join(__dirname, "../../public/uploads/profile_pictures", user.profilePicture)
            await fs.unlink(oldProfilePicture)
        }

        user.profilePicture = newProfilePicture
        await user.save()

        return res.status(200).json({
            success: true,
            message:"Foto actualizada",
            profilePicture: user.profilePicture
        })

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la foto",
            error: err.message
        })
    }
}