var socket = io.connect('http://kodekode.dk:8081');

socket.on('yes', function (data) {
              renderState(data);
          });


var renderState = function(state) {

    for (var i = 0; i<=state.teamAnswers.length; i++) {
        var $curDOMID = $group(i+1);
        $curDOMID.removeClass('answered correct incorrect');
        
        var newClass = '';
        
        if (state.curQuestion !== null) {
            $("#questionContainer").show();
            $("#question").html(state.curQuestion.question);
            $("#questionA".html(state.curQuestion.answers.A));
            $("#questionB".html(state.curQuestion.answers.B));
            $("#questionC".html(state.curQuestion.answers.C));
        } else {
            $("#questionContainer").hide();
        }
        
        if (state.answersPublic === false) {
            if (state.teamAnswers[i] !== 'X') {
                newClass = 'answered';
            } else {
                newClass = '';
            }
        } else {
            switch(state.teamAnswers[i]) {
            case 'A':
                newClass = 'correct';
                break;
            case 'B':
                newClass = 'incorrect';
                break;
            case 'C':
                newClass = 'incorrect';
                break;
            }
        }            
        
        $curDOMID.addClass(newClass);
    }
};

var $group = function(id) {
    return $("#group"+id);
};
