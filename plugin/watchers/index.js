var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var Mustache  = require('mustache');

var app       = express.createServer();
var staticDir = express.static;

io            = io.listen(app);

var opts = {
	port :      1947,
	baseDir :   __dirname + '/../../'
};

io.sockets.on( 'connection', function( socket ) {

	socket.on( 'connect', function( data ) {
		socket.broadcast.emit( 'connect', data );
	});

	socket.on( 'statechanged', function( data ) {
		socket.broadcast.emit( 'statechanged', data );
	});

});

app.configure( function() {

	[ 'css', 'js', 'images', 'plugin', 'lib' ].forEach( function( dir ) {
		app.use( '/' + dir, staticDir( opts.baseDir + dir ) );
	});

});

app.get('/', function( req, res ) {

	res.writeHead( 200, { 'Content-Type': 'text/html' } );
	fs.createReadStream( opts.baseDir + '/index.html' ).pipe( res );

});

app.get( '/watchers/:socketId', function( req, res ) {

	res.send( Mustache.to_html( "client count here", {
		socketId : req.params.socketId
	}));
});

// Actually listen
app.listen( opts.port || null );
