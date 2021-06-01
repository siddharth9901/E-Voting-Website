const { request } = require('express');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

require('../db/conn');
const User = require("../models/userSchema");


const Admin = require("../models/adminSchema");

router.get('/', (req, res) => {
    res.send('Hello from the other side');
});


//When user regiaters:--->
router.post('/register', async (req, res) => {

    const { name, voterID, password, cpassword} = req.body; //object destructuring

    if (!name || !voterID || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        const userExist = await User.findOne({ voterID: voterID });

        if (userExist) {
            return res.status(422).json({ error: "voterID already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords don't match" });
        } else {
            const user = new User({ name, voterID, password, cpassword});
            await user.save();
            res.status(201).json({ message: "user registered successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

//ADMIN REGISTER:--->
router.post('/adminRegister', async (req, res) => {

    const { userName, name, password, cpassword} = req.body; //object destructuring

    if (!userName || !password || !name || !cpassword) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    try {
        const userExist = await Admin.findOne({ userName: userName});

        if (userExist) {
            return res.status(422).json({ error: "userName already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords don't match" });
        } else {
            const user = new Admin({ name, userName, password, cpassword});
            await user.save();
            res.status(201).json({ message: "Admin registered successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

//LOGIN ADMIN--->
router.post('/signinAdmin', async (req, res) => {
    try {
        const { userName, password} = req.body;
        if (!userName || !password) {
            //console.log(req.body);
            return res.status(400).json({ error: "Please fill the data" })
        }
        const adminLogin = await Admin.findOne({ userName: userName });

        if (adminLogin) {
            const isMatch = await bcrypt.compare(password, adminLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else {
                    res.json({ error: "Login Successfully" });
                }
        } else {
            res.status(400).json({ error: "Invalid UserName" });
        }
    } catch (err) {
        console.log(err);
    }
});

//LOGIN User:--->
router.post('/signin', async (req, res) => {
    try {
        let token;
        const { voterID, password} = req.body;
        if (!voterID || !password) {
            //console.log(req.body);
            return res.status(400).json({ error: "Please fill the data" })
        }

        const userLogin = await User.findOne({ voterID: voterID });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else {
                    res.json({ error: "Login Successfully" });
                }
        } else {
            res.status(400).json({ error: "Invalid UserName" });
        }
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;