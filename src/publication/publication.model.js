import { Schema, model } from "mongoose";

const publicationSchema = new Schema({
    title: {
        type: String,
        required: [true, "El título es requerido"],
        maxLength: [50, "No se puede exceder los 50 caracteres"]
    },

    category: {
        type: String,
        required: [true, "La categoría es requerida"],
        maxLength: [50, "No se puede exceder los 50 caracteres"]
    },

    content: {
        type: String,
        required: [true, "El contenido de la publicación es requerido"]
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: [true, "El comentario no puede estar vacío"],
            minLength: [1, "El comentario debe tener al menos 1 carácter"],
            maxLength: [300, "El comentario no puede exceder los 300 caracteres"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    status: {
        type: Boolean,
        default: true
    }

}, 

{
    timestamps: true,
    versionKey: false
});

export default model("Publication", publicationSchema);
