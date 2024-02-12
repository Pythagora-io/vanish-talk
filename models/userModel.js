const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatarURL: { type: String, default: '' },
    verificationToken: { type: String, unique: true, sparse: true } // Added verificationToken field
}, {
    timestamps: true,
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') && !this.isModified('verificationToken')) return next(); // Modified to check verificationToken too
    try {
        if (this.isModified('password')) {
            console.log('Password before hashing:', this.password); // gpt_pilot_debugging_log
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('Password hashed successfully:', this.password); // gpt_pilot_debugging_log
        }
        return next();
    } catch (error) {
        console.error(`Error in pre-save: ${error.message}`, error.stack);
        return next(error);
    }
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(`Error validating password: ${error.message}`, error.stack);
        throw new Error('Error validating password');
    }
};

userSchema.methods.setPassword = async function(newPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(newPassword, salt);
        console.log('New password hashed successfully.'); // gpt_pilot_debugging_log
    } catch (error) {
        console.error(`setPassword Error: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        throw new Error('Password hashing failed');
    }
};

userSchema.methods.generateVerificationToken = function() {
    try {
        this.verificationToken = crypto.randomBytes(32).toString('hex');
        console.log("Verification token generated successfully for user:", this.username); // gpt_pilot_debugging_log
    } catch (error) {
        console.error(`Error generating verification token: ${error.message}`, error.stack);
        throw new Error('Error generating verification token');
    }
};

// Simulate password hashing without actual hashing to debug potential mismatch scenarios
userSchema.statics.simulatePasswordHashing = function(inputPassword) {
    try {
        console.log('Simulating password hashing for debugging: ', inputPassword); // gpt_pilot_debugging_log
        const pseudoSalt = 'pseudoRandomSaltForSimulation';
        const simulatedHash = `simulatedHash:${inputPassword}:${pseudoSalt}`;
        console.log('Simulated password hash: ', simulatedHash); // gpt_pilot_debugging_log
        return simulatedHash;
    } catch (error) {
        console.error('Error simulating password hashing: ', error.message, error.stack); // gpt_pilot_debugging_log
        throw new Error('Error in simulated password hashing');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;