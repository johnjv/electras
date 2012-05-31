(function (my, $) {
	"use strict";
	var ERASER_CONNECT = 15,
		CONNECT_RADIUS = 18;

	my.PORT_WIRE_SEP = 15;

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
			if (ex >= type.imgX && ey >= type.imgY &&
					ex < type.imgX + type.imgWidth &&
					ey < type.imgY + type.imgHeight) {
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
	};

	my.NullGesture = function (info) { };

	my.NullGesture.prototype.onDown = function (info, e) {
		var x, y, best, gest, elt, newState;
		x = e.circuitX;
		y = e.circuitY;
		best = findPort(info.layout, x, y);
		if (best.port) {
			if (best.port.input && best.port.ports.length > 0) {
				info.showError('err_double_input',
					best.port.getLocation());
			} else {
				gest = new my.WiringGesture(info, best.port);
				info.setGesture(gest);
				gest.onDrag(info, e);
			}
		} else {
			elt = findElementImage(info.layout, x, y);
			if (elt) {
				newState = elt.type.poke(elt, x - elt.x, y - elt.y, info.state);
				if (newState) {
					info.setState(newState.evaluate());
					info.queueChange({type: 'poke'});
				} else {
					if (elt.isFrozen) {
						info.showError('err_move_frozen', [x, y]);
					} else {
						gest = new my.MoveGesture(info, elt, e);
						info.setGesture(gest);
					}
				}
			}
		}

	};

	my.NullGesture.prototype.onDrag = function (info, e) { };

	my.NullGesture.prototype.onRelease = function (info, e) {
		info.hideError();
	};

	function isWireLegal(layout, p0, p1, connected) {
		var x0, y0, x1, y1, maxD2, ret, retp;

		if (p0 === p1) {
			return { ok: false, err: null, loc: null };
		} else if (p0.input && p1.input) {
			return { ok: false, err: 'err_connect_inputs',
				loc: [p0.getLocation(), p1.getLocation()] };
		} else if (!p0.input && !p1.input) {
			return { ok: false, err: 'err_connect_outputs',
				loc: [p0.getLocation(), p1.getLocation()] };
		} else if (p0.elt === p1.elt) {
			return { ok: false, err: 'err_connect_self',
				loc: [p0.getLocation(), p1.getLocation()] };
		} else if (connected.hasOwnProperty(p1.elt.id)) {
			return { ok: false, err: 'err_connect_loop',
				loc: [p0.getLocation(), p1.getLocation()] };
		} else if (p1.input && p1.ports.length > 0) {
			return { ok: false, err: 'err_double_input',
				loc: p1.getLocation() };
		}

		x0 = p0.elt.x + p0.x;
		y0 = p0.elt.y + p0.y;
		x1 = p1.elt.x + p1.x;
		y1 = p1.elt.y + p1.y;

		maxD2 = my.PORT_WIRE_SEP * my.PORT_WIRE_SEP;
		ret = null;
		layout.forEachPort(function (p) {
			var xp, yp, d2;
			if (p !== p0 && p !== p1) {
				xp = p.elt.x + p.x;
				yp = p.elt.y + p.y;
				d2 = my.Wire.dist2(xp, yp, x0, y0, x1, y1);
				if (d2 <= maxD2) {
					ret = 'err_port_on_wire';
					retp = [xp, yp];
					return false;
				}
			}
		});
		if (ret !== null) {
			return { ok: false, err: ret, loc: retp };
		}

		$.each(layout.elts, function (i, elt) {
			var ix, iy, iw, ih, clip;
			ix = elt.x + elt.type.imgX;
			iy = elt.y + elt.type.imgY;
			iw = elt.type.imgWidth;
			ih = elt.type.imgHeight;
			clip = my.Wire.clip(ix, iy, iw, ih, x0, y0, x1, y1);
			if (clip !== null) {
				ret = 'err_element_on_wire';
				retp = my.Wire.midpoint(clip);
				return false;
			}
		});
		if (ret !== null) {
			return { ok: false, err: ret, loc: retp };
		}
		return { ok: true };
	}

	my.WiringGesture = function (info, port) {
		this.port0 = port;
		this.port1 = null;
		this.line = my.DrawCirc.ghostWireToCoord(info, port,
			port.elt.x + port.dx, port.elt.y + port.dy);
		this.connected = port.elt.findElements(!port.input);
		my.DrawCirc.hideStub(info, port);
		info.queueChange({type: 'wireStart'});
	};

	my.WiringGesture.prototype.cancel = function (info) {
		my.DrawCirc.showStub(info, this.port0);
		my.DrawCirc.showStub(info, this.port1);
		if (this.line) {
			this.line.remove();
			this.line = null;
		}
	};

	my.WiringGesture.prototype.onDrag = function (info, e) {
		var p0, p1old, p1cand, p1, line, legal, change;

		p0 = this.port0;
		p1old = this.candPort1;
		p1cand = findPort(info.layout, e.circuitX, e.circuitY).port;

		if (p1cand === null) {
			info.hideError();
			change = true;
			p1 = null;
		} else if (p1cand === p1old) {
			change = false;
			p1 = this.port1;
		} else {
			change = true;
			legal = isWireLegal(info.layout, p0, p1cand, this.connected);
			if (legal.ok) {
				info.hideError();
				p1 = p1cand;
			} else {
				p1 = null;
				if (legal.err) {
					info.showError(legal.err, legal.loc);
				} else {
					info.hideError();
				}
			}
		}
		if (change) {
			this.candPort1 = p1cand;
			this.port1 = p1;

			line = this.line;
			if (line) {
				line.remove();
			}
			if (p1old && p1old !== p0) {
				my.DrawCirc.showStub(info, p1old);
			}
			if (p1cand) {
				my.DrawCirc.hideStub(info, p1cand);
				if (p1 === p1cand) {
					this.line = my.DrawCirc.ghostWireToPort(info, p0, p1cand, 0.75);
				} else {
					this.line = my.DrawCirc.ghostWireToPort(info, p0, p1cand, 0.3);
				}
			} else {
				this.line = my.DrawCirc.ghostWireToCoord(info, p0,
					e.circuitX, e.circuitY, 0.3);
			}
		}
	};

	my.WiringGesture.prototype.onRelease = function (info, e) {
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
			my.DrawCirc.showStub(info, p0);
			my.DrawCirc.showStub(info, p1);
			my.DrawCirc.attachWire(info, p0, p1);
			this.port0 = null;
			this.port1 = null;
			info.queueChange({type: 'wireDone'});
		} else {
			if (this.candPort1) {
				my.DrawCirc.showStub(info, this.candPort1);
				info.queueChange({type: 'wireFailed'});
			} else {
				info.queueChange({type: 'canceled'});
			}
		}
		if (this.line) {
			this.line.remove();
			this.line = null;
		}
		info.setGesture(null);
		info.hideError();
	};

	my.EraseGesture = function (info, e) {
		this.dragImg = $('<img></img>')
			.css('position', 'absolute')
			.attr('src', my.getResourcePath('eraser', ['svg', 'png']))
			.width(50);
		this.onDrag(info, e);
		info.canvas.append(this.dragImg);
		info.queueChange({type: 'eraseStart'});
	};

	my.EraseGesture.prototype.onDrag = function (info, e) {
		var ex, ey, elt, w;

		ex = e.circuitX;
		ey = e.circuitY;

		this.dragImg.css({left: ex - 0.3 * 50.0, top: ey - 50});

		elt = findElement(info.layout, ex, ey);
		if (elt !== null) {
			if (elt.isFrozen) {
				info.showError('err_remove_frozen');
				$(this.dragImg).stop().fadeTo(0, 0.5);
			} else {
				info.hideError();
				$(this.dragImg).stop().fadeTo(0, 1.0);
			}
		} else {
			w = my.Wire.find(info.layout, ex, ey, ERASER_CONNECT);
			if (w !== null) {
				info.hideError();
				$(this.dragImg).stop().fadeTo(0, 1.0);
			} else {
				info.hideError();
				$(this.dragImg).stop().fadeTo(0, 0.5);
			}
		}
	};

	my.EraseGesture.prototype.onRelease = function (info, e) {
		var x, y, wire, elt, ports;

		x = e.circuitX;
		y = e.circuitY;
		this.dragImg.remove();
		wire = my.Wire.find(info.layout, x, y, ERASER_CONNECT);
		if (wire !== null) {
			info.hideError();
			info.layout.removeWire(wire[0], wire[1]);
			my.DrawCirc.removeWire(info, wire[0], wire[1]);
			info.circuitChanged();
			my.DrawCirc.recolorPorts(info, wire[1]);
			info.queueChange({type: 'eraseWire'});
		} else {
			elt = findElement(info.layout, x, y);
			if (elt !== null) {
				if (elt.isFrozen) {
					info.showError('err_remove_frozen', [x, y]);
					info.queueChange({type: 'eraseFailed'});
				} else {
					info.hideError();
					ports = my.getConnectedPorts(elt);
					info.layout.removeElement(elt);
					my.DrawCirc.removeElement(info, elt);
					info.circuitChanged();
					$.each(ports, function (i, port) {
						my.DrawCirc.showStub(info, port);
						my.DrawCirc.recolorPort(info, port);
					});
					info.queueChange({type: 'eraseElement'});
				}
			} else {
				info.queueChange({type: 'canceled'});
			}
		}
		info.setGesture(null);
	};
}(Workshop, jQuery));
