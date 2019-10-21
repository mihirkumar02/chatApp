var socket = io();

var password = "";
//var passwordArray = ['c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7',
//                     'c1c2c3c2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d4c5c6c7c8d1d1d2d3d4d5d6d7d8',
//                     'c1c2c3c4c5c6c7c8d1c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8d2d3d4d5d6d7d8',
//                     'c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8c1c2c3c4c5c6c7c8d1d2d3d4d5d6d7d8',
//                     'c1c2c3c4c53c4c5c6c4d5d6d7d8c67c8d1d2d3dc7c8d1d2d3d4d5d6d7d8c1c2c',
//                     'c1c2c3c7d818d1d2d3dc1c2c3c4c5c4c5c6c6c7c87c4d5d6ddd2d3d4d5d6d7d8'
//                    ];
//
//
//    for(var k=0;k<6;k++)
//    {
//        var a = passwordArray[k].split(""),
//        n = a.length;
//
//    for(var i = n - 1; i > 0; i--) {
//        var j = Math.floor(Math.random() * (i + 1));
//        var tmp = a[i];
//        a[i] = a[j];
//        a[j] = tmp;
//    }
//        passwordArray[k] = a.join("");
//        password = password+passwordArray[k];
//    }
//   console.log(password);
//
//password = "kam";

var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("username");
document.querySelector("#name").value = c;
console.log(c);
            
socket.on('connect',function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params,function(err){
        if(err)
            console.log(err);
        else{}
    });
    console.log('Connected to the server'); 
});
            
socket.on('disconnect',function(){
    $("#chatList").append('<li class="admin">YOU HAVE BEEN REMOVED FROM THE CHAT</li>');
    console.log('Server down');
});

socket.on('userDisconnected',function(){
    $("#chatList").append('<li class="admin">USER LEFT THE CHAT</li>');
});

function sendMessage(){
    var h1 = document.querySelector("#msg").value;
    var message = CryptoJS.AES.encrypt(h1, password).toString();
    socket.emit('createMessage',{
        name: document.querySelector("#name").value,
        message: message,
        createdAt: 123
    });
    document.querySelector("#msg").value = "";
    return false;
}

socket.on('newUserConnected',function(data){
    console.log(data);
    $("#chatList").append('<li class="admin">'+data.name+' JOINED THE CHAT</li>');
    console.log("New User Connected");
});

socket.on('welcomeMessage',function(data){
    $("#chatList").append('<li class="admin">WELCOME TO THE CHAT</li>');
    password = data.password;
    console.log(password);
    console.log("Welcome User");
});

socket.on('newMessage',function(message){
    var msg = message.message;
    msg = CryptoJS.AES.decrypt(msg, password).toString(CryptoJS.enc.Utf8);
    var t1 = 'me';
    var t2 = 'me-text';
    var t3 = 'left';
    console.log(message.name);
    console.log(document.querySelector("#name"));
    if(message.name!=document.querySelector("#name").value){
        t1 = 'others';
        t2 = 'others-text';
        t3 = 'right';
        console.log('HELLO');
    }
    var string = '<li class='+t1+'><div class='+t2+'><small style="color: rgba(10,10,10,0.4); float:'+t3+ ';">'+message.name+'</small><br>'+msg+'</div></li>';
    
    $("#chatList").append(string);
    
    
    
    
   $('#chatList').animate({scrollTop: $('#chatList').prop("scrollHeight")}, 500);
    
    
    console.log("You have a message from : ",message.name);
});
console.log(socket);