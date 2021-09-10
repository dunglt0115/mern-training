/* eslint-disable import/extensions */
import express from 'express';
import PostModel from '../models/Post.js';
import { verifyJwtToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET api/posts
 * @desc Get post
 * @access Private
 */
router.get('/', verifyJwtToken, async (req, res) => {
    try {
        const posts = await PostModel.find({ user: req.userId }).populate('user', ['username']);

        return res.json({
            success: true,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

/**
 * @route POST api/posts
 * @desc Create post
 * @access Private
 */
router.post('/', verifyJwtToken, async (req, res) => {
    const {
        title, description, url, status
    } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Invalid title'
        });
    }

    try {
        const newPost = new PostModel({
            title,
            description,
            url: (url.startsWith('https://')) ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        });

        await newPost.save();

        return res.json({
            success: true,
            message: 'Create new post successfully!',
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

/**
 * @route PUT api/posts/:id
 * @desc Update post
 * @access Private
 */
router.put('/:id', verifyJwtToken, async (req, res) => {
    const {
        title, description, url, status
    } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Invalid title'
        });
    }

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: ((url.startsWith('https://')) ? url : `https://${url}`) || '',
            status: status || 'TO LEARN'
        };

        const postUpdateCondition = { _id: req.params.id, user: req.userId };

        updatedPost = await PostModel.findOneAndUpdate(postUpdateCondition, updatedPost, {
            new: true // return new post info after update
        });

        if (!updatedPost) {
            return res.status(401).json({
                success: false,
                message: 'Post not found or user are not authorized to update post'
            });
        }

        return res.json({
            success: true,
            message: 'Successfully updated post!',
            post: updatedPost
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

/**
 * @route DELETE api/posts/:id
 * @desc Delete post
 * @access Private
 */
router.delete('/:id', verifyJwtToken, async (req, res) => {
    try {
        const postUpdateCondition = { _id: req.params.id, user: req.userId };
        const deletedPost = await PostModel.findOneAndDelete(postUpdateCondition);

        if (!deletedPost) {
            return res.status(401).json({
                success: false,
                message: 'Post not found or user are not authorized to update post'
            });
        }

        return res.json({
            success: true,
            post: deletedPost
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
});

export default router;
