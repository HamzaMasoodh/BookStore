//Bookstore 
const User = require('../../models/user/user')
const express = require('express')
const app = express()
const logger = require('../../utils/logger')
app.post('/signup', async (req, res) => {
    try {

        const requiredFields = ["email", "password", "confirmPassword"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                logger.error(`Missing required field: ${field}`)
                return res.status(400).json({ status: false, message: `Missing required field: ${field}` });
            }
        }
        const { email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            logger.error('Password Does not match')
            return res.status(400).json({ status: false, error: "Password does not match" });
        }

        const exsistingUser = await User.findOne({ email: email })
        if (exsistingUser) {
            return res.status(400).send({ status: false, message: "Email Already Signed Up" })
        }
        const user = new User({
            email: email,
            password: password,
            lastLogin: new Date(),
        })

        const newUser = await user.save();

        return res.status(200).send({ status: true, message: "User Signed Up Successfully", data: newUser })

    } catch (error) {
        logger.error(`Error occurred while registering the user ${error.message}`)
        return res.status(400).send({ status: false, message: `Error occurred while registering the user ${error.message}` })

    }
})


app.post("/login", async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            logger.error('Please Provide Correct email and password ')
            return res.json({status: false,error: "Please Provide Correct email and password ",});
        }

        const user = await User.findByCredentials(req.body.email,req.body.password);
        if (!user) {
            logger.error(new Date().toLocaleString() + 'Incorrect Email or Password');
            return res.json({ status: false, error: "Email or Password is not correct " });
        }
        let access = await user.generateAuthToken();

        user.lastLogin = new Date();
        logger.info(`Login Successful for user: ${req.body.email}`);
        await user.save();
        return res.status(200).json({status: true,message: "Successfully Login",data: user,access});
    } catch (error) {
        logger.error(`Login Failed ${error.message}`)
        return res.status(400).send({ status: false, message: `Login Failed: ${error.message}` })

    }
});



module.exports = app