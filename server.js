require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const middleware = require("./api/middleware/middleware");
const v1 = require("./api/routes/v1");
const config = require("./api/common/config");
const commonHelper = require('./api/common/commonHelper')
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply middleware for API authentication
app.use(middleware.verifyToken);
app.use("/api/v1/", v1);

// WebSocket Authentication Middleware
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
        const data = jwt.verify(token, process.env.PROD_JWT_SECRET);
      

        req.decoded = data; 
        let userData = await commonHelper.validateToken(req,res);
        console.log("TokenValidate",userData)
        if(userData.executed == 1){
            next();
        }else{
          next(new Error("Session Expired "));        } 
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

// WebSocket Connection
io.on("connection", (socket) => {
    console.log(` User connected: ${req.decoded.email}`);

    // Join a room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        socket.to(room).emit("message", `${req.decoded.email} joined ${room}`);
    });

    // Send message to a room
    socket.on("sendMessage", ({ room, message }) => {
        io.to(room).emit("message", `${req.decoded.email}: ${message}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(` User disconnected: ${req.decoded.email}`);
    });
});

// Start Server
server.listen(config.PORT, () => {
    console.log(` Server running in ${config.DB_ENV} mode on port ${config.PORT}`);
});
