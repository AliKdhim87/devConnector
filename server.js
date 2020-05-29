const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const connectDB = require('./config/db');
const path = require('path');
const Message = require('./models/Message');

connectDB();

// io.on('connection', function (socket) {
//   let connectedClients = {};
//   console.log('client connect');
//   socket.on('message', function (data) {
//     connectedClients[data.corresponderId] = socket.id;
//   });
//   socket.on('privateMessage', async (owner, corresponderId) => {
//     const id = connectedClients[owner];

//     const corresponderMessages = await Message.findOneAndUpdate(
//       { owner: owner, corresponder: corresponderId },
//       { $set: { hasNewMessage: false } },
//       { new: true, upsert: true }
//     )
//       .populate({
//         path: 'corresponder',
//         select: 'name avatar',
//       })
//       .exec();

//     console.log(corresponderMessages);
//     io.sockets.to(id).emit('sendMessage', corresponderMessages);
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnect');
//   });
// });

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/users/message', require('./routes/api/message'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
