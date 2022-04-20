"use strict";

const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateOTP } = require('../middleware/otp');
const { sendMail } = require('../middleware/mail');
const schemaSignup = require('../schema/schemaSignup');
const schemaLogin = require('../schema/schemaLogin');
const passwordComplexity = require('joi-password-complexity');
const complexityOptions = {
    min: 8,
    max: 32,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    requirementCount: 5,
  };;

exports.signup = async (req,res) => {
    try {
        const isValid = await schemaSignup.validateAsync(req.body);
        if (!isValid) {
            return res.status(400).json({message: "Data error"});
        }
        const { error } = passwordComplexity(complexityOptions).validate(req.body.password);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const user = req.body;
        const otpGenerated = generateOTP();
        const userAgent = req.get('User-Agent');
        const ip = req.ip;
        const isExisting = await db.user.findOne({ where: { email: user.email }});
        if (isExisting) {
            return res.send('Already existing');
        }
        user.password = bcrypt.hashSync( user.password, 10);
        user.otp = otpGenerated;
        if(userAgent) {
            user.userAgent = userAgent;
        }
        if(ip) {
            user.ip = ip;
        }
        db.user.create(user)
        .then( (newUser) => {
            try {
                sendMail({
                  to: user.email,
                  OTP: otpGenerated,
                });
                return [true, newUser];
              } catch (e) {
                return [false, 'Unable sign up you now, try again later', e];
              }
            } ).then(() => {
                res.status(201).json({message: "User created"});
            })
        .catch( (e) => {
            res.status(500).json(e);
        })
    } catch (e) {
        res.status(500).json(e);
    }
}

exports.login = async (req,res) => {
    try {
        const dataUpdated = {};
        const userAgent = req.get('User-Agent');
        const ip = req.ip;
        const isValid = await schemaLogin.validateAsync(req.body);

        if (!isValid) {
            return res.status(400).json({ message: "Data error" });
        }
        const { error } = passwordComplexity(complexityOptions).validate(req.body.password);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const otpGenerated = generateOTP();
        const user = req.body;
        const userDb = await db.user.findOne({ where: { email: user.email }});

        if (!userDb) {
            return res.status(404).json({ message: 'Not existing' });
        }
        if (userDb.otp !== user.otp) {
            return res.status(404).json({ message: 'Invalid OTP' });
        }
        const passwordValid = bcrypt.compareSync(user.password, userDb.password);
        if (!passwordValid) {
            return res.status(404).json({ message: 'Email or password invalid' });
        }
        if (userDb.userAgent !== userAgent) {
            dataUpdated.userAgent = userAgent;
            dataUpdated.otp = otpGenerated;
        }
        if (userDb.ip !== ip) {
            dataUpdated.otp = otpGenerated;
            dataUpdated.ip = ip;
        }
        if (userDb.userAgent == userAgent) {
            dataUpdated.active = true;
        }
        userDb.update(dataUpdated)
        .then (()=> {
            if (dataUpdated.otp !== undefined) {
                try {
                    sendMail({
                        to: user.email,
                        OTP: otpGenerated,
                    });
                    return [true, userDb];
                } catch (e) {
                    return [false, 'Unable sign up you now, try again later', e];
                }
            }
            res.status(200).send({
                token: jwt.sign({ userId: userDb.id }, process.env.JWT_SECRET, {
                    expiresIn: "24h",
                }),
            })
        })
        .catch( (e) => {
            res.status(500).json(e);
        })
    } catch (e) {
        res.status(500).json(e);
    }
}