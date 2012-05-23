(function (my, $) {
	"use strict";
	var AUTO_CONNECT_RADIUS = 10,
		LEGAL_OK = 0,
		LEGAL_OUT = 1,
		LEGAL_OVERLAP = 2,
		LEGAL_WIRE = 3;

	// Returns an object for which the "legal" key is LEGAL_OK if
	// location is legal for element, LEGAL_OUT if element goes beyond
	// canvas bounds, LEGAL_OVERLAP if element overlaps with other
	// element/wire. The "ports" key represents wires that should
	// be added since they come very close to the proposed element:
	// It references an array of two-element arrays, nonempty only
	// if LEGAL_OK; each two-element array holds first the index of
	// a port in the proposed element and second the port
	// to which it should be connected.
	function isLegalPosition(info, elt, eltDx, eltDy) {
		var type, x, y, i, port, ix0, iy0, ix1, iy1, ret, ports;
		type = elt.type;
		x = elt.x + eltDx;
		y = elt.y + eltDy;
		ix0 = x + type.imgX;
		iy0 = y + type.imgY;
		ix1 = ix0 + type.imgWidth;
		iy1 = iy0 + type.imgHeight;
		if (!info.isInside(ix0, iy0) || !info.isInside(ix1, iy0) ||
				!info.isInside(ix0, iy1) || !info.isInside(ix1, iy1)) {
			return {legal: LEGAL_OUT, ports: []};
		}
		for (i = type.ports.length - 1; i >= 0; i -= 1) {
			port = type.ports[i];
			if (!info.isInside(x + port.x, y + port.y)) {
				return {legal: LEGAL_OUT, ports: []};
			}
		}

		ret = LEGAL_OK;
		ports = [];
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
			for (k = other.ports.length - 1; k >= 0; k -= 1) {
				kc = other.ports[k];
				kx = other.x + kc.x;
				ky = other.y + kc.y;
				if (kx >= ix0 && kx < ix1 && ky >= iy0 && ky < iy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
			}
			for (i = elt.ports.length - 1; i >= 0; i -= 1) {
				ic = elt.ports[i];
				ix = x + ic.x;
				iy = y + ic.y;
				if (ix >= jx0 && ix < jx1 && iy >= jy0 && iy < jy1) {
					ret = LEGAL_OVERLAP;
					return false;
				}
				for (k = other.ports.length - 1; k >= 0; k -= 1) {
					kc = other.ports[k];
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
						if ((kc.input && kc.ports.length > 0
									&& kc.ports[0] !== ic)
								|| (ic.input && ic.ports.length > 0
									&& ic.ports[0] !== kc)) {
							ret = LEGAL_OVERLAP;
							return false;
						}
						ports.push([i, kc]);
					}
				}
			}
		});
		if (ret === LEGAL_OK) {
			return {legal: ret, ports: ports};
		} else {
			return {legal: ret, ports: []};
		}
	}

	function computeMovedLines(info, elt, dx, dy, opacity, ports, hidden) {
		var drawingElts = [];

		$.each(elt.ports, function (i, port) {
			var willConnect, stub, circ, j, line;
			willConnect = false;
			for (j = ports.length - 1; j >= 0; j -= 1) {
				if (ports[j][0] === i) {
					willConnect = true;
				}
			}
			if (port.ports.length === 0 && !willConnect) {
				stub = my.DrawCirc.createStub(info, port, dx, dy);
				stub.circ.attr('opacity', opacity);
				stub.stub.attr('opacity', opacity);
				drawingElts.push(stub.circ);
				drawingElts.push(stub.stub);
			} else if (!port.input) {
				circ = my.DrawCirc.createStubCircle(info, port, dx, dy);
				circ.attr('opacity', opacity);
				drawingElts.push(circ);
			}
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				line = my.DrawCirc.createWire(info, port, port.ports[j],
					dx, dy);
				line.attr('opacity', opacity);
				drawingElts.push(line);
			}
		});
		$.each(ports, function (i, port) {
			var p0, p1, line;
			p0 = elt.ports[port[0]];
			p1 = port[1];
			if (p1.ports.length === 0) {
				if (p1.input) {
					hidden.push(p1.circ);
				}
				hidden.push(p1.stub);
			}
			line = my.DrawCirc.createWire(info, p0, p1, dx, dy);
			line.attr('opacity', opacity);
			drawingElts.push(line);
		});

		return drawingElts;
	}

	my.MoveGesture = function (info, elt, e) {
		this.elt = elt;
		this.x0 = e.circuitX;
		this.y0 = e.circuitY;
		this.hidden = [];
		this.drawingElts = computeMovedLines(info, elt, 0, 0, [], this.hidden);
		this.dragImg = elt.imgElt;
		this.offs0 = elt.imgElt.offset();
		$.each(elt.ports, function (i, port) {
			var j;
			my.DrawCirc.hideStub(info, port);
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.hideWire(info, port, port.ports[j]);
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
			legal.ports, hidden);
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
		var dx, dy, elt, legal, ports;
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
			$.each(legal.ports, function (i, port) {
				info.layout.addWire(elt.ports[port[0]], port[1]);
				my.DrawCirc.attachWire(info, elt.ports[port[0]], port[1]);
			});
			this.dragImg = null;

			$.each(this.drawingElts, function (i, drawingElt) {
				drawingElt.remove();
			});
			info.circuitChanged();
		} else if (legal.legal === LEGAL_OUT) {
			ports = my.getConnectedPorts(elt);
			info.layout.removeElement(elt);
			my.DrawCirc.removeElement(info, elt);
			info.circuitChanged();
			$.each(ports, function (i, port) {
				my.DrawCirc.showStub(info, port);
				my.DrawCirc.recolorPort(info, port);
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
		$.each(this.elt.ports, function (i, port) {
			var j;
			my.DrawCirc.showStub(info, port);
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.showWire(info, port, port.ports[j]);
			}
		});
	};

	my.AddGesture = function (info, type, e) {
		var dragImg, x, y;

		this.elt = new my.Element(type, -100, -100);
		this.x0 = -100;
		this.y0 = -100;
		this.hidden = [];
		this.drawingElts = [];
		my.DrawCirc.createElement(info, this.elt);
		this.dragImg = this.elt.imgElt;
		this.offs0 = this.elt.imgElt.offset();
	};

	my.AddGesture.prototype.mouseDrag = my.MoveGesture.prototype.mouseDrag;

	my.AddGesture.prototype.mouseUp = function (info, e) {
		info.layout.addElement(this.elt);
		my.MoveGesture.prototype.mouseUp.call(this, info, e);
	};

	my.AddGesture.prototype.cancel = my.MoveGesture.prototype.cancel;
}(Workshop, jQuery));
