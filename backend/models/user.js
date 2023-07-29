import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String
        },
        email: {
            type: String,
            required: [true, "Please provide an Email"],
            unique: true
        },
        username: {
            type: String,
            required: [true, "Please provide a Username"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"]
        }
    },{
        timestamps: true
    }
)

export default mongoose.model('User', userSchema);