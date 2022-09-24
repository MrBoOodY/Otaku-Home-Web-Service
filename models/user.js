import mongoose from 'mongoose';
import CryptoJs from 'crypto-js';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    secretKey: {
        type: String,

    },
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
    accessToken: {
        type: String,
        unique: true,
    },
    coverImage: {
        type: String
    },
    bio: {
        type: String
    },
    myAnimeList: [{
        "anime": { type: Schema.Types.ObjectId, ref: 'Anime', },
        "myListType": { type: Schema.Types.ObjectId, ref: 'MyListTypes', },
    }],
    myMangaList: [{
        "manga": { type: Schema.Types.ObjectId, ref: 'Manga', },
        "myListType": { type: Schema.Types.ObjectId, ref: 'MyListTypes', },
    }],
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

userSchema.method('toClient', function () {
    const object = this.toObject();

    //Rename _id to be id
    object.id = object._id;
    //Deleting _id
    delete object._id;
    //Deleting __v
    delete object.__v;
    //Deleting password
    delete object.password;
    return object;
});

const User = mongoose.model('User', userSchema);
export default User;