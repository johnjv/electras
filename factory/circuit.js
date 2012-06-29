(function (my, $, Workshop, multidrag, Clipboard, LevelSelector) {
	"use strict";

	var workshop = null,
		changeListeners = [],
		isMinimized = false,
		minimizeIcon = null,
		MINIMIZE_X = 0.1,
		MINIMIZE_Y = 0.03,
		MINIMIZE_W = 0.26,
		MINIMIZE_H = 0.26;

	function getMinimizeTransform() {
		var main = $('#main_container');
		return {
			transform: 'scale(' + MINIMIZE_W + ',' + MINIMIZE_H + ')',
			left: main.width() * ((MINIMIZE_W - 1) / 2 + MINIMIZE_X) + 'px',
			top: main.height() * ((MINIMIZE_H - 1) / 2 + MINIMIZE_Y) + 'px',
			borderWidth: '4px'
		};
	}

	function ShowClipboardGesture(e) {
		e.preventDefault();
		Clipboard.setVisible(true);
	}

	function MinimizeGesture(e) {
		e.preventDefault();
		doMinimize();
	}

	function computeHandler(e) {
		var offs, x, y;

		if (Clipboard.isInClipboardTip(e.pageX, e.pageY)) {
			return new ShowClipboardGesture(e);
		}

		if (minimizeIcon !== null) {
			offs = minimizeIcon.offset();
			x = e.pageX - offs.left;
			y = e.pageY - offs.top;
			if (x >= 0 && y >= 0 && x < minimizeIcon.width() &&
					y < minimizeIcon.height()) {
				return new MinimizeGesture(e);
			}
		}

		return null;
	}

	function doMinimize() {
		var main, backDrag;

		isMinimized = true;
		main = $('#circuit');
		main.css('border-width', 4);
		main.animate(getMinimizeTransform(), 1000);
		minimizeIcon.fadeOut();
		my.setInterfaceEnabled(false);

		function RestoreHandler() {
			var elt = $('#circuit');
			backDrag.unregister();
			minimizeIcon.fadeIn();
			elt.stop().animate({
				transform: 'scale(1)',
				left: 0,
				top: 0,
				borderWidth: 0
			}, 1000, function () {
				isMinimized = false;
				my.setInterfaceEnabled(true);
			});
		}

		RestoreHandler.prototype.onRelease = function (e) { };

		backDrag = multidrag.create(RestoreHandler, 'restore').register(main);
	}

	var initialized = false;

	function ensureInitialized() {
		var iface;

		if (!initialized) {
			initialized = true;
			iface = $('#circuit_iface');

			minimizeIcon = $('<img></img>')
				.attr('id', 'circMinimize')
				.attr('src', Workshop.getResourcePath('to-floor', ['svg', 'png']));
			$('#circuit').append(minimizeIcon);
		}
	}

	function updateLevel(oldLevel, newLevel) {
		var layout, outT, outElt, sourceElt, tools;

		if (oldLevel) {
			oldLevel.circuit = Workshop.stringify(workshop.layout);
		}

		if (newLevel === null) {
			$('#circuit').hide();
		} else {
			ensureInitialized();
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
			my.windowResized();
			$('#circuit').show();
		}
	}

	$(document).ready(function () {
		var main, iface;

		LevelSelector.addListener(updateLevel);

		main = $('#circuit');
		iface = $('#circuit_iface');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main, iface);
			workshop.setTools(['and', 'or', 'not', 'in', 'out', 'eraser']);
			workshop.addIfaceHandler(computeHandler);
			my.workshop = workshop;

			$.each(changeListeners, function (i, listener) {
				workshop.addChangeListener(listener);
			});
		}
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
		canvOffs = workshop.canvas.position();
		x0 = canvOffs.left;
		y0 = canvOffs.top;
		ret = [];
		if (!workshop || !workshop.layout) {
			return ret;
		}
		wiringPort = workshop.gesture.port0 || null;
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
		console.log('getElts', workshop, ret);
		return ret;
	};

	my.stringify = function () {
		return Workshop.stringify(workshop.layout);
	};

	my.windowResized = function (w, time) {
		var self, par, parWidth, parHeight;

		self = $('#circuit');
		
		if (typeof w === 'undefined') {
			w = self.parent().width();
			time = 0;
		}

		if (self.is(':visible')) {
			parWidth = w;
			parHeight = w / 1.5;
			self.stop().animate({ width: w, height: w / 1.5 }, time, function () {
				workshop.setSize(parWidth, parHeight);
				my.autoplace(workshop.layout, workshop.canvas.width(), workshop.canvas.height());
				workshop.layoutRearranged();
				if (isMinimized) {
					self.css(getMinimizeTransform());
				}
			});
		}
	};

	my.setInterfaceEnabled = function (value, keepIface) {
		var iface = $('#circuit_iface');
		console.log('setInterfaceEnabled', value, keepIface);
		workshop.setInterfaceEnabled(value, keepIface);
		if (value) {
			if (!isMinimized) {
				iface.show();
			}
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

	my.addInterfaceHandler = function (handler) {
		workshop.addIfaceHandler(handler);
	};

	my.getWorkshop = function () { return workshop; };

	return my;
}(Circuit, jQuery, Workshop, multidrag, Clipboard, LevelSelector));
