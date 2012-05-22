(function (my, $) {
	"use strict";
	var AUTO_CONNECT_RADIUS = 10,
		LEGAL_OK = 0,
		LEGAL_OUT = 1,
		LEGAL_OVERLAP = 2;

	// Returns an object for which the "legal" key is LEGAL_OK if
	// location is legal for element, LEGAL_OUT if element goes beyond
	// canvas bounds, LEGAL_OVERLAP if element overlaps with other
	// element/wire. The "conns" key represents wires that should
	// be added since they come very close to the proposed element:
	// It references an array of two-element arrays, nonempty only
	// if LEGAL_OK; each two-element array holds first the index of
	// a connection in the proposed element and second the connection
	// to which it should be connected.
	function isLegalPosition(info, elt, eltDx, eltDy) {
		var type, x, y, i, conn, ix0, iy0, ix1, iy1, ret, conns;
		type = elt.type;
		x = elt.x + eltDx;
		y = elt.y + eltDy;
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
		$.each(info.layout.elts, function (j, other) {
			var jx0, jy0, jx1, jy1, k, ic, kc, ix, iy, kx, ky, dx, dy, d2;
			if (other === elt) {
				return;
			}
			jx0 = other.x + other.type.imgX;
			jy0 = other.y + other.type.imgY;
			jx1 = jx0 + other.type.imgWidth;
			jy1 = jy0 + other.type.imgHeight;
			if (ix0 < jx1 && jx0 < ix1 && iy0 < jy1 && jy0 < iy1) {
				ret = LEGAL_OVERLAP;
				return false;
			}
			for (k = other.conns.length - 1; k >= 0; k -= 1) {
				kc = other.conns[k];
				kx = other.x + kc.x;
				ky = other.y + kc.y;
				if (kx >= ix0 && kx < ix1 && ky >= iy0 && ky < iy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
			}
			for (i = elt.conns.length - 1; i >= 0; i -= 1) {
				ic = elt.conns[i];
				ix = x + ic.x;
				iy = y + ic.y;
				if (ix >= jx0 && ix < jx1 && iy >= jy0 && iy < jy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
				for (k = other.conns.length - 1; k >= 0; k -= 1) {
					kc = other.conns[k];
					kx = other.x + kc.x;
					ky = other.y + kc.y;
					dx = ix - kx;
					dy = iy - ky;
					d2 = dx * dx + dy * dy;
					if (d2 <= AUTO_CONNECT_RADIUS * AUTO_CONNECT_RADIUS) {
						if (kc.input === ic.input) {	
							ret = LEGAL_OVERLAP;
							return false;
						}
						if ((kc.input && kc.conns.length > 0
									&& kc.conns[0] !== ic)
								|| (ic.input && ic.conns.length > 0
									&& ic.conns[0] !== kc)) {
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

	function computeMovedLines(info, elt, dx, dy, opacity, conns, hidden) {
		var drawingElts = [];

		$.each(elt.conns, function (i, conn) {
			var willConnect, stub, circ, j, line;
			willConnect = false;
			for (j = conns.length - 1; j >= 0; j -= 1) {
				if (conns[j][0] === i) {
					willConnect = true;
				}
			}
			if (conn.conns.length === 0 && !willConnect) {
				stub = my.DrawCirc.createStub(info, conn, dx, dy);
				stub.circ.attr('opacity', opacity);
				stub.stub.attr('opacity', opacity);
				drawingElts.push(stub.circ);
				drawingElts.push(stub.stub);
			} else if (!conn.input) {
				circ = my.DrawCirc.createStubCircle(info, conn, dx, dy);
				circ.attr('opacity', opacity);
				drawingElts.push(circ);
			}
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				line = my.DrawCirc.createWire(info, conn, conn.conns[j],
					dx, dy);
				line.attr('opacity', opacity);
				drawingElts.push(line);
			}
		});
		$.each(conns, function (i, conn) {
			var c0, c1, line;
			c0 = elt.conns[conn[0]];
			c1 = conn[1];
			if (c1.conns.length === 0) {
				if (c1.input) {
					hidden.push(c1.circ);
				}
				hidden.push(c1.stub);
			}
			line = my.DrawCirc.createWire(info, c0, c1, dx, dy);
			line.attr('opacity', opacity);
			drawingElts.push(line);
		});

		return drawingElts;
	}

	my.AddGesture = function (info, type, e) {
		var dragImg, x, y;

		this.type = type;
		this.elt = new my.Element(type, e.circuitX, e.circuitY);
		my.DrawCirc.createElement(info, this.elt);
	};

	my.AddGesture.prototype.mouseDrag = function (info, e) {
		var elt, poffs, legal;

		elt = this.elt;
		elt.x = e.circuitX;
		elt.y = e.circuitY;
		my.DrawCirc.repositionElement(info, elt);

		legal = isLegalPosition(info, elt, 0, 0);
		if (legal.legal === LEGAL_OK) {
			$(elt.imgElt).stop().fadeTo(0, 1.0);
		} else {
			$(elt.imgElt).stop().fadeTo(0, 0.5);
		}
		$.each(elt.conns, function (i, conn) {
			if (conn.circ !== null) {
				if (legal.legal === LEGAL_OK) {
					conn.circ.attr('opacity', 1.0);
				} else {
					conn.circ.attr('opacity', 0.5);
				}
			}
			if (conn.stub !== null) {
				if (legal.legal === LEGAL_OK) {
					conn.stub.attr('opacity', 1.0);
				} else {
					conn.stub.attr('opacity', 0.5);
				}
			}
		});
	};

	my.AddGesture.prototype.mouseUp = function (info, e) {
		var elt, legal;
		elt = this.elt;
		legal = isLegalPosition(info, elt, 0, 0);
		if (legal.legal === LEGAL_OK) {
			info.layout.addElement(elt);
			$.each(legal.conns, function (i, conn) {
				info.layout.addWire(elt.conns[conn[0]], conn[1]);
				my.DrawCirc.attachWire(info, elt.conns[conn[0]], conn[1]);
			});
			info.circuitChanged();
		} else {
			my.DrawCirc.removeElement(info, elt);
		}
		info.setGesture(null);
	};

	my.MoveGesture = function (info, elt, e) {
		this.elt = elt;
		this.x0 = e.circuitX;
		this.y0 = e.circuitY;
		this.hidden = [];
		this.drawingElts = computeMovedLines(info, elt, 0, 0, [], this.hidden);
		this.dragImg = elt.imgElt;
		this.offs0 = elt.imgElt.offset();
		$.each(elt.conns, function (i, conn) {
			var j;
			my.DrawCirc.hideStub(info, conn);
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.hideWire(info, conn, conn.conns[j]);
			}
		});
	};

	my.MoveGesture.prototype.mouseDrag = function (info, e) {
		var dx, dy, legal, oldElts, newElts, opacity, hidden;
		if (this.dragImg === null) {
			info.setGesture(null);
			return;
		}
		dx = e.circuitX - this.x0;
		dy = e.circuitY - this.y0;
		legal = isLegalPosition(info, this.elt, dx, dy);
		if (legal.legal === LEGAL_OK) {
			opacity = 1.0;
		} else {
			opacity = 0.5;
		}
		this.dragImg.offset({left: this.offs0.left + dx, top: this.offs0.top + dy});
		this.dragImg.stop().fadeTo(0, opacity);
		hidden = [];
		newElts = computeMovedLines(info, this.elt, dx, dy, opacity,
			legal.conns, hidden);
		$.each(this.hidden, function (i, hideElt) {
			if ($.inArray(hideElt, hidden) < 0) {
				hideElt.show();
			}
		});
		this.hidden = hidden;
		$.each(hidden, function (i, hideElt) {
			hideElt.hide();
		});
		oldElts = this.drawingElts;
		this.drawingElts = newElts;
		$.each(oldElts, function (i, drawingElt) {
			drawingElt.remove();
		});
	};

	my.MoveGesture.prototype.mouseUp = function (info, e) {
		var dx, dy, elt, legal, conns;
		$.each(this.hidden, function (i, hideElt) {
			hideElt.show();
		});
		this.hidden = [];
		dx = e.circuitX - this.x0;
		dy = e.circuitY - this.y0;
		elt = this.elt;
		legal = isLegalPosition(info, elt, dx, dy);
		if (legal.legal === LEGAL_OK) {
			if (this.dragImg === null) {
				info.setGesture(null);
				return;
			}
			elt.x += dx;
			elt.y += dy;
			my.DrawCirc.repositionElement(info, elt);
			$.each(legal.conns, function (i, conn) {
				info.layout.addWire(elt.conns[conn[0]], conn[1]);
				my.DrawCirc.attachWire(info, elt.conns[conn[0]], conn[1]);
			});
			this.dragImg = null;

			$.each(this.drawingElts, function (i, drawingElt) {
				drawingElt.remove();
			});
			info.circuitChanged();
		} else if (legal.legal === LEGAL_OUT) {
			conns = getConnectedConnections(elt);
			info.layout.removeElement(elt);
			my.DrawCirc.removeElement(info, elt);
			info.circuitChanged();
			$.each(conns, function (i, conn) {
				my.DrawCirc.showStub(info, conn);
				my.DrawCirc.recolorConnection(info, conn);
			});
			$.each(this.drawingElts, function (i, drawingElt) {
				drawingElt.remove();
			});
		} else {
			this.cancel(info);
		}
		info.setGesture(null);
	};

	my.MoveGesture.prototype.cancel = function (info) {
		if (this.dragImg !== null) {
			this.dragImg.offset(this.offs0);
			this.dragImg.fadeTo(0, 1.0);
		}
		$.each(this.drawingElts, function (i, drawingElt) {
			drawingElt.remove();
		});
		$.each(this.hidden, function (i, hideElt) {
			hideElt.show();
		});
		this.hidden = [];
		$.each(this.elt.conns, function (i, conn) {
			var j;
			my.DrawCirc.showStub(info, conn);
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.showWire(info, conn, conn.conns[j]);
			}
		});
	};
}(Workshop, jQuery));
