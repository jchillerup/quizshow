// Quizshow server
var io = require('socket.io').listen(8081);
var http = require('http');

var state = {
    answersPublic: false,
    numTeams: 9,
    teamAnswers: ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
};

io.sockets.on('connection', function(socket) {
                  socket.emit('yes', state);
              });

var processRequest = function(url) {
    fields = url.split('/');
    fields.shift(); // shift away the first slash

    if(fields[0] === 'show') {
        state.answersPublic = true;
    } else if(fields[0] === 'reset') {
        for(i=0; i<state.teamAnswers.length; i++){
            state.teamAnswers[i] = 'X';
        }
        state.answersPublic = false;
    } else {
        var team = fields[0];
        var answer = fields[1];
        
        if (!state.answersPublic) {
            state.teamAnswers[team-1] = answer;            
        }     
    }

    return state;
};

http.createServer(function(request, response) {
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end("OK");
			io.sockets.emit('yes', processRequest(request.url));
}).listen(8080);
