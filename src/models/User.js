const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: String,
    settings: {
        notifications: {
            isEnabled: Boolean,
            alerts:[{
                alertAhead: Number,
                period: String
            }]
        }
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePasswords = function(candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) return reject(err);

            if (!isMatch) return reject(false);
            
            resolve(true);
        });
    });
}

mongoose.model('User', userSchema);
