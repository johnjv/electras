/* for testing this without tutorial present:
var Tutorial = {};

Tutorial.circuitChanged = function () {
	var eval;
	eval = Circuit.getEvaluator();
	console.log(Circuit.getElements(), eval.evaluate('Ro').accept);
};

var levels = [
	{sensors: 'C', tools: ['']},
	{sensors: 'C Y', tools: ['and']},
	{sensors: '- | o', tools: ['and', 'or', 'not']}
];

function setLevel(id) {
	Circuit.levelChanged(null, levels[id]);
}
//*/

var Circuit = (function ($) {
	"use strict";

	var my = {};
	var workshop = null;

	var colorNames = 'CRGY';
	var shapeNames = 'o|-';
	var colorSensors = [];
	var shapeSensors = [];

	(function () {
		var conns, i, c;

		function propagateSensor(elt, state) {
			state.setValue(elt.conns[0], state.getState(elt));
		}

		conns = [ new Workshop.Connection(false, 0, 0, -10, 0) ];
		for (i = 0; i < colorNames.length; i += 1) {
			c = colorNames.substring(i, i + 1);
			colorSensors.push(new Workshop.ElementType(c, 'color' + i,
				-60, -25, 50, 50, conns, propagateSensor));
		}
		for (i = 0; i < shapeNames.length; i += 1) {
			c = shapeNames.substring(i, i + 1);
			shapeSensors.push(new Workshop.ElementType(c, 'shape' + i,
				-60, -25, 50, 50, conns, propagateSensor));
		}
	}());

	$(document).ready(function () {
		var main;

		main = $('#circuit');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main);
			workshop.setTools(['and', 'or', 'not', 'in', 'out']);
			if (typeof Tutorial !== 'undefined' && Tutorial.circuitChanged) {
				workshop.addChangeListener(function () {
						Tutorial.circuitChanged();
				});
			}
		}
	});

	function EvaluatorAdapter(layout) {
		var acceptConn;
		acceptConn = null;
		$.each(layout.elts, function (i, elt) {
			if (elt.type.id === 'out') {
				acceptConn = elt.conns[0];
				return false;
			}
		});

		this.evaluator = new Workshop.Evaluator(layout);
		this.acceptConn = acceptConn;
	}

	EvaluatorAdapter.prototype.evaluate = function (item) {
		var state;
		state = this.evaluator.evaluate();
		if (this.acceptConn) {
			state.accept = state.getValue(this.acceptConn);
		} else {
			state.accept = false;
		}
		return state;
	};

	my.getEvaluator = function () {
		return new EvaluatorAdapter(workshop.layout);
	};

	my.setState = function (state) {
		workshop.setState(state);
	};

	my.getElements = function () {
		var ret, wiringConn;
		ret = [];
		if (!workshop || !workshop.layout) {
			return ret;
		}
		wiringConn = workshop.gesture.conn0 || null;
		$.each(workshop.layout.elts, function (i, elt) {
			var conns, conn, toStr, j, k;
			conns = [];
			for (j = 0; j < elt.conns.length; j += 1) {
				conn = elt.conns[j];
				if (conn === wiringConn) {
					toStr = 'active';
				} else {
					toStr = '';
				}
				for (k = 0; k < conn.conns.length; k += 1) {
					if (toStr === '') {
						toStr += conn.conns[k].elt.id;
					} else {
						toStr += ' ' + conn.conns[k].elt.id;
					}
				}
				conns.push({input: conn.input, connectedTo: toStr,
					x: elt.x + conn.x, y: elt.y + conn.y, r: 15});
			}
			ret.push({id: elt.id, type: elt.type.id, connects: conns});
		});
		return ret;
	};

	function computeSensors(sensorsString) {
		var sensors, types, totalHeight, maxWidth, gap, y, i, j, c, sensor;
		
		totalHeight = 0;
		maxWidth = 0;
		types = [];
		for (i = 0; i < sensorsString.length; i += 1) {
			c = sensorsString.substring(i, i + 1);
			sensor = null;
			j = colorNames.indexOf(c);
			if (j >= 0) {
				sensor = colorSensors[j];
			} else {
				j = shapeNames.indexOf(c);
				if (j >= 0) {
					sensor = shapeSensors[j];
				} else if (c !== ' ') {
					console.log('invalid sensor name "' + sensor + '"');
				}
			}
			if (sensor !== null) {
				totalHeight += sensor.imgHeight;
				if (-sensor.imgX > maxWidth) {
					maxWidth = -sensor.imgX;
				}
				types.push(sensor);
			}
		}
		gap = Math.round(1.0 * (workshop.canvas.height() - totalHeight) /
			(types.length + 1));
		if (gap < 10) {
			gap = 10;
		}

		console.log('metrics', workshop.canvas.height(), totalHeight, types.length, gap);

		sensors = [];
		y = 0;
		console.log(types);
		$.each(types, function (i, type) {
			y += gap;
			console.log('sensor', type.id, 'at', 10 + maxWidth, y - type.imgY);
			sensors.push(new Workshop.Element(type, 10 + maxWidth,
				y - type.imgY));
			y += type.imgHeight;
		});
		return sensors;
	}

	my.levelChanged = function (oldLevel, newLevel) {
		var layout, outType, sensors;

		layout = new Workshop.Layout();
		outType = Workshop.getElementType('out');
		layout.addElement(new Workshop.Element(outType,
			workshop.canvas.width() - 10 - outType.imgWidth + outType.imgX,
			Math.round((workshop.canvas.height() - outType.imgY) / 2.0)));
		$.each(computeSensors(newLevel.sensors), function (i, sensor) {
			layout.addElement(sensor);
		});
		workshop.setLayout(layout);
		workshop.setTools(newLevel.tools);
	};

	return my;
}(jQuery));
