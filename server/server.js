// Quizshow server
var io = require('socket.io').listen(8081);
var http = require('http');
var questions = require('./questions').questions;

var questionptr = 0;

var state = {
    answersPublic: false,
    numTeams: 10,
    teamAnswers: ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    teamPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    answerOrder: [],
    curQuestion: null,
    gameOver: true,
    pointpot: 5
};

io.sockets.on('connection', function(socket) {
                  socket.emit('yes', state);
              });

var processRequest = function(url) {
    var fields = url.split('/');
    fields.shift(); // shift away the first slash

    if(fields[0] === 'reset') {
        questionptr = 0;
        state.gameOver = 0;
        state.curQuestion = null;
        state.gameOver = false;
        state.pointpot = 5;

        for(i=0; i<state.teamAnswers.length; i++){
            state.teamPoints[i] = 0;
            state.teamAnswers[i] = 'X';
        }
        state.answersPublic = false;
        state.answerOrder = [];
        state.curQuestion = questions[questionptr++];
        if (state.curQuestion === undefined) {
            state.gameOver = true;
        }
        
    } else if(fields[0] === 'show') {
        state.answersPublic = true;
    } else if(fields[0] === 'next') {
        // first, count up what teams need points
        for (var i = 0; i < state.answerOrder.length || state.pointpot === 0; i++) {
            if (state.teamAnswers[state.answerOrder[i]-1] === state.curQuestion.correct_answer) {
                state.teamPoints[state.answerOrder[i]-1] += state.pointpot--;
            }
        }
        
        // next, change question
        state.curQuestion = questions[questionptr++];

        for(i=0; i<state.teamAnswers.length; i++){
            state.teamAnswers[i] = 'X';
        }
        state.answersPublic = false;
        state.answerOrder = [];
        state.pointpot = 5;
        if (state.curQuestion === undefined) {
            state.gameOver = true;
        }
        
    } else { // this covers groups answering questions
        if (!state.gameOver) {
            var team = fields[0];
            var answer = fields[1];

            if (!state.answersPublic) {
                state.teamAnswers[team-1] = answer;

                for(i = 0; i<state.answerOrder.length; i++) {
                    if (state.answerOrder[i] === parseInt(team)) {
                        state.answerOrder.splice(i, 1);                        
                    }
                }
                state.answerOrder.push(parseInt(team));
            }
        }
    }

    console.log(state);
    return state;
};

http.createServer(function(request, response) {
		      response.writeHead(200, {"Content-Type": "text/plain"});
		      response.end("OK");
		      io.sockets.emit('yes', processRequest(request.url));
                  }).listen(8080);
