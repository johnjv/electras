(function (my, $, raphael) {
	"use strict";
	var toolTypes = {
		'and': new my.ElementType('and', 'gateand', -60, -25, 50, 50, [
				new my.Connection(false, 0, 0, -10, 0),
				new my.Connection(true, -70, -20, 10, 0),
				new my.Connection(true, -70,  20, 10, 0)
			], function (elt, state) {
				state.setValue(elt.conns[0],
					state.getValue(elt.conns[1]) && state.getValue(elt.conns[2]));
			}),
		'or': new my.ElementType('or', 'gateor', -60, -25, 50, 50, [
				new my.Connection(false, 0, 0, -10, 0),
				new my.Connection(true, -70, -20, 10, 0),
				new my.Connection(true, -70,  20, 10, 0)
			], function (elt, state) {
				state.setValue(elt.conns[0],
					state.getValue(elt.conns[1]) || state.getValue(elt.conns[2]));
			}),
		'not': new my.ElementType('not', 'gatenot', -40, -15, 30, 20, [
				new my.Connection(false, 0, 0, -10, 0),
				new my.Connection(true, -50, 0, 10, 0)
			], function (elt, state) {
				state.setValue(elt.conns[0], !state.getValue(elt.conns[1]));
			}),
		'in': new my.ElementType('in', 'switch0', -60, -25, 50, 50, [
				new my.Connection(false, 0, 0, -10, 0)
			], function (elt, state) {
				state.setValue(elt.conns[0], elt.state || false);
			}, function (elt, x, y) {
				if (x >= -45 && x <= -25 && y >= -15 && y <= 15) {
					elt.state = !elt.state;
					if (elt.state) {
						elt.setImage('switch1');
					} else {
						elt.setImage('switch0');
					}
					return true;
				} else {
					return false;
				}
			}),
		'out': new my.ElementType('out', 'output0', -30, -60, 50, 50, [
				new my.Connection(true, 0, 0, 0, -10)
			], function (elt, state) {
				if (state.getValue(elt.conns[0])) {
					elt.setImage('output1');
				} else {
					elt.setImage('output0');
				}
			})
	};

	function fixEvent(workshop, e) {
		var poffs;
		poffs = workshop.canvas.offset();
		e.circuitX = e.pageX - poffs.left;
		e.circuitY = e.pageY - poffs.top;
		return e;
	}

	my.Workshop = function (jqElt, tools) {
		var self, toolbar, canvas, name, gesture, info;

		self = this;
		jqElt.addClass('circ-container');
		toolbar = $('<div></div>').addClass('circ-toolbar');
		canvas = $('<div></div>').addClass('circ-canvas');
		jqElt.append(toolbar);
		jqElt.append(canvas);

		this.toolbar = toolbar;
		this.canvas = canvas;
		this.gesture = new my.NullGesture(self);
		this.paper = raphael(canvas.get(0), canvas.width(), canvas.height());
		this.layout = new my.Layout();
		this.evaluator = new my.Evaluator(this.layout);
		this.state = this.evaluator.evaluate('');

		canvas.bind('vmousedown', function (e) {
			var gest = self.gesture;
			e.preventDefault();
			fixEvent(self, e);
			if (gest.mouseDown) {
				gest.mouseDown(self, e);
			} else {
				gest.mouseDrag(self, e);
			}
		});

		canvas.bind('vmousemove', function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				gest.mouseDrag(self, e);
			}
		});

		canvas.bind('vmouseup', function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				gest.mouseDrag(self, e);
				gest.mouseUp(self, e);
			}
		});
	};

	my.Workshop.prototype.circuitChanged = function () {
		var self, state;
		self = this;
		state = self.evaluator.evaluate('');
		self.state = state;
		$.each(state.repaintConns, function (id, conn) {
			my.DrawCirc.recolorConnection(self, conn);
		});
	};

	my.Workshop.prototype.isInside = function (x, y) {
		var canvas;
		canvas = this.canvas;
		return x >= 0 && y >= 0 && x < canvas.width() && y < canvas.height();
	};

	my.Workshop.prototype.showMessage = function (msg) {
		console.log(msg);
	};

	my.Workshop.prototype.setGesture = function (value) {
		var oldGesture;
		oldGesture = this.gesture;
		if (oldGesture && oldGesture.cancel) {
			oldGesture.cancel(this);
		}
		if (value === null) {
			this.gesture = new my.NullGesture();
		} else {
			this.gesture = value;
		}
	};

	my.Workshop.prototype.setTools = function (tools) {
		var info, toolbar;
		info = this;
		toolbar = this.toolbar;

		function newHandler(type) {
			return function (e) {
				var gest;
				e.preventDefault();
				fixEvent(info, e);
				gest = new my.AddGesture(info, type, e);
				info.setGesture(gest);
				gest.mouseDrag(info, e);
			};
		}

		toolbar.empty();
		$.each(tools, function (i, tool) {
			var type;
			if (toolTypes.hasOwnProperty(tool)) {
				type = toolTypes[tool];
				toolbar.append($('<img></img>')
					.addClass('tool')
					.attr('src', 'resource/' + type.imgName + '.png')
					.bind('vmousedown', newHandler(type)));
			} else {
				console.log('unknown tool type "' + tool + '"');
			}
		});

		toolbar.imagesLoaded(function () {
			$('.tool').each(function () {
				var elt = $(this);
				elt.width(elt.width() * 0.2);
			});
		});
	};

	$(document).ready(function () {
		var main, workshop;

		main = $('#main');
		if (!main.hasClass('circ-container')) {
			workshop = new my.Workshop(main);
			workshop.setTools(['and', 'or', 'not', 'in', 'out']);
		}
	});
}(Circuit, jQuery || $, Raphael));
