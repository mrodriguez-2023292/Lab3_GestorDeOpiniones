import { Schema, model } from "mongoose";

const userSchema = Schema({
    name:{
        type: String,
        required: [true, "El nombre es requerido"],
        maxLength: [25, "No se puede exceder los 25 caracteres"]
    },

    surname:{
        type: String,
        required: [true, "El apoellido es requerido"],
        maxLength: [25, "No se puede exceder los 25 caracteres"]
    },

    username:{
        type: String,
        required: true,
        unique:true
    },

    email:{
        type: String,
        required: [true, "El email es requerido"],
        unique: true
    },

    phone:{
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },

    password:{
        type: String,
        required: [true, "La contraseña es requerida"]
    },

    profilePicture:{
        type: String
    },

    role:{
        type: String,
        required: true,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    
    status:{
        type: Boolean,
        default: true
    }
},

{
    versionKey: false,
    timestamps: true
})

userSchema.methods.toJSON = function(){
    const {password, _id, ...user} = this.toObject()
    user.uid = _id
    return user
}

export default model("User", userSchema)