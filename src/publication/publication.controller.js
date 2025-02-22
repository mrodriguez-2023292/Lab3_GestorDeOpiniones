"use strict"

import User from "../user/user.model.js"
import Publication from "./publication.model.js"
import mongoose from "mongoose"

export const addPublication = async (req, res) => {
    try {
        const data = req.body
        const user = await User.findById(data.author)

        if(!user){
            return res.status(404).json({ 
                success: false, 
                message: "Usuario no encontrado"
            })
        }

        const publication = new Publication({
            ...data,
            author: user._id,
        })

        await publication.save()

        res.status(200).json({
            success: true,
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar la publicación",
            error
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const { id } = req.params
        const { text } = req.body
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "ID de publicación inválido" 
            })
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({ 
                success: false, 
                message: "Publicación no encontrada" 
            })
        }

        const newComment = { 
            user: userId, 
            text 
        }

        publication.comments.push(newComment);
        await publication.save();

        return res.status(201).json({ 
            success: true, 
            message: "Comentario agregado exitosamente", 
            comment: newComment, 
            publication 
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error al agregar comentario", 
            error: error.message 
        })
    }
}


export const getPublications = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query
    const query = { status: true }

    try {
        const publications = await Publication.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

        const publicationsWithAuthor = await Promise.all(publications.map(async (publication) => {
            const authorUser = await User.findById(publication.author);
            return {
                ...publication.toObject(),
                author: authorUser ? authorUser.username : "Autor no encontrado",
            }
        }))

        const total = await Publication.countDocuments(query)

        res.status(200).json({
            success: true,
            total,
            publications: publicationsWithAuthor,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error
        })
    }
}

export const editPublication = async (req, res) => {
    try {
        const { id } = req.params
        const { author, ...data } = req.body

        const user = await User.findById(author);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "El autor no es válido o no existe",
            })
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, data, { new: true })

        return res.status(200).json({
            success: true,
            message: "Publicación actualizada correctamente",
            publication: updatedPublication
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la publicación",
            error: error.message
        })
    }
}

export const editComment = async (req, res) => { 
    try {
        const { id, commentId } = req.params;
        const { text } = req.body;
        const userId = req.user._id.toString();

        const publication = await Publication.findOne({ 
            _id: id, 
            "comments._id": commentId, 
            "comments.user": userId 
        });

        if (!publication) {
            return res.status(404).json({ 
                success: false, 
                message: "No tienes permiso para editar este comentario o no existe" 
            });
        }

        await Publication.updateOne(
            { _id: id, "comments._id": commentId },
            { $set: { "comments.$.text": text } }
        );

        return res.status(200).json({ 
            success: true,
            message: "Comentario actualizado exitosamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al editar el comentario",
            error: error.message
        });
    }
};

export const deletePublication = async (req, res) => { 
    try {
        const { id } = req.params
        const userId = req.user._id.toString()
        const publication = await Publication.findOne({ _id: id, author: userId })

        if (!publication) {
            return res.status(404).json({ 
                success: false, 
                message: "No tienes permiso para eliminarla" 
            });
        }

        await Publication.findByIdAndUpdate(id, { status: false })

        return res.status(200).json({ 
            success: true,
            message: "La publicación fue eliminada exitosamente"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la publicación",
            error: error.message
        })
    }
}

export const deleteComment = async (req, res) => { 
    try {
        const { id, commentId } = req.params;
        const userId = req.user._id.toString();

        const publication = await Publication.findOne({ 
            _id: id, 
            "comments._id": commentId, 
            "comments.user": userId 
        })

        if (!publication) {
            return res.status(404).json({ 
                success: false, 
                message: "No tienes permiso para eliminar este comentario o no existe" 
            })
        }

        await Publication.findByIdAndUpdate(id, { 
            $pull: { comments: { _id: commentId } } 
        })

        return res.status(200).json({ 
            success: true,
            message: "Comentario eliminado exitosamente"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario",
            error: error.message
        })
    }
}