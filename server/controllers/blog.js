const BlogModel = require('../models/blogModel');
const UserModel = require('../models/userModel');
const axios = require('axios');

exports.createBlog = async (req, res) => {
    const { title, summary, content, cover, tags } = req.body;
    const {
        uid: authorId,
        name: authorName,
        username: authorUsername,
    } = req.user;

    try {
        // Send the blog content to the sentiment analysis server
        const completeText = title + ' ' + summary + ' ' + content;
        // console.log(completeText);
        const sentimentResponse = await axios.post(
            'http://127.0.0.1:5000/analyze-sentiment',
            {
                blog: String(completeText), // You may want to analyze the 'content' of the blog
            }
        );
        // console.log(sentimentResponse.data);

        // Extract sentiment score from the response
        const sentimentScore = sentimentResponse.data.sentiment;

        // Check if sentiment is positive (you can adjust this logic based on your requirements)
        if (sentimentScore >= 0) {
            // Create the blog if sentiment is positive
            const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
            const result = await BlogModel.create({
                title,
                summary,
                content,
                cover,
                authorId,
                authorName,
                authorUsername,
                tags: lowerCaseTags,
            });

            res.status(201).json({
                success: true,
                result,
                message: 'Blog created',
            });
        } else {
            // If sentiment is negative, do not create the blog
            res.status(400).json({
                success: false,
                message:
                    'Blog content has negative sentiment. Cannot create the blog.',
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

exports.getBlogs = async (req, res) => {
    try {
        const PAGE_SIZE = 6;
        const filter = req.query.filter;
        let skip = req.query.page ? parseInt(req.query.page) : 0;
        console.log(filter);
        console.log(skip);
        if (filter == 1) {
            const result = await BlogModel.find()
                .sort({ createdAt: -1 })
                .skip(skip * PAGE_SIZE)
                .limit(PAGE_SIZE);
            res.status(200).json({
                success: true,
                result,
                message: '6 latest blogs fetched',
            });
        } else {
            const uid = req.query.uid;
            const user = await UserModel.findOne({ uid: uid });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }
            const testResults = user.testResults;
            const maxTest = Object.keys(testResults).reduce((a, b) =>
                testResults[a] > testResults[b] ? a : b
            );
            console.log(maxTest);
            const result = await BlogModel.find({ tags: maxTest })
                .sort({ createdAt: -1 })
                .skip(skip * PAGE_SIZE)
                .limit(PAGE_SIZE);
            res.status(200).json({
                success: true,
                result,
                message: '6 latest blogs fetched',
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

exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await BlogModel.findById(id);
        res.status(200).json({
            success: true,
            result,
            message: 'Fetched a Blog by id',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'No blog found',
            error: error.message,
        });
        console.log(error);
    }
};

exports.editBlogById = async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, cover } = req.body;
    const { uid: authorId } = req.user;
    const update = {
        title,
        summary,
        content,
        cover,
    };
    try {
        const blog = await BlogModel.findById(id);
        if (blog.authorId !== authorId) {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to update this blog',
            });
        }

        // Send the updated blog content to the sentiment analysis server
        const completeText = title + ' ' + summary + ' ' + content;
        const sentimentResponse = await axios.post(
            'http://127.0.0.1:5000/analyze-sentiment',
            {
                blog: String(completeText),
            }
        );
        const sentimentScore = sentimentResponse.data.sentiment;

        // Check if sentiment is positive
        if (sentimentScore >= 0) {
            // Update the blog if sentiment is positive
            await blog.updateOne(update);
            res.status(200).json({
                success: true,
                blog,
                message: 'Blog updated',
            });
        } else {
            // If sentiment is negative, do not update the blog
            res.status(400).json({
                success: false,
                message:
                    'Blog content has negative sentiment. Cannot update the blog.',
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

exports.deleteBlogById = async (req, res) => {
    const { id } = req.params;
    const { uid: authorId } = req.user;
    try {
        const blog = await BlogModel.findById(id);
        if (blog.authorId !== authorId) {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to delete this blog',
            });
        }
        await BlogModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Blog deleted',
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
