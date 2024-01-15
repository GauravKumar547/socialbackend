const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const conversationsRoute = require("./routes/conversations");
const messagesRoute = require("./routes/messages");
const io = require("socket.io")(8080, {
    cors: {
        origin: "http://localhost:5173",
    },
});
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello its socialize backend" });
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

app.listen(process.env.PORT, () => {
    console.log("Server is up!");
});
let users = [];
const addUser = (user_id, socket_id) => {
    if (!users.some((user) => user.user_id === user_id)) {
        users.push({ user_id, socket_id });
    }
};
const removeUser = (socket_id) => {
    users = users.filter((user) => user.socket_id !== socket_id);
};

const getUser = (user_id) => {
    return users.find((user) => user.user_id === user_id);
};
io.on("connection", (socket) => {
    // connection established
    console.log("user connected");

    // take user_id and socket id from user
    socket.on("addUser", (user_id) => {
        addUser(user_id, socket.id);
        io.emit("getUsers", users);
    });

    // send and get message
    socket.on("sendMessage", ({ sender_id, receiver_id, text }) => {
        const user = getUser(receiver_id);
        io.to(user?.socket_id).emit("getMessage", {
            sender_id,
            text,
        });
    });

    // get disconnected
    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
    });
});