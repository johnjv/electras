(function (my, $, raphwrap, multidrag, Translator) {
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
		'out': new my.ElementType('out', 'light0', 10, -15, 30, 30, [
				new my.Port(true, 0, 0, 10, 0)
			], function (elt, state) {
				state.setState(elt, state.getValue(elt.ports[0]));
			}, {
				updateImage: function (elt, state) {
					if (state.getValue(elt.ports[0])) {
						elt.setImage('light1');
					} else {
						elt.setImage('light0');
					}
				}
			})
	};

	var ERROR_CIRCLE_RADIUS = 10;

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

	my.Workshop = function (jqElt, jqIface, tools) {
		var self, toolbar, canvas, errContainer;

		self = this;
		jqElt.addClass('circ_container');
		toolbar = $('<div></div>').addClass('toolbar');
		canvas = $('<div></div>').addClass('circ_canvas');
		errContainer = $('<div></div>').addClass('circ_error_parent');
		jqElt.append(toolbar);
		jqElt.append(canvas);
		canvas.append($('<div></div>').addClass('circ_error_grandparent')
			.append(errContainer));
		this.iface = jqIface;
		this.toolbar = toolbar;
		this.toolbarEnabled = true;
		this.canvas = canvas;
		this.errContainer = errContainer;
		this.errMsg = null;
		this.errElt = null;
		this.errCircs = [];
		this.gesture = new my.NullGesture(self);
		this.paper = raphwrap(canvas.get(0), canvas.width(), canvas.height());
		this.layout = new my.Layout();
		this.state = my.newInitialState(this.layout);
		this.changeListeners = [];
		this.changes = [];
		this.setSize(jqElt.width(), jqElt.height());

		function GestureHandler(e) {
			var ex, ey, gest, newGest, canvOffs;

			e.preventDefault();
			ex = e.pageX;
			ey = e.pageY;
			fixEvent(self, e);
			canvOffs = canvas.offset();
			if (self.toolbarEnabled && (ey < canvOffs.top ||
					ex < canvOffs.left)) {
				newGest = null;
				$('.tool', toolbar).each(function (i, tool) {
					var elt, offs, dx, dy, typeName;
					elt = $(tool);
					offs = elt.offset();
					dx = ex - offs.left;
					dy = ey - offs.top;
					if (dx >= 0 && dy >= 0 && dx < elt.width() &&
							dy < elt.height()) {
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

			self.paper.paintAfter(function () {
				if (gest.onDown) {
					gest.onDown(self, e);
				} else {
					gest.onDrag(self, e);
				}
			});

			self.fireChanges();
		}

		GestureHandler.prototype.onDrag = function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				self.paper.paintAfter(function () {
					gest.onDrag(self, e);
				});
			}
			self.fireChanges();
		};

		GestureHandler.prototype.onRelease = function (e) {
			var gest = self.gesture;
			e.preventDefault();
			if (gest) {
				fixEvent(self, e);
				self.paper.paintAfter(function () {
					gest.onDrag(self, e);
					gest.onRelease(self, e);
				});
			}
			self.fireChanges();
		};

		this.gestures = multidrag.create(GestureHandler).register(jqIface);

		Translator.addListener(function () {
			var errMsg, errElt, text;
			errMsg = self.errMsg;
			errElt = self.errElt;
			if (errMsg !== null && errElt !== null) {
				text = Translator.getText('circuit', errMsg);
				if (text === null) {
					text = errMsg;
				}
				errElt.text(text);
			}
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
		this.paper.paintAfter(function () {
			self.paper.clear();

			self.layout = layout;
			self.state = my.newInitialState(layout);

			$.each(layout.elts, function (i, elt) {
				my.DrawCirc.createElement(self, elt);
				elt.type.updateImage(elt, self.state);
			});
			layout.forEachWire(function (p0, p1) {
				my.DrawCirc.attachWire(self, p0, p1);
			});
		});
		self.fireChange({type: 'layoutReplaced'});
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
	};

	my.Workshop.prototype.showError = function (msg, locs) {
		var oldElt, text, oldText, errElt;

		oldElt = this.errElt;

		if (msg === null || msg === '') {
			this.setErrorCircles([]);
			if (oldElt) {
				this.errElt = null;
				this.errMsg = null;
				oldElt.stop().fadeOut(100, function () {
					oldElt.remove();
				});
			}
			return;
		}

		text = Translator.getText('circuit', msg);
		if (text === null) {
			text = msg;
		}
		if (oldElt === null) {
			oldText = '';
		} else {
			oldText = oldElt.text();
		}
		if (text !== oldText) {
			errElt = $('<span></span>').addClass('circ_error').text(text).hide();
			this.errElt = errElt;
			this.errMsg = msg;
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

		if (typeof locs !== 'undefined' && locs !== null && locs.length >= 0) {
			if (locs[0].length) {
				this.setErrorCircles(locs);
			} else {
				this.setErrorCircles([locs]);
			}
		} else {
			this.setErrorCircles([]);
		}
	};

	my.Workshop.prototype.setErrorCircles = function (locs) {
		var r, circs, numOld, num, i, loc, x, y, circ;
		r = ERROR_CIRCLE_RADIUS;
		circs = this.errCircs;
		numOld = circs.length;
		num = locs.length;
		for (i = 0; i < num; i += 1) {
			loc = locs[i];
			x = loc[0] - r;
			y = loc[1] - r;
			if (i < numOld) {
				circs[i].css({left: x, top: y}).show();
			} else {
				circ = ($('<img></img>').fadeTo(0, 0.5)
					.attr('src', my.getResourcePath('err-circ.svg'))
					.addClass('error_circle')
					.width(2 * r)
					.css({left: x, top: y}));
				this.canvas.append(circ);
				circs.push(circ);
			}
		}
		for (; i < numOld; i += 1) {
			circs[i].hide();
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

	my.Workshop.prototype.setSize = function (width, height) {
		var toolbar, canvas, paper, canvasX, canvasY;
		toolbar = this.toolbar;
		canvas = this.canvas;
		paper = this.paper;
		if (width > height) { // toolbar at left side
			if (!toolbar.hasClass('toolbar_vert')) {
				toolbar.removeClass('toolbar_horz').addClass('toolbar_vert');
			}
			canvasX = Math.min(200, toolbar.outerWidth());
			canvasY = 0;
		} else { // toolbar at top
			if (!toolbar.hasClass('toolbar_horz')) {
				toolbar.removeClass('toolbar_vert').addClass('toolbar_horz');
			}
			canvasX = 0;
			canvasY = Math.min(200, toolbar.outerHeight());
		}
		canvas.css({left: canvasX, top: canvasY,
			width: width - canvasX, height: height - canvasY});
		paper.paintAfter(function () {
			paper.setSize(width - canvasX, height - canvasY);
		});
	};

	my.Workshop.prototype.setInterfaceEnabled = function (value) {
		if (value) {
			this.gestures.register(this.iface);
		} else {
			this.gestures.unregister();
		}
	};

	my.Workshop.prototype.addChangeListener = function (listener) {
		this.changeListeners.push(listener);
	};

	my.Workshop.prototype.queueChange = function (e) {
		this.changes.push(e);
	};

	my.Workshop.prototype.fireChange = function (e) {
		var ls, i;
		ls = this.changeListeners;
		for (i = 0; i < ls.length; i += 1) {
			ls[i](e);
		}
	};

	my.Workshop.prototype.fireChanges = function () {
		var es, i;
		es = this.changes;
		this.changes = [];
		for (i = 0; i < es.length; i += 1) {
			this.fireChange(es[i]);
		}
	};
}(Workshop, jQuery, raphwrap, multidrag, Translator));
