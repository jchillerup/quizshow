var socket = io.connect('http://kodekode.dk:8081');

socket.on('yes', function (data) {
              renderState(data);
          });


var renderState = function(state) {
    console.log(state);   

    if (state.curQuestion !== null) {
        $("#questionContainer").show();
        $("#question").html(state.curQuestion.question);
        $("#questionA").html(state.curQuestion.answers.A);
        $("#questionB").html(state.curQuestion.answers.B);
        $("#questionC").html(state.curQuestion.answers.C);
    } else {
        $("#questionContainer").hide();
    }
    
    for (var i = 0; i<state.teamPoints; i++) {
        $group(i+1).children('.points').html(state.teamPoints[i]);
    }

    for (var i = 0; i<=state.teamAnswers.length; i++) {
        var $curDOMID = $group(i+1);
        $curDOMID.removeClass('answered correct incorrect');
        
        var newClass = '';
        
        if (state.answersPublic === false) {
            $(".answerContainer span").removeClass('correct');
            if (state.teamAnswers[i] !== 'X') {
                newClass = 'answered';
            } else {
                newClass = '';
            }
        } else {
            $("#question"+state.curQuestion.correct_answer).addClass('correct');

            if (state.teamAnswers[i] === state.curQuestion.correct_answer) {
                newClass = 'correct';
            } else {
                newClass = 'incorrect';
            }
        }            
        
        $curDOMID.addClass(newClass);
    }
};

var $group = function(id) {
    return $("#group"+id);
};
