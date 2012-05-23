(function (my, $) {
	"use strict";
	var ERASER_CONNECT = 15,
		CONNECT_RADIUS = 15;

	function findPort(layout, x, y) {
		var minD2, minPort;

		minD2 = CONNECT_RADIUS * CONNECT_RADIUS + 1;
		minPort = null;
		$.each(layout.elts, function (i, elt) {
			var ex, ey;
			ex = elt.x;
			ey = elt.y;
			$.each(elt.ports, function (j, port) {
				var dx, dy, d2;
				dx = x - (ex + port.x);
				dy = y - (ey + port.y);
				d2 = dx * dx + dy * dy;
				if (d2 < minD2) {
					minD2 = d2;
					minPort = port;
				}
			});
		});
		return { d2: minD2, port: minPort };
	}

	function findElementImage(layout, x, y) {
		var ret;
		ret = null;
		$.each(layout.elts, function (i, elt) {
			var ex, ey, type;
			ex = x - elt.x;
			ey = y - elt.y;
			type = elt.type;
			if (ex >= type.imgX && ey >= type.imgY
					&& ex < type.imgX + type.imgWidth
					&& ey < type.imgY + type.imgHeight) {
				ret = elt;
				return false;
			}
		});
		return ret;
	}

	function findElement(layout, x, y) {
		var ret, bestD2;
		ret = findElementImage(layout, x, y);
		if (ret !== null) {
			return ret;
		}
		bestD2 = ERASER_CONNECT * ERASER_CONNECT + 1;
		$.each(layout.elts, function (i, elt) {
			var ex, ey, j, dx, dy, d2;
			ex = x - elt.x;
			ey = y - elt.y;
			for (j = elt.ports.length - 1; j >= 0; j -= 1) {
				dx = elt.ports[j].x - ex;
				dy = elt.ports[j].y - ey;
				d2 = dx * dx + dy * dy;
				if (d2 < bestD2) {
					bestD2 = d2;
					ret = elt;
					return false;
				}
			}
		});
		return ret;
	}

	my.getConnectedPorts = function (elt) {
		var ret;
		ret = [];
		$.each(elt.ports, function (i, p0) {
			var j;
			for (j = p0.ports.length - 1; j >= 0; j -= 1) {
				ret.push(p0.ports[j]);
			}
		});
		return ret;
	}

	my.NullGesture = function (info) { };

	my.NullGesture.prototype.mouseDown = function (info, e) {
		var x, y, best, gest, elt, newState;
		x = e.circuitX;
		y = e.circuitY;
		best = findPort(info.layout, x, y);
		if (best.port) {
			if (best.port.input && best.port.ports.length > 0) {
				info.showMessage('Input cannot be connected twice');
			} else {
				gest = new my.WiringGesture(info, best.port);
				info.setGesture(gest);
				gest.mouseDrag(info, e);
			}
		} else {
			elt = findElementImage(info.layout, x, y);
			if (elt) {
				newState = elt.type.poke(elt, x - elt.x, y - elt.y, info.state);
				if (newState) {
					info.setState(newState.evaluate());
				} else {
					gest = new my.MoveGesture(info, elt, e);
					info.setGesture(gest);
				}
			}
		}
	};

	my.NullGesture.prototype.mouseDrag = function (info, e) { };

	my.NullGesture.prototype.mouseUp = function (info, e) { };

	my.WiringGesture = function (info, port) {
		this.port0 = port;
		this.port1 = null;
		this.line = my.DrawCirc.ghostWireToCoord(info, port,
			port.elt.x + port.dx, port.elt.y + port.dy);
		my.DrawCirc.hideStub(info, port);
	};

	my.WiringGesture.prototype.cancel = function (info) {
		my.DrawCirc.showStub(info, this.port0);
		my.DrawCirc.showStub(info, this.port1);
		if (this.line) {
			this.line.remove();
			this.line = null;
		}
	};

	my.WiringGesture.prototype.mouseDrag = function (info, e) {
		var p0, p1old, p1, line;
		p0 = this.port0;
		p1old = this.port1;
		p1 = findPort(info.layout, e.circuitX, e.circuitY).port;
		if (p1) {
			if (p0 === p1) {
				p1 = null; // self-connection - do not show message
			} else if (p0.elt === p1.elt) {
				p1 = null;
				info.showMessage('Cannot connect element to itself');
			} else if (p1.input && p1.ports.length > 0) {
				p1 = null;
				info.showMessage('Input cannot be connected twice');
			} else if (p0.input && p1.input) {
				p1 = null;
				info.showMessage('Cannot connect inputs');
			} else if (!p0.input && !p1.input) {
				p1 = null;
				info.showMessage('Cannot connect outputs');
			}
		}
		if (p1 !== p1old) {
			if (this.line) {
				this.line.remove();
			}
			my.DrawCirc.showStub(info, p1old);

			this.port1 = p1;

			if (p1) {
				my.DrawCirc.hideStub(info, p1);
				this.line = my.DrawCirc.ghostWireToPort(info, p0, p1);
			}
		}
		if (p1 === null) {
			line = this.line;
			if (line) {
				line.remove();
			}
			this.line = my.DrawCirc.ghostWireToCoord(info, p0,
				e.circuitX, e.circuitY);
		}
	};

	my.WiringGesture.prototype.mouseUp = function (info, e) {
		var p0, p1;

		p0 = this.port0;
		p1 = this.port1;
		if (p1) {
			if (p0.input) { // make p0 be 'source' (component output)
				p0 = this.port1;
				p1 = this.port0;
			}
			info.layout.addWire(p0, p1);
			info.circuitChanged();
			my.DrawCirc.attachWire(info, p0, p1);
			my.DrawCirc.showStub(info, p0);
			if (this.line) {
				this.line.remove();
				this.line = null;
			}
			this.port0 = null;
			this.port1 = null;
		} else {
			my.DrawCirc.showStub(info, p0);
			this.line.remove();
		}
		info.setGesture(null);
	};

	my.EraseGesture = function (info, e) {
		this.dragImg = $('<img></img>')
			.css('position', 'absolute')
			.attr('src', my.getResourcePath('eraser.png'))
			.width(50);
		this.mouseDrag(info, e);
		info.canvas.append(this.dragImg);
	};

	my.EraseGesture.prototype.mouseDrag = function (info, e) {
		var offs0, x, y;

		offs0 = info.canvas.offset();
		x = offs0.left + e.circuitX - 0.3 * 50.0;
		y = offs0.top + e.circuitY - 50;

		this.dragImg.offset({left: x, top: y});

		if (findElement(info.layout, e.circuitX, e.circuitY) !== null
				|| my.Wire.find(info.layout, e.circuitX, e.circuitY, ERASER_CONNECT)) {
			$(this.dragImg).stop().fadeTo(0, 1.0);
		} else {
			$(this.dragImg).stop().fadeTo(0, 0.5);
		}
	};

	my.EraseGesture.prototype.mouseUp = function (info, e) {
		var wire, elt, ports;

		this.dragImg.remove();
		wire = findWire(info.layout, e.circuitX, e.circuitY, ERASER_CONNECT);
		if (wire !== null) {
			info.layout.removeWire(wire[0], wire[1]);
			my.DrawCirc.removeWire(info, wire[0], wire[1]);
			info.circuitChanged();
			my.DrawCirc.recolorPorts(info, wire[1]);
		} else {
			elt = findElement(info.layout, e.circuitX, e.circuitY);
			if (elt !== null) {
				ports = my.getConnectedPorts(elt);
				info.layout.removeElement(elt);
				my.DrawCirc.removeElement(info, elt);
				info.circuitChanged();
				$.each(ports, function (i, port) {
					my.DrawCirc.showStub(info, port);
					my.DrawCirc.recolorPort(info, port);
				});
			}
		}
		info.setGesture(null);
	};
}(Workshop, jQuery));
