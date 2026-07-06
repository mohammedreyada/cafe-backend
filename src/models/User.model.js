const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please tell us your name!'] },
    email: { type: String, required: [true, 'Please provide your email'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'Please provide a password'], minlength: 8, select: false },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    phone: String,
    avatar: String
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);