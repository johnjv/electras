// This file simply implements a framework for testing the
// Circuit module when no other modules are present.
var Tutorial = {};

Tutorial.circuitChanged = function () {
	var eval;
	eval = Circuit.getEvaluator();
	console.log(Circuit.getElements(), eval.evaluate('Ro').accept); //OK
};

var levels = [
	{sensors: 'C', tools: ['']},
	{sensors: 'C Y', tools: ['and']},
	{sensors: '- | o', tools: ['and', 'or', 'not'], link: 'o'}
];

function setLevel(id) {
	curState = null;
	Circuit.levelChanged(null, levels[id]);
}

var evaluator = null;

function test(item) {
	if (!evaluator) {
		evaluator = Circuit.getEvaluator();
	}
	state = evaluator.evaluate(item);
	Circuit.setState(state);
	console.log(state); //OK
}
//*/
