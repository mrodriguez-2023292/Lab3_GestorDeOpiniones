import jwt from "jsonwebtoken"
import User from "../user/user.model.js"

export const validateJWT = async (req, res, next) =>{
    try{
        let token = req.body.token || req.query.token || req.headers["authorization"]

        if(!token){
            return res.status(401).json({
                success: false,
                message: "No se proporcionó un token en la petición"
            })
        }

        token = token.replace(/^Bearer\s+/, "");

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        
        const user = await User.findById(uid)

        if (!user || !user.status) {
            return res.status(400).json({
                success: false,
                message: !user ? "Usuario no existe en la DB" : "Usuario fue desactivado previamente"
            });
        }

        req.user = user
        next()
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al validar el token",
            error: err.message
        })
    }
}