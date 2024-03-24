const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.googleSignUp = async (req, res) => {
    let { uid, email, name, photoURL, username, socialLinks } = req.body;
    try {
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
            const token = jwt.sign(
                { ...oldUser._doc },
                process.env.HMS_SECRET_APP,
                {
                    expiresIn: '48h',
                }
            );
            res.status(200).json({
                success: 'true',
                result: { ...oldUser._doc, token },
                message: 'User alreadytoken exists',
            });
        } else {
            const user = await UserModel.create({
                uid,
                email,
                name,
                photoURL,
                username,
                socialLinks,
            });
            const token = jwt.sign(
                { ...user._doc },
                process.env.HMS_SECRET_APP,
                {
                    expiresIn: '48h',
                }
            );
            res.status(201).json({
                success: true,
                result: { ...user._doc, token },
                message: 'User created',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.editProfile = async (req, res) => {
    try {
        const { uid } = req.user;
        const {
            bio,
            photoURL,
            socialLinks,
            updatedUsername,
            isPrivacyAccepted,
        } = req.body;
        const user = await UserModel.findOne({ uid });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { uid },
            {
                bio,
                photoURL,
                socialLinks,
                username: updatedUsername,
                isPrivacyAccepted,
            },
            { new: true }
        );
        const token = jwt.sign(
            { ...updatedUser._doc },
            process.env.HMS_SECRET_APP,
            {
                expiresIn: '48h',
            }
        );
        res.status(200).json({
            success: true,
            result: { ...updatedUser._doc, token },
            message: 'User updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.search = async (req, res) => {
    try {
        const userId = req.params.userId;
        const keyword = req.query.search
            ? {
                  $or: [
                      { name: { $regex: req.query.search, $options: 'i' } },
                      { username: { $regex: req.query.search, $options: 'i' } },
                  ],
              }
            : {};
        const users = await UserModel.find(keyword).find({
            uid: { $ne: userId },
        });
        res.status(200).json({
            success: true,
            result: users,
            message: 'User found',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.updateTestScore = async (req, res) => {
    try {
        const { testScore, uid } = req.body;
        const user = await UserModel.findOne({ uid });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { uid },
            { testResults: testScore },
            { new: true }
        );
        res.status(200).json({
            success: true,
            result: { ...updatedUser._doc },
            message: 'Test score updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};

exports.reportUser = async (req, res) => {
    try {
        const { reportedByUser, reportedTo } = req.body;
        // console.log(reportedByUser, reportedTo);
        const user = await UserModel.findOne({ uid: reportedTo });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { uid: reportedTo },
            { $push: { reportedBy: reportedByUser } },
            { new: true }
        );
        res.status(200).json({
            success: true,
            result: { ...updatedUser._doc },
            message: 'User reported',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
        console.log(error);
    }
};
