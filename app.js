const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const Nexmo = require('nexmo');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var port = process.env.PORT || 3000;

app.use(express.static('./public'));

var people = [];



var password = "";
var passwordArray = ['c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7',
                     'c1c2c3c2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d4c5c6c7c8d1d1d2d3d4d5d6d7d8',
                     'c1c2c3c4c5c6c7c8d1c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8d2d3d4d5d6d7d8',
                     'c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8',
                     'c1c2c3c4c53c4c5c6c4d5d6d7d8c67c8d1d2d3dc7c8d1d2d3d4d5d6d7d8c1c2c',
                     'c1c2c3c7d818d1d2d3dc1c2c3c4c5c4c5c6c6c7c87c4d5d6ddd2d3d4d5d6d7d8'
                    ];


    for(var k=0;k<passwordArray.length;k++)
    {
        var a = passwordArray[k].split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
        passwordArray[k] = a.join("");
        password = password+passwordArray[k];
    }





io.on('connection',function(socket){
    console.log('New User Connected');
    
    socket.on('join',function(params,callback){
        socket.join(params.chatroom);
        socket.broadcast.emit('newUserConnected',{name: params.username});
        socket.emit('welcomeMessage',{password: password});
    });
    
    socket.on('createMessage',function(newMsg){
        io.emit('newMessage',{
            name: newMsg.name,
            message: newMsg.message
        });
    });
    
    socket.on('disconnect',function(){
        console.log('User Disconnected');
//        socket.broadcast.to(params.chatroom).emit('userDisconnected');
    });
});


const from = 'Arpit';

app.get('/message',function(req,res){
    console.log("1");
    const to = "919451672228";
    const text = 'EUREKA !!';
    console.log("3");
    nexmo.message.sendSms(from, to, text);
    console.log("4");
    res.send('MESSAGE SENT SUCCESSFULLY');
});

app.get('/admin',function(req,res){
    res.render('admin.ejs',{data:people});
});

app.get('/addUser',function(req,res){
    if (people.indexOf(req.query.username) == -1)
        people.push(req.query.username);
    res.redirect('admin');
});

app.get('/deleteUser', function(req, res){
    var user = req.query.usernamedel;
    people.pop(user);
    res.redirect('admin');
});

app.get('/logon',function(req,res){
    console.log("coming here, can check!!");
    if (people.indexOf(req.query.username) > -1) {
    res.redirect('chat.html?username='+req.query.username);
    } else {
    res.redirect('index.html');
    }
    
});


server.listen(port, function(err){
    console.log("Chat App is live!");
});