(function (my, $) {
	"use strict";
	var ERASER_CONNECT = 15,
		CONNECT_RADIUS = 15;

	function findConnection(layout, x, y) {
		var minD2, minConn;

		minD2 = CONNECT_RADIUS * CONNECT_RADIUS + 1;
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
			for (j = elt.conns.length - 1; j >= 0; j -= 1) {
				dx = elt.conns[j].x - ex;
				dy = elt.conns[j].y - ey;
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

	// Returns LEGAL_OK if location is legal for element, LEGAL_OUT if
	// element goes beyond canvas bounds, LEGAL_OVERLAP if element
	// overlaps with other element/wire
	function isLegalPosition(info, type, x, y, ignoreElts) {
		var ignore, i, conn, ix0, iy0, ix1, iy1, ret, conns;
		ignore = ignoreElts || {};
		ix0 = x + type.imgX;
		iy0 = y + type.imgY;
		ix1 = ix0 + type.imgWidth;
		iy1 = iy0 + type.imgHeight;
		if (!info.isInside(ix0, iy0) || !info.isInside(ix1, iy0) ||
				!info.isInside(ix0, iy1) || !info.isInside(ix1, iy1)) {
			return {legal: LEGAL_OUT, conns: []};
		}
		for (i = type.conns.length - 1; i >= 0; i -= 1) {
			conn = type.conns[i];
			if (!info.isInside(x + conn.x, y + conn.y)) {
				return {legal: LEGAL_OUT, conns: []};
			}
		}

		ret = LEGAL_OK;
		conns = [];
		$.each(info.layout.elts, function (j, elt) {
			var jx0, jy0, jx1, jy1, k, ic, kc, ix, iy, kx, ky, dx, dy, d2;
			if (ignore.hasOwnProperty(elt.id)) {
				return;
			}
			jx0 = elt.x + elt.type.imgX;
			jy0 = elt.y + elt.type.imgY;
			jx1 = jx0 + elt.type.imgWidth;
			jy1 = jy0 + elt.type.imgHeight;
			if (ix0 < jx1 && jx0 < ix1 && iy0 < jy1 && jy0 < iy1) {
				ret = LEGAL_OVERLAP;
				return false;
			}
			for (k = elt.conns.length - 1; k >= 0; k -= 1) {
				kc = elt.conns[k];
				kx = elt.x + kc.x;
				ky = elt.y + kc.y;
				if (kx >= ix0 && kx < ix1 && ky >= iy0 && ky < iy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
			}
			for (i = type.conns.length - 1; i >= 0; i -= 1) {
				ic = type.conns[i];
				ix = x + ic.x;
				iy = y + ic.y;
				if (ix >= jx0 && ix < jx1 && iy >= jy0 && iy < jy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
				for (k = elt.conns.length - 1; k >= 0; k -= 1) {
					kc = elt.conns[k];
					kx = elt.x + kc.x;
					ky = elt.y + kc.y;
					dx = ix - kx;
					dy = iy - ky;
					d2 = dx * dx + dy * dy;
					if (d2 <= AUTO_CONNECT_RADIUS * AUTO_CONNECT_RADIUS) {
						if (kc.input === ic.input) {	
							ret = LEGAL_OVERLAP;
							return false;
						}
						if ((kc.input && kc.conns.length > 0
									&& !ignore.hasOwnProperty(kc.conns[0].elt.id))
								|| (ic.input && ic.conns.length > 0
									&& !ignore.hasOwnProperty(ic.conns[0].elt.id))) {
							ret = LEGAL_OVERLAP;
							return false;
						}
						conns.push([i, kc]);
					}
				}
			}
		});
		if (ret === LEGAL_OK) {
			return {legal: ret, conns: conns};
		} else {
			return {legal: ret, conns: []};
		}
	}

	function dist2ToSegment(xq, yq, x0, y0, x1, y1) {
		var dx, dy, rDen, rNum, r, xp, yp;

		dx = x1 - x0;
		dy = y1 - y0;
		rDen = dx * dx + dy * dy;
		if (rDen < 0.00001) {
			r = 0.0;
		} else {
			rNum = (xq - x0) * dx + (yq - y0) * dy;
			r = rNum / rDen;
		}

		if (r <= 0) {
			xp = x0;
			yp = y0;
		} else if (r >= 1.0) {
			xp = x1;
			yp = y1;
		} else {
			xp = x0 + r * dx;
			yp = y0 + r * dy;
		}
		dx = xp - xq;
		dy = yp - yq;
		return dx * dx + dy * dy;
	}

	function findWire(layout, x, y) {
		var bestD2, ret;
		bestD2 = ERASER_CONNECT * ERASER_CONNECT + 1;
		ret = null;
		$.each(layout.elts, function (i, elt) {
			var j, k, c0, c1, x0, y0, x1, y1, d2;
			for (k = elt.conns.length - 1; k >= 0; k -= 1) {
				c0 = elt.conns[k];
				x0 = elt.x + c0.x;
				y0 = elt.y + c0.y;
				if (c0.input) {
					for (j = c0.conns.length - 1; j >= 0; j -= 1) {
						c1 = c0.conns[j];
						x1 = c1.elt.x + c1.x;
						y1 = c1.elt.y + c1.y;
						d2 = dist2ToSegment(x, y, x0, y0, x1, y1);
						if (d2 < bestD2) {
							bestD2 = d2;
							ret = [c1, c0];
						}
					}
				}
			}
		});
		return ret;
	}

	my.getConnectedConnections = function (elt) {
		var ret;
		ret = [];
		$.each(elt.conns, function (i, c0) {
			var j;
			for (j = c0.conns.length - 1; j >= 0; j -= 1) {
				ret.push(c0.conns[j]);
			}
		});
		return ret;
	}

	my.NullGesture = function (info) { };

	my.NullGesture.prototype.mouseDown = function (info, e) {
		var x, y, best, gest, elt, newState;
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
			my.DrawCirc.attachWire(info, c0, c1);
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
				|| findWire(info.layout, e.circuitX, e.circuitY)) {
			$(this.dragImg).stop().fadeTo(0, 1.0);
		} else {
			$(this.dragImg).stop().fadeTo(0, 0.5);
		}
	};

	my.EraseGesture.prototype.mouseUp = function (info, e) {
		var wire, elt, conns;

		this.dragImg.remove();
		wire = findWire(info.layout, e.circuitX, e.circuitY);
		if (wire !== null) {
			info.layout.removeWire(wire[0], wire[1]);
			my.DrawCirc.removeWire(info, wire[0], wire[1]);
			info.circuitChanged();
			my.DrawCirc.recolorConnection(info, wire[1]);
		} else {
			elt = findElement(info.layout, e.circuitX, e.circuitY);
			if (elt !== null) {
				conns = my.getConnectedConnections(elt);
				info.layout.removeElement(elt);
				my.DrawCirc.removeElement(info, elt);
				info.circuitChanged();
				$.each(conns, function (i, conn) {
					my.DrawCirc.showStub(info, conn);
					my.DrawCirc.recolorConnection(info, conn);
				});
			}
		}
		info.setGesture(null);
	};
}(Workshop, jQuery));
