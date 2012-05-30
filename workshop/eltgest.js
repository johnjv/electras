(function (my, $) {
	"use strict";
	var AUTO_CONNECT_RADIUS = 15,
		LEGAL_OK = 0,
		LEGAL_OUT = 1,
		LEGAL_REJECT = 2;

	// Returns an object for which the "legal" key is LEGAL_OK if
	// location is legal for element, LEGAL_OUT if element goes beyond
	// canvas bounds, LEGAL_REJECT if element overlaps with other
	// element/wire. The "ports" key represents wires that should
	// be added since they come very close to the proposed element:
	// It references an array of two-element arrays, nonempty only
	// if LEGAL_OK; each two-element array holds first the index of
	// a port in the proposed element and second the port
	// to which it should be connected.
	function isLegalPosition(info, elt, eltDx, eltDy) {
		var type, x, y, i, port, ix0, iy0, ix1, iy1, ret, retErr, retLoc,
			ports, maxD2, pfor, prev, portsConnectedTo;
		ret = LEGAL_OK;
		type = elt.type;
		x = elt.x + eltDx;
		y = elt.y + eltDy;
		ix0 = x + type.imgX;
		iy0 = y + type.imgY;
		ix1 = ix0 + type.imgWidth;
		iy1 = iy0 + type.imgHeight;
		portsConnectedTo = {};
		if (!info.isInside(ix0, iy0) || !info.isInside(ix1, iy0) ||
				!info.isInside(ix0, iy1) || !info.isInside(ix1, iy1)) {
			ret = LEGAL_OUT;
		} else {
			for (i = type.ports.length - 1; i >= 0; i -= 1) {
				port = type.ports[i];
				if (!info.isInside(x + port.x, y + port.y)) {
					ret = LEGAL_OUT;
					break;
				}
			}
		}

		if (ret !== LEGAL_OK) {
			return {legal: ret, ports: [], err: null, loc: null};
		}

		ports = [];
		retErr = null;
		retLoc = null;
		$.each(info.layout.elts, function (j, other) {
			var jx0, jy0, jx1, jy1, k, ip, kp, ix, iy, kx, ky, dx, dy, d2;
			if (other === elt) {
				return true; // skip over this element
			}
			jx0 = other.x + other.type.imgX;
			jy0 = other.y + other.type.imgY;
			jx1 = jx0 + other.type.imgWidth;
			jy1 = jy0 + other.type.imgHeight;
			if (ix0 < jx1 && jx0 < ix1 && iy0 < jy1 && jy0 < iy1) {
				// other's image intersects with this image
				retErr = 'err_element_on_element';
				retLoc = [(Math.max(ix0, jx0) + Math.min(ix1, jx1)) / 2,
					(Math.max(iy0, jy0) + Math.min(iy1, jy1)) / 2];
				return false;
			}
			for (k = other.ports.length - 1; k >= 0; k -= 1) {
				kp = other.ports[k];
				kx = other.x + kp.x;
				ky = other.y + kp.y;
				if (kx >= ix0 && kx < ix1 && ky >= iy0 && ky < iy1) {
					// other's port intersects with this image
					retErr = 'err_port_on_element';
					retLoc = [kx, ky];
					return false;
				}
			}
			for (i = elt.ports.length - 1; i >= 0; i -= 1) {
				ip = elt.ports[i];
				ix = x + ip.x;
				iy = y + ip.y;
				if (ix >= jx0 && ix < jx1 && iy >= jy0 && iy < jy1) {
					// this element's port intersects with other's image
					retErr = 'err_port_on_element';
					retLoc = [ix, iy];
					return false;
				}
				for (k = other.ports.length - 1; k >= 0; k -= 1) {
					kp = other.ports[k];
					kx = other.x + kp.x;
					ky = other.y + kp.y;
					dx = ix - kx;
					dy = iy - ky;
					d2 = dx * dx + dy * dy;
					if (d2 <= AUTO_CONNECT_RADIUS * AUTO_CONNECT_RADIUS) {
						// this element's port is close enough to other's
						// port to be automatically connected
						if (kp.input === ip.input) {	
							// ports incompatible (both inputs/both outputs)
							retLoc = [[ix, iy], [kx, ky]];
							if (kp.input) {
								retErr = 'err_connect_inputs';
							} else {
								retErr = 'err_connect_outputs';
							}
							return false;
						}
						if (kp.input && kp.ports.length > 0 &&
								kp.ports[0] !== ip) {
							// the destination port is already connected
							retErr = 'err_double_input';
							retLoc = [kx, ky];
							return false;
						} else if (ip.input && ip.ports.length > 0 &&
									ip.ports[0] !== kp) {
							// the source port is already connected
							retErr = 'err_double_input';
							retLoc = [ix, iy];
							return false;
						}
						ports.push([i, kp]);
						portsConnectedTo[kp.id] = i;
					}
				}
			}
		});

		if (retErr !== null) {
			return {legal: LEGAL_REJECT, err: retErr, loc: retLoc};
		}

		// Check whether the image overlaps an existing wire and
		// whether any of the moved ports get too close to a wire
		maxD2 = my.PORT_WIRE_SEP * my.PORT_WIRE_SEP;
		info.layout.forEachWire(function (p0, p1) {
			var x0, y0, x1, y1, i, pi, d2, isect;
			if (p0.elt === elt || p1.elt === elt) {
				return true; // ignore this wire
			}
			x0 = p0.elt.x + p0.x;
			y0 = p0.elt.y + p0.y;
			x1 = p1.elt.x + p1.x;
			y1 = p1.elt.y + p1.y;
			isect = my.Wire.clip(ix0, iy0, type.imgWidth, type.imgHeight,
				x0, y0, x1, y1);
			if (isect !== null) {
				retErr = 'err_element_on_wire';
				retLoc = my.Wire.midpoint(isect);
				return false;
			}

			for (i = elt.ports.length - 1; i >= 0; i -= 1) {
				pi = elt.ports[i];
				d2 = my.Wire.dist2(x + pi.x, y + pi.y, x0, y0, x1, y1);
				if (d2 <= maxD2) {
					// If port i will be connected to the wire's endpoint,
					// don't worry that the port is close to the wire
					if (portsConnectedTo[p0.id] !== i &&
							portsConnectedTo[p1.id] !== i) {
						retErr = 'err_port_on_wire';
						retLoc = [x + pi.x, y + pi.y];
						return false;
					}
				}
			}
		});

		if (retErr !== null) {
			return {legal: LEGAL_REJECT, err: retErr, loc: retLoc};
		}

		// Check whether moved wires cross over any images or get too
		// close to any ports
		elt.forEachAttachedWire(function (p0, p1) {
			var x0, y0, x1, y1;
			x0 = x + p0.x;
			y0 = y + p0.y;
			x1 = p1.elt.x + p1.x;
			y1 = p1.elt.y + p1.y;
			$.each(info.layout.elts, function (j, other) {
				var jx, jy, isect;
				jx = other.x + other.type.imgX;
				jy = other.y + other.type.imgY;
				if (elt === other) {
					jx += eltDx;
					jy += eltDy;
				}
				isect = my.Wire.clip(jx, jy, other.type.imgWidth,
					other.type.imgHeight, x0, y0, x1, y1);
				if (isect !== null) {
					retErr = 'err_element_on_wire';
					retLoc = my.Wire.midpoint(isect);
					return false;
				}
			});
			info.layout.forEachPort(function (pi) {
				var xi, yi, d2;
				if (pi !== p0 && pi !== p1) {
					xi = pi.elt.x + pi.x;
					yi = pi.elt.y + pi.y;
					if (pi.elt === elt) {
						xi += eltDx;
						yi += eltDy;
					}
					d2 = my.Wire.dist2(xi, yi, x0, y0, x1, y1);
					if (d2 <= maxD2) {
						retErr = 'err_port_on_wire';
						retLoc = [xi, yi];
						return false;
					}
				}
			});
		});

		if (retErr !== null) {
			return {legal: LEGAL_REJECT, err: retErr, loc: retLoc};
		}

		// See if any loops would be created by added wires
		if (ports.length > 0) {
			pfor = {};
			prev = {};
			$.each(ports, function (i, p) {
				var p1, e1, p1Loc;
				p1 = p[1];
				e1 = p1.elt;
				p1Loc = p1.getLocation();
				if (p1.input) {
					e1.findElementsForward(pfor, p1Loc);
					elt.findElementsBackward(prev, p1Loc);
				} else {
					e1.findElementsBackward(prev, p1Loc);
					elt.findElementsForward(pfor, p1Loc);
				}
			});
			$.each(prev, function (id, prevLoc) {
				if (pfor.hasOwnProperty(id) && parseInt(id, 10) !== elt.id) {
					retErr = 'err_connect_loop';
					retLoc = [prevLoc, pfor[id]];
					return false;
				}
			});
		}

		if (retErr !== null) {
			return {legal: LEGAL_REJECT, err: retErr, loc: retLoc};
		}

		return {legal: LEGAL_OK, ports: ports};
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
		var imgPos;

		this.elt = elt;
		this.x0 = e.circuitX;
		this.y0 = e.circuitY;
		this.hidden = [];
		this.drawingElts = computeMovedLines(info, elt, 0, 0, [], this.hidden);
		this.dragImg = elt.imgElt;
		imgPos = elt.imgElt.position();
		this.ix0 = imgPos.left;
		this.iy0 = imgPos.top;
		this.onDone = 'moveDone';
		this.onOut = 'moveOut';
		$.each(elt.ports, function (i, port) {
			var j;
			port.stub.hide();
			port.circ.hide();
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.hideWire(info, port, port.ports[j]);
			}
		});
		info.queueChange({type: 'moveStart'});
	};

	my.MoveGesture.prototype.onDrag = function (info, e) {
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
			info.hideError();
		} else if (legal.legal === LEGAL_OUT) {
			opacity = 0.2;
			info.hideError();
		} else {
			opacity = 0.6;
			info.showError(legal.err, legal.loc);
		}
		this.dragImg.css({left: this.ix0 + dx, top: this.iy0 + dy});
		this.dragImg.stop().fadeTo(0, opacity);
		hidden = [];
		newElts = computeMovedLines(info, this.elt, dx, dy, opacity,
			legal.ports || [], hidden);
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

	my.MoveGesture.prototype.onRelease = function (info, e) {
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
			info.queueChange({type: this.onDone});
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
			info.queueChange({type: this.onOut});
		} else {
			this.cancel(info);
			info.queueChange({type: 'canceled'});
		}
		info.setGesture(null);
		info.hideError();
	};

	my.MoveGesture.prototype.cancel = function (info) {
		if (this.dragImg !== null) {
			this.dragImg.css({left: this.ix0, top: this.iy0});
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
		var dragImg, imgPos;

		this.elt = new my.Element(type, -100, -100);
		this.x0 = -100;
		this.y0 = -100;
		this.hidden = [];
		this.drawingElts = [];
		my.DrawCirc.createElement(info, this.elt);
		dragImg = this.elt.imgElt;
		imgPos = dragImg.position();
		this.dragImg = dragImg;
		this.ix0 = imgPos.left;
		this.iy0 = imgPos.top;
		info.queueChange({type: 'addStart'});
		this.onDone = 'addDone';
		this.onOut = 'canceled';
	};

	my.AddGesture.prototype.onDrag = my.MoveGesture.prototype.onDrag;

	my.AddGesture.prototype.onRelease = function (info, e) {
		info.layout.addElement(this.elt);
		my.MoveGesture.prototype.onRelease.call(this, info, e);
	};

	my.AddGesture.prototype.cancel = my.MoveGesture.prototype.cancel;
}(Workshop, jQuery));
