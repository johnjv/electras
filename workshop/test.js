// This file simply implements a framework for testing the
// Circuit module when no other modules are present.
var Tutorial = {};

Tutorial.circuitChanged = function () {
	var evaluator;
	evaluator = Circuit.getEvaluator();
	// console.log(Circuit.getElements(), eval.evaluate('Ro').accept); //OK
};

var levels = [
	{sensors: 'C', tools: ['']},
	{sensors: 'C Y', tools: ['and']},
	{sensors: '- | o', tools: ['and', 'or', 'not'], link: 'o'}
];

var curLevel, curState, evaluator;
curLevel = null;
curState = null;
evaluator = null;

function setLevel(id) {
	var oldLevel = curLevel;
	curLevel = levels[id];
	curState = null;
	Circuit.levelChanged(oldLevel, curLevel);
}

function test(item) {
	if (!evaluator) {
		evaluator = Circuit.getEvaluator();
	}
	state = evaluator.evaluate(item);
	Circuit.setState(state);
	console.log(state); //OK
}

function configureLetterbox(jqElt, widthToHeight, resizeCallback, options) {
	var lastWMax, lastHMax, resizeTimer, border;
	lastWMax = -1;
	resizeTimer = null;
	border = 0;
	if (options && options.hasOwnProperty('border')) {
		border = options.border;
	}

	function resizeElt() {
		var body, wMax, hMax, x0, y0, w, h, bv, bh, time;
		body = $('body');
		wMax = body.width();
		hMax = body.height();
		if (hMax === lastHMax && wMax === lastWMax) {
			return;
		}
		if (lastWMax < 0) {
			time = 1;
		} else {
			time = 100;
		}
		lastHMax = hMax;
		lastWMax = wMax;
		if (wMax < hMax * widthToHeight) { // too tall - size based on wMax
			w = wMax;
			h = Math.floor(wMax / widthToHeight);
			x0 = 0;
			y0 = (hMax - h) / 2;
		} else { // too wide - size based on hMax
			w = Math.floor(hMax * widthToHeight);
			h = hMax;
			x0 = (wMax - w) / 2;
			y0 = 0;
		}
		bh = Math.min(border, Math.floor((hMax - h) / 2.0));
		bv = Math.min(border, Math.floor((wMax - w) / 2.0));
		jqElt.css('border-width', 0);
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			jqElt.stop().animate({
				width: w,
				height: h,
				left: x0,
				top: y0
			}, time * 5, function () {
				jqElt.css('border-top-width', bh);
				jqElt.css('border-bottom-width', bh);
				jqElt.css('border-left-width', bv);
				jqElt.css('border-right-width', bv);
				resizeCallback();
			});
		}, time);
	}

	$(window).resize(resizeElt);
	resizeElt();
}

$(document).ready(function () {
	configureLetterbox($('#main_container'), 1.5, function () {
		Circuit.windowResized();
	}, { border: 3 });
});
//*/
