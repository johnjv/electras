(function (my, $) {
	"use strict";
	function findConnection(layout, x, y) {
		var minD2, minConn;

		minD2 = 226;
		minConn = null;
		$.each(layout.elts, function (i, elt) {
			var ex, ey;
			ex = elt.x;
			ey = elt.y;
			$.each(elt.conns, function (j, conn) {
				var dx, dy, d2;
				dx = x - (ex + conn.x);
				dy = y - (ey + conn.y);
				d2 = dx * dx + dy * dy;
				if (d2 < minD2) {
					minD2 = d2;
					minConn = conn;
				}
			});
		});
		return { d2: minD2, conn: minConn };
	}
	
	function findElement(layout, x, y) {
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

	my.NullGesture = function (info) { };

	my.NullGesture.prototype.mouseDown = function (info, e) {
		var x, y, best, gest, elt;
		x = e.circuitX;
		y = e.circuitY;
		best = findConnection(info.layout, x, y);
		if (best.conn) {
			if (best.conn.input && best.conn.conns.length > 0) {
				info.showMessage('Input cannot be connected twice');
			} else {
				gest = new my.WiringGesture(info, best.conn);
				info.setGesture(gest);
				gest.mouseDrag(info, e);
			}
		} else {
			elt = findElement(info.layout, x, y);
			if (elt) {
				if (elt.type.poke(elt, x - elt.x, y - elt.y)) {
					info.circuitChanged();
				} else {
					// TODO initiate move
				}
			}
		}
	};

	my.NullGesture.prototype.mouseDrag = function (info, e) { };

	my.NullGesture.prototype.mouseUp = function (info, e) { };

	my.AddGesture = function (info, type, e) {
		var dragImg, x, y;

		this.type = type;
		this.elt = new my.Element(type, e.circuitX, e.circuitY);
		my.DrawCirc.createElement(info, this.elt);
	};

	my.AddGesture.prototype.isLegalPosition = function (info) {
		var elt, x, y, t, i, conn;
		elt = this.elt;
		x = elt.x;
		y = elt.y;
		t = elt.type;
		if (!info.isInside(x + t.imgX + t.imgWidth, y + t.imgY + t.imgHeight) ||
				!info.isInside(x + t.imgX + t.imgWidth, y + t.imgY) ||
				!info.isInside(x + t.imgX, y + t.imgY + t.imgHeight) ||
				!info.isInside(x + t.imgX, y + t.imgY)) {
			return false;
		}
		for (i = elt.conns.length - 1; i >= 0; i -= 1) {
			conn = elt.conns[i];
			if (!info.isInside(x + conn.x, y + conn.y)) {
				return false;
			}
		}
		return true;
	};

	my.AddGesture.prototype.mouseDrag = function (info, e) {
		var elt, poffs, legal;

		elt = this.elt;
		elt.x = e.circuitX;
		elt.y = e.circuitY;
		my.DrawCirc.repositionElement(info, elt);

		legal = this.isLegalPosition(info);
		if (legal) {
			$(elt.imgElt).stop().fadeTo(0, 1.0);
		} else {
			$(elt.imgElt).stop().fadeTo(0, 0.5);
		}
		$.each(elt.conns, function (i, conn) {
			if (conn.circ !== null) {
				if (legal) {
					conn.circ.attr('opacity', 1.0);
				} else {
					conn.circ.attr('opacity', 0.5);
				}
			}
			if (conn.stub !== null) {
				if (legal) {
					conn.stub.attr('opacity', 1.0);
				} else {
					conn.stub.attr('opacity', 0.5);
				}
			}
		});
	};

	my.AddGesture.prototype.mouseUp = function (info, e) {
		var x, y, elt;
		elt = this.elt;
		if (this.isLegalPosition(info)) {
			info.layout.addElement(elt);
			info.circuitChanged();
		} else {
			my.DrawCirc.removeElement(info, elt);
		}
		info.setGesture(null);
	};

	my.WiringGesture = function (info, conn) {
		this.conn0 = conn;
		this.conn1 = null;
		this.line = my.DrawCirc.ghostWireToCoord(info, conn,
			conn.elt.x + conn.dx, conn.elt.y + conn.dy);
		my.DrawCirc.hideStub(info, conn);
	};

	my.WiringGesture.prototype.cancel = function (info) {
		my.DrawCirc.showStub(info, this.conn0);
		my.DrawCirc.showStub(info, this.conn1);
		if (this.line) {
			this.line.remove();
			this.line = null;
		}
	};

	my.WiringGesture.prototype.mouseDrag = function (info, e) {
		var c0, c1old, c1, line;
		c0 = this.conn0;
		c1old = this.conn1;
		c1 = findConnection(info.layout, e.circuitX, e.circuitY).conn;
		if (c1) {
			if (c0 === c1) {
				c1 = null; // self-connection - do not show message
			} else if (c0.elt === c1.elt) {
				c1 = null;
				info.showMessage('Cannot connect element to itself');
			} else if (c1.input && c1.conns.length > 0) {
				c1 = null;
				info.showMessage('Input cannot be connected twice');
			} else if (c0.input && c1.input) {
				c1 = null;
				info.showMessage('Cannot connect inputs');
			} else if (!c0.input && !c1.input) {
				c1 = null;
				info.showMessage('Cannot connect outputs');
			}
		}
		if (c1 !== c1old) {
			if (this.line) {
				this.line.remove();
			}
			my.DrawCirc.showStub(info, c1old);

			this.conn1 = c1;

			if (c1) {
				my.DrawCirc.hideStub(info, c1);
				this.line = my.DrawCirc.ghostWireToConn(info, c0, c1);
			}
		}
		if (c1 === null) {
			line = this.line;
			if (line) {
				line.remove();
			}
			this.line = my.DrawCirc.ghostWireToCoord(info, c0,
				e.circuitX, e.circuitY);
		}
	};

	my.WiringGesture.prototype.mouseUp = function (info, e) {
		var c0, c1;

		c0 = this.conn0;
		c1 = this.conn1;
		if (c1) {
			if (c0.input) { // make c0 be 'source' (component output)
				c0 = this.conn1;
				c1 = this.conn0;
			}
			info.layout.addWire(c0, c1);
			info.circuitChanged();
			my.DrawCirc.createWire(info, c0, c1);
			my.DrawCirc.showStub(info, c0);
			if (this.line) {
				this.line.remove();
				this.line = null;
			}
			this.conn0 = null;
			this.conn1 = null;
		} else {
			my.DrawCirc.showStub(info, c0);
			this.line.remove();
		}
		info.setGesture(null);
	};
}(Circuit, jQuery || $));
