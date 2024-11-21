import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            minlength:2,
            maxlength:50
        },
        lastName:{
            type:String,
            required:true,
            minlength:2,
            maxlength:50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail ,"Invalid email format"]
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        picturePath:{
            type:String,
            default: ""
        },
        friends:{
            type: Array,
            default: []
        },
        location:{
            type: String,
            default: ""
        },
        occupation:{
            type: String,
            default: ""
        }
    },{timestamps: true}
);
const User = mongoose.model('User',UserSchema);

export default User;