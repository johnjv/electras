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
				var val = state.eltStates[elt.id] || false;
				state.setValue(elt.conns[0], val);
			}, {
				poke: function (elt, x, y, state) {
					if (x >= -45 && x <= -25 && y >= -15 && y <= 15) {
						state.setState(elt, !state.getState(elt));
						return true;
					} else {
						return false;
					}
				},
				updateImage: function (elt, state) {
					if (state.eltStates[elt.id]) {
						elt.setImage('switch1');
					} else {
						elt.setImage('switch0');
					}
				}
			}),
		'out': new my.ElementType('out', 'output0', -30, -60, 50, 50, [
				new my.Connection(true, 0, 0, 0, -10)
			], function (elt, state) {
				state.setState(elt, state.getValue(elt.conns[0]));
			}, {
				updateImage: function (elt, state) {
					if (state.getValue(elt.conns[0])) {
						elt.setImage('output1');
					} else {
						elt.setImage('output0');
					}
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

	my.getElementType = function (id) {
		return toolTypes[id];
	};

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
		this.changeListeners = [];

		function GestureHandler(e) {
			var ex, ey, gest, newGest, toolOffs;

			e.preventDefault();
			ex = e.pageX;
			ey = e.pageY;
			fixEvent(self, e);
			if (ey < canvas.offset().top) {
				newGest = null;
				$('.tool', toolbar).each(function (i, tool) {
					var elt, offs, dx, dy, type;
					elt = $(tool);
					offs = elt.offset();
					dx = ex - offs.left;
					dy = ey - offs.top;
					if (dx >= 0 && dy >= 0 && dx < elt.width()
							&& dy < elt.height()) {
						type = toolTypes[elt.attr('type')];
						newGest = new my.AddGesture(self, type, e);
						return false;
					}
				});
				if (newGest) {
					gest = self.gesture;
					self.gesture = newGest;
					if (gest && gest.cancel) {
						gest.cancel(self);
					}
					gest = newGest;
				} else {
					gest = self.gesture;
				}
			} else {
				gest = self.gesture;
			}

			if (gest.mouseDown) {
				gest.mouseDown(self, e);
			} else {
				gest.mouseDrag(self, e);
			}
			self.fireChange();
		}

		GestureHandler.prototype.onDrag = function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				gest.mouseDrag(self, e);
			}
		};

		GestureHandler.prototype.onRelease = function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				gest.mouseDrag(self, e);
				gest.mouseUp(self, e);
			}
			self.fireChange();
		};

		multidrag.register(jqElt, GestureHandler);

	};

	my.Workshop.prototype.addChangeListener = function (listener) {
		this.changeListeners.push(listener);
	};

	my.Workshop.prototype.fireChange = function () {
		$.each(this.changeListeners, function (i, listener) {
			listener();
		});
	};

	my.Workshop.prototype.circuitChanged = function () {
		var self, state;
		self = this;
		state = self.evaluator.evaluate();
		self.state = state;
		$.each(state.repaintConns, function (id, conn) {
			my.DrawCirc.recolorConnection(self, conn);
		});
		$.each(state.repaintElts, function (id, elt) {
			elt.type.updateImage(elt, state);
		});
	};

	my.Workshop.prototype.setLayout = function (layout) {
		var self;

		self = this;
		$('img', this.canvas).remove();
		this.paper.clear();

		this.layout = layout;
		this.evaluator = new my.Evaluator(layout);
		this.state = this.evaluator.evaluate();

		$.each(layout.elts, function (i, elt) {
			my.DrawCirc.createElement(self, elt);
			elt.type.updateImage(elt, self.state);
		});
		$.each(layout.elts, function (i, elt) {
			var conn0, conn1, i, j;
			for (i = elt.conns.length - 1; i >= 0; i -= 1) {
				conn0 = elt.conns[i];
				if (conn0.input) {
					for (j = conn0.conns.length - 1; j >= 0; j -= 1) {
						conn1 = conn0.conns[j];
						my.DrawCirc.createWire(self, conn0, conn1);
					}
				}
			}
		});
		this.fireChange();
	};

	my.Workshop.prototype.setState = function (state) {
		var self;
		self = this;
		this.state = state;
		$.each(this.layout.elts, function (i, elt) {
			var j, conn;
			elt.type.updateImage(elt, state);
			for (j = 0; j < elt.conns.length; j += 1) {
				conn = elt.conns[j];
				if (conn.input) {
					my.DrawCirc.recolorConnection(self, conn);
				}
			}
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

		toolbar.empty();
		$.each(tools, function (i, tool) {
			var type;
			if (toolTypes.hasOwnProperty(tool)) {
				type = toolTypes[tool];
				toolbar.append($('<img></img>')
					.addClass('tool')
					.attr('src', 'resource/' + type.imgName + '.png')
					.attr('type', type.id));
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
}(Workshop, jQuery, Raphael));
