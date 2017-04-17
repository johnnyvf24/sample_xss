//website 1 that is vulnerable to xss
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const http = require('http').createServer(app);
const cors = require('cors');

const allowXFrames = (req, res, next) => {
	// res.header('X-Frame-Options', 'GOFORIT');
	next();
};

app.set('port', process.env.PORT || 8050);
app.use(allowXFrames);
app.use(express.static(path.join(__dirname, './public')));

app.get('/download', function(req, res){

  var file = __dirname + '/nasty_files/image.jpg';

  var filename = path.basename(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

//listen to the required port
http.listen(app.get('port'), function() {
	console.log(`Express server listening on port ${app.get('port')}`);
});
