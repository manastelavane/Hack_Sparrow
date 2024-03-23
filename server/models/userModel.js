const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
    twitter: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
});

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: [true, 'Please Enter Your Email'],
            unique: true,
        },
        bio: {
            type: String,
        },
        photoURL: {
            type: String,
        },
        username: {
            type: String,
            required: [true, 'Please Enter Your Username'],
            unique: true,
        },
        isPrivacyAccepted: {
            type: Boolean,
            default: false,
        },
        reportedBy: [
            {
                type: String,
            },
        ],
        socialLinks: socialLinksSchema,
        testResults: {
            ocd: {
                type: Number,
                default: 0,
            },
            adhd: {
                type: Number,
                default: 0,
            },
            ptsd: {
                type: Number,
                default: 0,
            },
            anxiety: {
                type: Number,
                default: 0,
            },
            depression: {
                type: Number,
                default: 0,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
