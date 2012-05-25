(function (my, $, raphael, multidrag) {
	"use strict";
	var toolTypes = {
		'and': new my.ElementType('and', 'gateand', -60, -25, 50, 50, [
				new my.Port(false, 0, 0, -10, 0),
				new my.Port(true, -70, -20, 10, 0),
				new my.Port(true, -70,  20, 10, 0)
			], function (elt, state) {
				state.setValue(elt.ports[0],
					state.getValue(elt.ports[1]) && state.getValue(elt.ports[2]));
			}),
		'or': new my.ElementType('or', 'gateor', -60, -25, 50, 50, [
				new my.Port(false, 0, 0, -10, 0),
				new my.Port(true, -70, -20, 10, 0),
				new my.Port(true, -70,  20, 10, 0)
			], function (elt, state) {
				state.setValue(elt.ports[0],
					state.getValue(elt.ports[1]) || state.getValue(elt.ports[2]));
			}),
		'not': new my.ElementType('not', 'gatenot', -40, -15, 30, 20, [
				new my.Port(false, 0, 0, -10, 0),
				new my.Port(true, -50, 0, 10, 0)
			], function (elt, state) {
				state.setValue(elt.ports[0], !state.getValue(elt.ports[1]));
			}),
		'in': new my.ElementType('in', 'switch0', -60, -25, 50, 50, [
				new my.Port(false, 0, 0, -10, 0)
			], function (elt, state) {
				var val = state.eltStates[elt.id] || false;
				state.setValue(elt.ports[0], val);
			}, {
				poke: function (elt, x, y, state) {
					if (x >= -45 && x <= -25 && y >= -15 && y <= 15) {
						return state.setState(elt, !state.getState(elt));
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
				new my.Port(true, 0, 0, 0, -10)
			], function (elt, state) {
				state.setState(elt, state.getValue(elt.ports[0]));
			}, {
				updateImage: function (elt, state) {
					if (state.getValue(elt.ports[0])) {
						elt.setImage('output1');
					} else {
						elt.setImage('output0');
					}
				}
			})
	};

	var ERR_MESSAGES = {
		connect_inputs: 'Cannot connect inputs',
		connect_outputs: 'Cannot connect outputs',
		connect_self: 'Cannot connect element to itself',
		connect_loop: 'Cannot create loop',
		double_input: 'Input can have only one connection',

		port_on_wire: 'Port cannot be near wire',
		port_on_element: 'Port cannot overlap element',
		element_on_wire: 'Wire cannot cross element',
		element_on_element: 'Elements cannot overlap',

		move_frozen: 'Element is frozen and cannot be moved',
		remove_frozen: 'Element is frozen and cannot be removed',
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
		var self, toolbar, canvas, errContainer, name, gesture, info;

		self = this;
		jqElt.addClass('circ-container');
		toolbar = $('<div></div>').addClass('circ-toolbar');
		canvas = $('<div></div>').addClass('circ-canvas');
		errContainer = $('<div></div>').addClass('circ-error');
		jqElt.append(toolbar);
		jqElt.append(canvas);
		jqElt.append($('<div></div>').addClass('circ-error-container')
			.append(errContainer));
		this.toolbar = toolbar;
		this.toolbarEnabled = true;
		this.canvas = canvas;
		this.errContainer = errContainer;
		this.errElt = null;
		this.errText = '';
		this.gesture = new my.NullGesture(self);
		this.paper = raphael(canvas.get(0), canvas.width(), canvas.height());
		this.layout = new my.Layout();
		this.state = my.newInitialState(this.layout);
		this.changeListeners = [];

		function GestureHandler(e) {
			var ex, ey, gest, newGest, toolOffs;

			e.preventDefault();
			ex = e.pageX;
			ey = e.pageY;
			fixEvent(self, e);
			if (self.toolbarEnabled && (ey < canvas.offset().top
					|| ex < canvas.offset().left)) {
				newGest = null;
				$('.tool', toolbar).each(function (i, tool) {
					var elt, offs, dx, dy, typeName, type;
					elt = $(tool);
					offs = elt.offset();
					dx = ex - offs.left;
					dy = ey - offs.top;
					if (dx >= 0 && dy >= 0 && dx < elt.width()
							&& dy < elt.height()) {
						typeName = elt.attr('type');
						if (toolTypes.hasOwnProperty(typeName)) {
							newGest = new my.AddGesture(self,
								toolTypes[typeName], e);
						} else if (typeName === 'eraser') {
							newGest = new my.EraseGesture(self, e);
						}
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
		state = this.state.evaluate();
		self.state = state;
		$.each(state.repaintPorts, function (id, port) {
			my.DrawCirc.recolorPort(self, port);
		});
		$.each(state.repaintElts, function (id, elt) {
			elt.type.updateImage(elt, state);
		});
	};

	my.Workshop.prototype.setToolbarEnabled = function (value) {
		this.toolbarEnabled = value;
	};

	my.Workshop.prototype.setLayout = function (layout) {
		var self;

		self = this;
		$('img', this.canvas).remove();
		this.paper.clear();

		this.layout = layout;
		this.state = my.newInitialState(layout);

		$.each(layout.elts, function (i, elt) {
			my.DrawCirc.createElement(self, elt);
			elt.type.updateImage(elt, self.state);
		});
		layout.forEachWire(function (p0, p1) {
			my.DrawCirc.attachWire(self, p0, p1);
		});
		this.fireChange();
	};

	my.Workshop.prototype.setState = function (state) {
		var self;
		self = this;
		this.state = state;
		$.each(this.layout.elts, function (i, elt) {
			var j, port;
			elt.type.updateImage(elt, state);
			for (j = 0; j < elt.ports.length; j += 1) {
				port = elt.ports[j];
				my.DrawCirc.recolorPort(self, port);
			}
		});
	};

	my.Workshop.prototype.isInside = function (x, y) {
		var canvas;
		canvas = this.canvas;
		return x >= 0 && y >= 0 && x < canvas.width() && y < canvas.height();
	};

	my.Workshop.prototype.hideError = function () {
		this.showError(null, null);
	}

	my.Workshop.prototype.showError = function (msg, loc) {
		var oldElt, i, key, text, oldText, errElt;

		oldElt = this.errElt;

		if (msg === null || msg === '') {
			if (oldElt) {
				this.errElt = null;
				oldElt.stop().fadeOut(100, function () {
					oldElt.remove();
				});
			}
			return;
		}

		i = msg.lastIndexOf('.');
		if (i >= 0) {
			key = msg.substring(i + 1);
		} else {
			key = msg;
		}
		if (ERR_MESSAGES.hasOwnProperty(key)) {
			text = ERR_MESSAGES[key];
		} else {
			text = msg;
		}
		// console.log(text, loc); //OK
		if (oldElt === null) {
			oldText = '';
		} else {
			oldText = oldElt.text();
		}
		if (text !== oldText) {
			errElt = $('<span></span>').addClass('circ-error').text(text).hide();
			this.errElt = errElt;
			this.errContainer.append(errElt);
			if (oldText === '') {
				errElt.fadeIn(100);
			} else {
				oldElt.stop().fadeOut(100, function () {
					oldElt.remove();
					errElt.fadeIn(100);
				});
			}
		}
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
					.width(type.imgWidth * 0.8)
					.attr('src', my.getResourcePath(type.imgName + '.png'))
					.attr('type', type.id));
			} else if (tool === 'eraser') {
				toolbar.append($('<img></img>')
					.addClass('tool')
					.width(50 * 0.8)
					.attr('src', my.getResourcePath('eraser.png'))
					.attr('type', 'eraser'));
			} else if (tool !== '') {
				console.log('unknown tool type "' + tool + '"'); //OK
			}
		});
	};
}(Workshop, jQuery, Raphael, multidrag));
