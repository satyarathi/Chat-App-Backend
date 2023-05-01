const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');
const { notFound,errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require("./routes/chatRoute");
const messageRoutes = require('./routes/messageRoute');
const { Socket } = require("socket.io");
const path = require('path');
const cors = require('cors') ;

dotenv.config();
connectDB();

const app = express()

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Api is running successfully.");
})

//route for user api
app.use('/api/user',userRoutes);

//route for chat api
app.use('/api/chat',chatRoutes);

//route for message api
app.use('/api/message',messageRoutes);


app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(5000,console.log(`Server Started on port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

//creating connection
io.on("connection", (socket) => {
    console.log("connected to socket.io");

    //new socket where frontend will send data and join room
    socket.on('setup', (userData) => {

        //create the new room with user id
        socket.join(userData._id);
       
        // console.log(userData._id);
        socket.emit('connected');
    });

    //join chat---it will take room is from frontend
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined room: " +room);
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received",newMessageReceived);
        });
    });


    socket.off('setup', () => {
        console.log('User Disconnected');
        socket.leave(userData._id);
    });

});

