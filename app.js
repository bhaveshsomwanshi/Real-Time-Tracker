const express = require('express');
const app = express();
const http = require("http");
const path = require("path");
app.use('/public', express.static('public'));

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    //it comes from forn and access in backend and now it can send the frontend to all the users
    socket.on("send-location", function(data){
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    })
});

//basic rout
app.get("/", function(req, res) {
    res.render("index");
});
//server to listen
server.listen(3000);