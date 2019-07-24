"user strict";
var express = require('express');
var authenticationRouter = express.Router();
var jwt    = require('jsonwebtoken');
var appSeckertKey = require('../config/appConfig').secret;
var models = require('../models/index');
var md5 = require('md5');

authenticationRouter.post('/login', function (req, res) {
    try {
         models.users.findOne({where:{email: req.body.email, password: md5(req.body.password) }}).then( user => {
            if (!user)
                return  res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });

            jwt.sign({'user_id': user.id,'first_name':user.first_name,'email': user.email,'avatar_path': user.avatar_path},
                 appSeckertKey, {expiresIn: 60 * 60* 60*24}, (err, token) =>{
                     if (err)
                         console.log(err);
                     return  res.status(200).json({ success: true,'userToken': token });
            });
        }).catch(error => res.status(400).json(error));
    }
    catch (err) {
        return  res.status(500).json({success: false, message: "There was an error attempting to login. Please try again later."});
    }
});

module.exports = authenticationRouter;