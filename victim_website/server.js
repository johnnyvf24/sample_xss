//website 1 that is vulnerable to xss
const express = require('express');
const path = require('path');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');

const allowXFrames = (req, res, next) => {
	// res.header('X-Frame-Options', 'GOFORIT');
	next();
};

app.set('port', process.env.PORT || 5000);
app.set('ioPort', process.env.PORT || 5050);
app.use(allowXFrames);
app.use(express.static(path.join(__dirname, './public')));


var posts = [];

io.on('connection', (socket) => {
	console.log('a client connected');

	socket.on('send-blogpost', (data) => {
		posts.push(data.text);

		io.emit('receive-blogpost', {posts: posts});
	});

	socket.on('get-all-posts', () => {
		io.emit('receive-blogpost', {posts: posts});
	});

	socket.on('disconnect', (data) => {
		console.log('a client has disconnected!');
	})
});

io.listen(app.get('ioPort'));

//listen to the required port
http.listen(app.get('port'), function() {
	console.log(`Express server listening on port ${app.get('port')}`);
});
