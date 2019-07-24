"user strict";
var express = require('express');
var chatRouter = express.Router();
var jwt    = require('jsonwebtoken');
var appSeckertKey = require('../config/appConfig').secret;
var model = require('../models/index');

chatRouter.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token)
        return res.status(403).json({success: false, message: 'No token provided.'});

    jwt.verify(token, appSeckertKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
        }
    });

});

chatRouter.post('/users', function(req, res){
    model.users.findAll({ where: {'id':{$ne: req.decoded.user_id}},
        include:[{
            model: model.messages,
            as: 'userMessages',
            order: [['id', 'DESC']],
            limit: 1}],
        order: [['id', 'DESC'],]
    }).then( users => {
        return res.status(200).json({success: true, message: users});
    }).catch( error => {
        return res.status(400).json({success: false, message: error });
    });
});


chatRouter.post('/messages', function(req, res){
    var message = {'message_subject':'private Message', 'message_body':req.body.message_body,
        'sender_id': req.decoded.user_id, 'receiver_id':req.body.receiver_id, 'conversation_id': req.body.conversation_id,
        'delivered': 0};
     model.messages.create(message)
        .then(userMessages => {
            model.users.findOne({where: { 'id': req.decoded.user_id }}).then( user => {
                message['user']= {avatarPath: user.avatarPath, first_name: user.first_name};
                message['created_at']= userMessages.created_at;
                console.log(message);
                return  res.status(200).json(message  );
            });
        }).catch(error => res.status(400).json(error));
});


chatRouter.post('/chat/:id', function(req, res){
    return model.messages.findAll({
            where:{
                $or:[
                    {'sender_id': req.params.id, 'receiver_id': req.decoded.user_id},
                    {'sender_id': req.decoded.user_id, 'receiver_id': req.params.id},
                ]
            }, include: [{
                    model: model.users,
                    as :'user'
            }]
        }).then(userMessages =>  res.status(200).json( userMessages))
          .catch(error => res.status(400).json(error));
});



// chatRouter.post('/mymessages', function(req, res){
//     // console.log(req.decoded);
//     model.users.findAll({where:{'id':{$ne: req.decoded.user_id}},include:[{
//         model: model.messages,
//         as: 'userMessages',
//         order: [
//             ['id', 'DESC'],
//         ],
//         limit: 1
//     }],order: [
//         ['id', 'DESC'],
//     ],}).then( users => {
//         model.messages.findAll({where:{ $or: [
//             {'sender_id': users[0].id, 'receiver_id': '2'},
//             {'sender_id': '2', 'receiver_id': users[0].id}
//         ]},
//             include:[{
//                 model:model.users,
//                 as: 'user'
//             }]}).then( userMessages => {
//             // res.render('chat', {'users': users,userMessages: userMessages});
//             return res.status(200).json({success: true, users: users, userMessages: userMessages});
//         });
//     });
//
// });

// chatRouter.post('/singleThread', function(req, res){
//     var msg = req.body;
//     return model.messages.findAll({
//         where:{
//             $or:[
//                 {'sender_id': msg.talkTo, 'receiver_id': req.decoded.user_id},
//                 {'sender_id': req.decoded.user_id, 'receiver_id': msg.talkTo},
//
//             ]
//         },
//         include: [
//             {
//                 model: model.users,
//                 as :'user'
//             }
//         ]}).then(userMessages =>  res.status(200).json(userMessages))
//         .catch(error => res.status(400).json(error));
// });
module.exports = chatRouter;