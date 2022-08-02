import mongoose from 'mongoose'


// Now create a Schema

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
            type: String,
            required: true
    },
    created: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    workLocation: {
        type: String,
        required:true
    },
    phoneNumber: {
        type: Number,
        required: true
    }
})



// Now create a model

const User = mongoose.model("users", UserSchema);

export default User