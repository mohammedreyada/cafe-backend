const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const newUser = await User.create({
            name,
            email,
            password,
            phone
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                new AppError('Please provide email and password!', 400)
            );
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(
                new AppError('Incorrect email or password', 401)
            );
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        if (req.body.password || req.body.role) {
            return next(
                new AppError(
                    'This route is not for updating password or role.',
                    400
                )
            );
        }

        const filteredBody = filterObj(
            req.body,
            'name',
            'phone',
            'avatar'
        );

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
            return next(
                new AppError('Your current password is wrong.', 401)
            );
        }

        user.password = req.body.newPassword;

        await user.save();

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        next(err);
    }
};