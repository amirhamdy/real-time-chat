"use strict"
var authenticationRouter =require("./authenticationRoutes");
var chatRouter = require('./chatRoutes');
// import cors                         from "cors";

module.exports=  function ConfigApiRoutes(app) {
    // app.use(cors());
    app.use('/api',authenticationRouter);
    app.use('/api',chatRouter);

    app.get('/', (req, res) => {
        res.render('login');
    });

    app.get('/chat', (req, res) => {
        res.render('chat');
    });
};