import mongoose from 'mongoose';
import CryptoJs from 'crypto-js';
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true, lowercase: true,
        unique: [true, 'Email address already exist'],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: {
        type: String,

    },
    profilePicture: {
        type: String
    },

    coverImage: {
        type: String
    },
    bio: {
        type: String
    },
    location: {
        type: String
    },
    showMyList: { type: Boolean, },
    isAdmin: { type: Boolean, },

    birthDate: { type: Date }
}, { timestamps: true, collection: 'User', });
userSchema.virtual('passwordHash')
    .get(function () {

        const decryptedPassword = CryptoJs.AES.decrypt(this.password, process.env.pass_sec).toString(CryptoJs.enc.Utf8);

        return decryptedPassword;

    })
    .set(function (value) {
        this.password = CryptoJs.AES.encrypt(value, process.env.pass_sec).toString();
    });
userSchema.path('password').validate(function () {
    if (this.password) {
        if (this.password.length < 8) {
            this.invalidate('password', 'must be at least 8 characters.');
        }

    }

}, null);
const User = mongoose.model('User', userSchema);

export default User;