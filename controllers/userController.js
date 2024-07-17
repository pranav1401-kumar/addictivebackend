

const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    const { firstName, lastName, email, number } = req.body;

    try {
        // Generate random password
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            number,
            password: hashedPassword
        });

        const savedUser = await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Created',
            text: `Hi ${firstName}, your password is ${password}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json(savedUser);
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { firstName, password } = req.body;

    try {
        const user = await User.findOne({ firstName });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Details
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        console.log('User ID:', req.user._id);
        console.log('Request Body:', req.body);

        const userId = req.user._id;
        const { bio, description } = req.body;

        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (description !== undefined) updateData.description = description;

        console.log('Update Data:', updateData);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: error.message });
    }
};

// Upload User Video
const uploadUserVideo = async (req, res) => {
    const files = req.files;
    const titles = req.body.titles;
    const descriptions = req.body.descriptions;

    if (!files || !titles || !descriptions) {
        return res.status(400).json({ message: 'Missing files or video details' });
    }

    const videos = files.map((file, index) => ({
        url: file.path,
        title: titles[index],
        description: descriptions[index]
    }));

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.videos.push(...videos);

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ message: error.message });
    }
};

const getUsersWithVideos = async (req, res) => {
    try {
        const users = await User.find().select('firstName lastName videos');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllUsersWithVideos = async (req, res) => {
        try {
            const users = await User.find({ videoPath: { $exists: true, $ne: null } }).select('firstName lastName videoPath');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
         }
     };

module.exports = {
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    uploadUserVideo,
    getUsersWithVideos,
    getAllUsersWithVideos
};
