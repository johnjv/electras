var Circuit = (function ($, Workshop, multidrag) {
	"use strict";

	var my = {},
		workshop = null,
		minimizeIcon = null,
		minimizeDrag = null,
		colorNames = 'CRGY',
		shapeNames = 'o|-',
		colorSensors = [],
		shapeSensors = [],
		elementMap = {};

	(function () {
		var ports, i, c, sensor;

		function propagateSensor(elt, state) {
			state.setValue(elt.ports[0], state.getState(elt));
		}

		ports = [ new Workshop.Port(false, 0, 0, -10, 0) ];
		for (i = 0; i < colorNames.length; i += 1) {
			c = colorNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'color' + i,
				-60, -25, 50, 50, ports, propagateSensor);
			sensor.isSensor = true;
			colorSensors.push(sensor);
			elementMap[c] = sensor;
		}
		for (i = 0; i < shapeNames.length; i += 1) {
			c = shapeNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'shape' + i,
				-60, -25, 50, 50, ports, propagateSensor);
			sensor.isSensor = true;
			shapeSensors.push(sensor);
			elementMap[c] = sensor;
		}

		$.each(['in', 'out', 'and', 'or', 'not'], function (i, key) {
			var val = Workshop.getElementType(key);
			if (val) {
				elementMap[key] = val;
			}
		});
	}());

	function placeMinimizeIcon() {
		var main, mainOffs;

		main = $('#main_container');
		mainOffs = main.offset();
		minimizeIcon.offset({left: mainOffs.left + 8,
			top: mainOffs.top + main.height() - 10 - 40});
	}

	function doMinimize() {
		var main, backDrag;

		my.setMinimizeEnabled(false);
		main = $('#circuit');
		main.css('border-width', 4);
		main.animate({
			transform: 'scale(0.3, 0.25)',
			left: '-=' + (main.width() * 0.3) + 'px',
			top: '-=' + (main.width() * 0.2) + 'px',
			borderWidth: '4px'
		}, 1000);
		workshop.setInterfaceEnabled(false);

		function RestoreHandler() {
			backDrag.unregister();
			$('#circuit').animate({
				transform: 'scale(1)',
				left: 0,
				top: 0,
				borderWidth: 0
			}, 1000, function () {
				workshop.setInterfaceEnabled(true);
				my.setMinimizeEnabled(true);
			});
		}

		RestoreHandler.prototype.onUp = function (e) { };

		backDrag = multidrag.create(RestoreHandler).register(main);
	}

	$(document).ready(function () {
		var main, iface;

		main = $('#circuit');
		iface = $('#circuit_iface');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main, iface);
			workshop.setTools(['and', 'or', 'not', 'in', 'out', 'eraser']);
			if (typeof Tutorial !== 'undefined' && Tutorial.circuitChanged) {
				workshop.addChangeListener(function () {
						Tutorial.circuitChanged();
				});
			}
			my.workshop = workshop;
		}

		minimizeIcon = $('<img></img>')
			.attr('src', Workshop.getResourcePath('to-floor.svg'))
			.css({position: 'absolute', width: '40px'});
		iface.append(minimizeIcon);
		placeMinimizeIcon();

		function MinimizeHandler(e) {
			var offs, x, y;

			offs = minimizeIcon.offset();
			x = e.pageX - offs.left;
			y = e.pageY - offs.top;
			if (x >= 0 && y >= 0 && x < minimizeIcon.width() &&
					y < minimizeIcon.height()) {
				e.preventDefault();
				doMinimize();
			}
		}

		MinimizeHandler.prototype.onUp = function (e) { };

		minimizeDrag = multidrag.create(MinimizeHandler).register(iface);
	});

	function Evaluator(layout) {
		var acceptPort;
		acceptPort = null;
		$.each(layout.elts, function (i, elt) {
			if (elt.type.id === 'out') {
				acceptPort = elt.ports[0];
				return false;
			}
		});

		this.state = Workshop.newInitialState(layout);
		this.acceptPort = acceptPort;
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

		if (this.acceptPort) {
			state.accept = state.getValue(this.acceptPort);
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
		var ret, wiringPort, canvOffs, x0, y0;
		ret = [];
		if (!workshop || !workshop.layout) {
			return ret;
		}
		wiringPort = workshop.gesture.port0 || null;
		canvOffs = workshop.canvas.offset();
		x0 = canvOffs.left;
		y0 = canvOffs.top;
		$.each(workshop.layout.elts, function (i, elt) {
			var ports, port, toStr, j, k;
			ports = [];
			for (j = 0; j < elt.ports.length; j += 1) {
				port = elt.ports[j];
				if (port === wiringPort) {
					toStr = 'active';
				} else {
					toStr = '';
				}
				for (k = 0; k < port.ports.length; k += 1) {
					if (toStr === '') {
						toStr += port.ports[k].elt.id;
					} else {
						toStr += ' ' + port.ports[k].elt.id;
					}
				}
				ports.push({input: port.input, connectedTo: toStr,
					x: x0 + elt.x + port.x, y: y0 + elt.y + port.y, r: 15});
			}
			ret.push({id: elt.id, type: elt.type.id, connects: ports});
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
		var layout, outT, outElt, sourceElt, tools;

		if (oldLevel) {
			oldLevel.circuit = Workshop.stringify(workshop.layout);
		}

		if (newLevel.circuit) {
			layout = Workshop.parse(newLevel.circuit, elementMap);
		} else {
			layout = new Workshop.Layout();
			outT = Workshop.getElementType('out');
			outElt = new Workshop.Element(outT,
				workshop.canvas.width() - 10 - outT.imgWidth + outT.imgX,
				Math.round((workshop.canvas.height() - outT.imgY) / 2.0));
			outElt.isFrozen = true;
			layout.addElement(outElt);
			sourceElt = null;
			$.each(computeSensors(newLevel.sensors), function (i, sensor) {
				sensor.isFrozen = true;
				if (newLevel.link === sensor.type.id) {
					sourceElt = sensor;
				}
				layout.addElement(sensor);
			});
			if (sourceElt) {
				layout.addWire(sourceElt.ports[0], outElt.ports[0]);
			}
		}
		workshop.setLayout(layout);
		tools = [];
		$.each(newLevel.tools, function (i, tool) {
			tools.push(tool);
		});
		tools.push('eraser');
		workshop.setTools(tools);
	};

	my.stringify = function () {
		return Workshop.stringify(workshop.layout);
	};

	my.windowResized = function () {
		var par, self;
		
		self = $('#circuit');
		par = self.parent();
		self.width(par.width());
		self.height(par.height());
		workshop.setSize(par.width(), par.height());
		placeMinimizeIcon();
	};

	my.setMinimizeEnabled = function (value) {
		if (value) {
			minimizeIcon.fadeIn();
			minimizeDrag.register($('#circuit_iface'));
		} else {
			minimizeIcon.fadeOut();
			minimizeDrag.unregister();
		}
	};

	my.setInterfaceEnabled = function (value) {
		workshop.setInterfaceEnabled(value);
	};

	return my;
}(jQuery, Workshop, multidrag));
