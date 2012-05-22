var Circuit = (function ($, Workshop) {
	"use strict";

	var my = {},
		workshop = null,
		colorNames = 'CRGY',
		shapeNames = 'o|-',
		colorSensors = [],
		shapeSensors = [];

	(function () {
		var conns, i, c, sensor;

		function propagateSensor(elt, state) {
			state.setValue(elt.conns[0], state.getState(elt));
		}

		conns = [ new Workshop.Connection(false, 0, 0, -10, 0) ];
		for (i = 0; i < colorNames.length; i += 1) {
			c = colorNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'color' + i,
				-60, -25, 50, 50, conns, propagateSensor);
			sensor.isSensor = true;
			colorSensors.push(sensor);
		}
		for (i = 0; i < shapeNames.length; i += 1) {
			c = shapeNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'shape' + i,
				-60, -25, 50, 50, conns, propagateSensor);
			sensor.isSensor = true;
			shapeSensors.push(sensor);
		}
	}());

	$(document).ready(function () {
		var main;

		main = $('#circuit');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main);
			workshop.setTools(['and', 'or', 'not', 'in', 'out', 'eraser']);
			if (typeof Tutorial !== 'undefined' && Tutorial.circuitChanged) {
				workshop.addChangeListener(function () {
						Tutorial.circuitChanged();
				});
			}
		}
	});

	function Evaluator(layout) {
		var acceptConn;
		acceptConn = null;
		$.each(layout.elts, function (i, elt) {
			if (elt.type.id === 'out') {
				acceptConn = elt.conns[0];
				return false;
			}
		});

		this.state = Workshop.newInitialState(layout);
		this.acceptConn = acceptConn;
	}

	Evaluator.prototype.evaluate = function (item) {
		var state, color, shape;
		state = this.state;
		color = item.substring(0, 1);
		shape = item.substring(1, 2);
		$.each(workshop.layout.elts, function (i, elt) {
			if (elt.type.isSensor) {
				state = state.setState(elt,
					elt.type.id === color || elt.type.id === shape);
			}
		});

		state = state.evaluate();

		if (this.acceptConn) {
			state.accept = state.getValue(this.acceptConn);
		} else {
			state.accept = false;
		}
		return state;
	};

	my.getEvaluator = function () {
		return new Evaluator(workshop.layout);
	};

	my.setState = function (state) {
		workshop.setState(state);
	};

	my.getElements = function () {
		var ret, wiringConn, canvOffs, x0, y0;
		ret = [];
		if (!workshop || !workshop.layout) {
			return ret;
		}
		wiringConn = workshop.gesture.conn0 || null;
		canvOffs = workshop.canvas.offset();
		x0 = canvOffs.left;
		y0 = canvOffs.top;
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
					x: x0 + elt.x + conn.x, y: y0 + elt.y + conn.y, r: 15});
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
					console.log('invalid sensor name "' + sensor + '"'); //OK
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

		sensors = [];
		y = 0;
		$.each(types, function (i, type) {
			y += gap;
			sensors.push(new Workshop.Element(type, 10 + maxWidth,
				y - type.imgY));
			y += type.imgHeight;
		});
		return sensors;
	}

	my.levelChanged = function (oldLevel, newLevel) {
		var layout, outType, outElt, sensors, sourceElt, tools;

		layout = new Workshop.Layout();
		outType = Workshop.getElementType('out');
		outElt = new Workshop.Element(outType,
			workshop.canvas.width() - 10 - outType.imgWidth + outType.imgX,
			Math.round((workshop.canvas.height() - outType.imgY) / 2.0));
		layout.addElement(outElt);
		sourceElt = null;
		$.each(computeSensors(newLevel.sensors), function (i, sensor) {
			if (newLevel.link === sensor.type.id) {
				sourceElt = sensor;
			}
			layout.addElement(sensor);
		});
		if (sourceElt) {
			layout.addWire(sourceElt.conns[0], outElt.conns[0]);
		}
		workshop.setLayout(layout);
		tools = [];
		$.each(newLevel.tools, function (i, tool) {
			tools.push(tool);
		});
		tools.push('eraser');
		workshop.setTools(tools);
	};

	return my;
}(jQuery, Workshop));
