const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    voterID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    //Skills to be string or array of strings??????
})



//PASSWORD HASHING:

UserSchema.pre('save', async function (next)  {
    //console.log("Hi from inside");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//Genrating token:
// UserSchema.methods.genrateAuthToken = async function() {
//     try{
//         let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);//_id is from the MongoDB document corresponding to the logedIn Emial
//         this.tokens = this.tokens.concat({token: token});
//         await this.save();
//         return token;
//     }catch (err) {
//         console.log(err);
//     }
// }


//Creating collection
const User = mongoose.model('USER',UserSchema); 

module.exports = User;