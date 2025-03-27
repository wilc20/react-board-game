const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
    
});

userSchema.pre('save', async function(next){
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword = function (candidatePassword) {
    console.log('candidatePassword', candidatePassword);
    console.log('this.password', this);

    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

/* export const User = mongoose.model('User', userSchema); */