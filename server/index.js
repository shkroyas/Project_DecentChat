const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require('nodemailer');
const cors = require("cors");
const http = require('http').Server(app);
const fs = require('fs');
const PORT = 4000;
app.use(bodyParser.json());
app.use(cors());

let users = [];

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'decentchat12@gmail.com',
        pass: 'vqxg vahz fyrr xfhk'
    }
});

const rawData = fs.readFileSync('messages.json');
const messagesData = JSON.parse(rawData);

const userDB = {
    "ankit123" : bcrypt.hashSync("password", 8),
    "admin123" : bcrypt.hashSync("password", 8)
}

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide a username and password' });
        }

        if (userDB[username] && bcrypt.compareSync(password, userDB[username])) {
            const token = jwt.sign({ username }, '12345', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/signup', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide a username and password' });
        }
        
        if (userDB[username]) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        userDB[username] = bcrypt.hashSync(password, 8);
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/check_username', (req, res) => {
    try {
        const { username } = req.body;
        if (userDB[username]) {
            res.status(200).json({ usernameFound: true });
        } else {
            res.status(400).json({ usernameFound: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/forgot_password', (req, res) => {
    try {
        const { username, newPassword } = req.body;
        if (userDB[username]) {
            userDB[username] = bcrypt.hashSync(newPassword, 8);
            res.status(200).json({ message: 'Password reset successfully' });
        } else {
            res.status(400).json({ message: 'Username not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/report', (req, res) => {
    try {
        const { id, text, name, time } = req.body;

        const mailOptions = {
            from: 'shakyaroyas@gmail.com',
            to: 'shkroyas@gmail.com',
            subject: 'Offensive Message Report',
            html: `
                <p>Message ID: ${id}</p>
                <p>Sender: ${name}</p>
                <p>Message: ${text}</p>
                <p>Time: ${new Date(time).toLocaleString()}</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent:', info.response);
                res.json({ message: 'Email sent successfully' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    const saveMessage = (data) => {
        messagesData["messages"].push(data);
        const stringData = JSON.stringify(messagesData, null, 2);
        fs.writeFile("messages.json", stringData, (err) => {
            if (err) {
                console.error(err);
            }
        });
    };

    socket.on("message", data => {
        saveMessage(data);
        socketIO.emit("messageResponse", data);
    });

    socket.on("offensiveMessage", data => {
        saveMessage(data);
        socketIO.emit("offensiveMessageResponse", data);
    });

    socket.on("typing", data => (
        socket.broadcast.emit("typingResponse", data)
    ));

    socket.on("newUser", data => {
        users.push(data);
        socketIO.emit("newUserResponse", users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter(user => user.socketID !== socket.id);
        socketIO.emit("newUserResponse", users);
        socket.disconnect();
    });
});

app.get('/api', (req, res) => {
    res.json(messagesData);
});

app.get('/', (req, res) => {
    res.send("Server is running");
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});