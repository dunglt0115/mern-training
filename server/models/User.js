import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
