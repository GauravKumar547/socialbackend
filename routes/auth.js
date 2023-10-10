const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
// REGISTER
router.post("/register", async (req, res) => {
    try {
        // generating pass
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        // creating user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });
        // saving user
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("user not found");
        }
        // comparing pass
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).json("wrong password");
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
