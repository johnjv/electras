(function (my, $, Workshop, multidrag) {
	"use strict";

	var workshop = null,
		changeListeners = [],
		isMinimized = false,
		minimizeIcon = null,
		minimizeDrag = null,
		MINIMIZE_X = 0.05,
		MINIMIZE_Y = 0.1,
		MINIMIZE_W = 0.3,
		MINIMIZE_H = 0.3;

	function placeMinimizeIcon() {
		var main, mainOffs;

		main = $('#main_container');
		mainOffs = main.offset();
		minimizeIcon.offset({left: mainOffs.left + 10,
			top: mainOffs.top + main.height() - 10 - 40});
	}

	function getMinimizeTransform() {
		var main = $('#main_container');
		return {
			transform: 'scale(' + MINIMIZE_W + ',' + MINIMIZE_H + ')',
			left: main.width() * ((MINIMIZE_W - 1) / 2 + MINIMIZE_X) + 'px',
			top: main.height() * ((MINIMIZE_H - 1) / 2 + MINIMIZE_Y) + 'px',
			borderWidth: '4px'
		};
	}

	function doMinimize() {
		var main, backDrag;

		isMinimized = true;
		my.setMinimizeEnabled(false);
		main = $('#circuit');
		main.css('border-width', 4);
		main.animate(getMinimizeTransform(), 1000);
		my.setInterfaceEnabled(false);

		function RestoreHandler() {
			backDrag.unregister();
			$('#circuit').animate({
				transform: 'scale(1)',
				left: 0,
				top: 0,
				borderWidth: 0
			}, 1000, function () {
				isMinimized = false;
				my.setInterfaceEnabled(true);
				my.setMinimizeEnabled(true);
			});
		}

		RestoreHandler.prototype.onRelease = function (e) { };

		backDrag = multidrag.create(RestoreHandler, 'restore').register(main);
	}

	$(document).ready(function () {
		var main, iface;

		main = $('#circuit');
		iface = $('#circuit_iface');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main, iface);
			workshop.setTools(['and', 'or', 'not', 'in', 'out', 'eraser']);
			my.workshop = workshop;

			$.each(changeListeners, function (i, listener) {
				workshop.addChangeListener(listener);
			});
		}


		minimizeIcon = $('<img></img>')
			.attr('src', Workshop.getResourcePath('to-floor', ['svg', 'png']))
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

		MinimizeHandler.prototype.onRelease = function (e) { };

		minimizeDrag = multidrag.create(MinimizeHandler, 'minimize').register(iface);
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

	my.levelChanged = function (oldLevel, newLevel) {
		var layout, outT, outElt, sourceElt, tools;

		if (oldLevel) {
			oldLevel.circuit = Workshop.stringify(workshop.layout);
		}

		if (newLevel.circuit) {
			layout = Workshop.parse(newLevel.circuit, my.elementMap);
		} else {
			layout = my.computeLayout(newLevel.sensors, newLevel.link,
				workshop.canvas.width(), workshop.canvas.height());
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
		var self, par, parWidth, parHeight;
		
		self = $('#circuit');
		par = self.parent();
		parWidth = par.width();
		parHeight = par.height();
		self.width(parWidth);
		self.height(parHeight);
		workshop.setSize(parWidth, parHeight);
		my.autoplace(workshop.layout, workshop.canvas.width(), workshop.canvas.height());
		workshop.layoutRearranged();
		if (isMinimized) {
			self.css(getMinimizeTransform());
		}
		placeMinimizeIcon();
	};

	my.setMinimizeEnabled = function (value) {
		if (value) {
			minimizeIcon.fadeIn(function () {
				placeMinimizeIcon();
			});
			minimizeDrag.register($('#circuit_iface'));
		} else {
			minimizeIcon.fadeOut();
			minimizeDrag.unregister();
		}
	};

	my.setInterfaceEnabled = function (value, keepIface) {
		var iface;
		console.log('setInterfaceEnabled', value, keepIface);
		workshop.setInterfaceEnabled(value, keepIface);
		iface = $('#circuit_iface');
		if (value) {
			iface.show();
		} else {
			if (keepIface !== true) {
				iface.hide();
			}
		}
	};

	my.addChangeListener = function (listener) {
		if (workshop === null) {
			changeListeners.push(listener);
		} else {
			workshop.addChangeListener(listener);
		}
	};

	return my;
}(Circuit, jQuery, Workshop, multidrag));
