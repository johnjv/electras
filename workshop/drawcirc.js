(function (my, $) {
	"use strict";
	var WIRE_WIDTH = 3,
		CONNECT_RADIUS = 3,
		baseDirectory;

	my.getResourcePath = function (base, extensions) {
		return imgpath.get('resource/workshop/' + base, extensions);
	};

	function setterImage(elt) {
		return function (imgName) {
			var newName = my.getResourcePath(imgName, ['svg', 'png']);
			if (elt.imgElt.attr('src') !== newName) {
				elt.imgElt.attr('src', newName);
			}
		};
	}

	function getColor(val) {
		if (typeof val === 'undefined') {
			return 'black';
		} else if (val) {
			return '#0A0';
		} else {
			return '#030';
		}
	}

	my.DrawCirc = {};

	my.DrawCirc.createElement = function (info, elt) {
		var type, img;

		if (elt.imgElt) {
			elt.imgElt.remove();
		}

		type = elt.type;
		img = $('<img></img>').addClass('on_canvas');
		elt.imgElt = img;
		elt.setImage = setterImage(elt);
		elt.setImage(type.imgName);
		img.width(type.imgWidth);
		img.height(type.imgHeight);
		info.canvas.append(img);
		img.css({left: elt.x + elt.type.imgX, top: elt.y + elt.type.imgY});

		$.each(elt.ports, function (i, port) {
			my.DrawCirc.attachStub(info, port);
		});
	};

	my.DrawCirc.removeElement = function (info, elt) {
		$.each(elt.ports, function (i, port) {
			var j;
			if (port.circ !== null) {
				port.circ.remove();
			}
			if (port.stub !== null) {
				port.stub.remove();
			}
			if (port.line !== null) {
				port.line.remove();
			}
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				if (port.ports[j].line !== null) {
					port.ports[j].line.remove();
					port.ports[j].line = null;
					my.DrawCirc.showStub(info, port.ports[j]);
				}
			}
		});
		elt.imgElt.remove();
	};

	my.DrawCirc.repositionElement = function (info, elt) {
		var type, x, y;

		type = elt.type;
		x = elt.x + elt.type.imgX;
		y = elt.y + elt.type.imgY;
		elt.imgElt.css({left: x, top: y});

		$.each(elt.ports, function (i, port) {
			var j;
			my.DrawCirc.attachStub(info, port);
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.attachWire(info, port, port.ports[j]);
			}
		});
	};

	my.DrawCirc.createStubCircle = function (info, port, dx, dy) {
		var color, x0, y0, circ;

		color = getColor(info.state && info.state.getValue(port));
		x0 = port.elt.x + port.x;
		y0 = port.elt.y + port.y;
		if (typeof dx !== 'undefined') {
			x0 += dx;
		}
		if (typeof dy !== 'undefined') {
			y0 += dy;
		}
		if (port.input) {
			circ = info.paper.circle(x0, y0, CONNECT_RADIUS,
				{ stroke: color });
		} else {
			circ = info.paper.circle(x0, y0, CONNECT_RADIUS,
				{ stroke: color, fill: color });
		}
		return circ;
	};

	my.DrawCirc.createStub = function (info, port, dx, dy) {
		var color, x0, y0, x1, y1, circ, stub;

		color = getColor(info.state && info.state.getValue(port));
		x0 = port.elt.x + port.x;
		y0 = port.elt.y + port.y;
		if (typeof dx !== 'undefined') {
			x0 += dx;
		}
		if (typeof dy !== 'undefined') {
			y0 += dy;
		}
		x1 = x0 + port.dx;
		y1 = y0 + port.dy;
		if (x1 > x0) {
			x0 += CONNECT_RADIUS;
		} else if (x1 < x0) {
			x0 -= CONNECT_RADIUS;
		}
		if (y1 > y0) {
			y0 += CONNECT_RADIUS;
		} else if (y1 < y0) {
			y0 -= CONNECT_RADIUS;
		}
		stub = info.paper.path([[x0, y0], [x1, y1]],
			{ stroke: color, strokeWidth: WIRE_WIDTH });

		circ = my.DrawCirc.createStubCircle(info, port, dx, dy);

		return {circ: circ, stub: stub};
	};

	my.DrawCirc.attachStub = function (info, port, dx, dy) {
		var elts;

		if (port.circ) {
			port.circ.remove();
		}
		if (port.stub) {
			port.stub.remove();
		}

		elts = my.DrawCirc.createStub(info, port, dx, dy);
		port.circ = elts.circ;
		port.stub = elts.stub;

		if (port.ports.length > 0) {
			port.stub.hide();
			if (port.input) {
				port.circ.hide();
			}
		}
	};

	my.DrawCirc.hideStub = function (info, port) {
		if (port) {
			port.stub.hide();
			if (port.input) {
				port.circ.hide();
			}
		}
	};

	my.DrawCirc.showStub = function (info, port) {
		if (port) {
			if (port.ports.length === 0) {
				port.stub.show();
				port.circ.show();
			} else {
				if (!port.input) {
					port.circ.show();
				}
			}
		}
	};

	my.DrawCirc.createWire = function (info, port0, port1, dx0, dy0) {
		var p0, p1, x0, y0, x1, y1, line;
		if (port0.input) {
			p0 = port1;
			p1 = port0;
		} else {
			p0 = port0;
			p1 = port1;
		}
		x0 = p0.elt.x + p0.x;
		y0 = p0.elt.y + p0.y;
		x1 = p1.elt.x + p1.x;
		y1 = p1.elt.y + p1.y;
		if (typeof dx0 !== 'undefined') {
			if (p0 === port0) {
				x0 += dx0;
				y0 += dy0;
			} else {
				x1 += dx0;
				y1 += dy0;
			}
		}
		line = info.paper.path([[x0 + p0.dx, y0 + p0.dy], [x0, y0],
			[x1, y1], [x1 + p1.dx, y1 + p1.dy]],
			{ stroke: getColor(info.state && info.state.getValue(p0)),
				strokeWidth: WIRE_WIDTH });
		return line;
	};

	my.DrawCirc.attachWire = function (info, port0, port1) {
		var line;
		if (port0.line) {
			port0.line.remove();
			port0.line = null;
		}
		if (port1.line) {
			port1.line.remove();
			port1.line = null;
		}
		line = my.DrawCirc.createWire(info, port0, port1, 0, 0);
		if (port0.input) {
			port0.line = line;
			port0.circ.hide();
		} else {
			port1.line = line;
			port1.circ.hide();
		}
		port0.stub.hide();
		port1.stub.hide();
		return line;
	};

	my.DrawCirc.removeWire = function (info, port0, port1) {
		if (port0.line !== null) {
			port0.line.remove();
			port0.line = null;
		}
		if (port1.line !== null) {
			port1.line.remove();
			port1.line = null;
		}
		my.DrawCirc.showStub(info, port0);
		my.DrawCirc.showStub(info, port1);
	};

	my.DrawCirc.hideWire = function (info, port0, port1) {
		if (port0.line !== null) {
			port0.line.hide();
		}
		if (port1.line !== null) {
			port1.line.hide();
		}
	};

	my.DrawCirc.showWire = function (info, port0, port1) {
		if (port0.line !== null) {
			port0.line.show();
		}
		if (port1.line !== null) {
			port1.line.show();
		}
	};

	my.DrawCirc.recolorPort = function (info, port) {
		var color;

		color = getColor(info.state && info.state.getValue(port));
		if (port.stub) {
			port.stub.attr('stroke', color);
		}
		if (port.circ) {
			port.circ.attr('stroke', color);
			if (!port.input) {
				port.circ.attr('fill', color);
			}
		}
		if (port.line) {
			port.stub.attr('stroke', color);
		}
		$.each(port.ports, function (i, p) {
			if (p.stub) {
				p.stub.attr('stroke', color);
			}
			if (p.circ) {
				p.circ.attr('stroke', color);
			}
			if (p.line) {
				p.line.attr('stroke', color);
			}
		});
	};

	my.DrawCirc.recolorPorts = function (info, elt) {
		$.each(elt.ports, function (i, port) {
			my.DrawCirc.recolorPort(info, port);
		});
	};

	my.DrawCirc.ghostWireToCoord = function (info, p0, x, y, opacity) {
		var x0, y0, col, line;
		x0 = p0.elt.x + p0.x;
		y0 = p0.elt.y + p0.y;
		col = getColor(info.state && info.state.getValue(p0));
		line = info.paper.path([[x0 + p0.dx, y0 + p0.dy], [x0, y0], [x, y]],
			{ stroke: col, opacity: opacity, strokeWidth: WIRE_WIDTH });
		return line;
	};

	my.DrawCirc.ghostWireToPort = function (info, p0, p1, opacity) {
		var x0, y0, x1, y1, color, line;
		x0 = p0.elt.x + p0.x;
		y0 = p0.elt.y + p0.y;
		x1 = p1.elt.x + p1.x;
		y1 = p1.elt.y + p1.y;
		if (p0.input) {
			color = getColor(info.state && info.state.getValue(p1));
		} else {
			color = getColor(info.state && info.state.getValue(p0));
		}
		line = info.paper.path([[x0 + p0.dx, y0 + p0.dy], [x0, y0],
			[x1, y1], [x1 + p1.dx, y1 + p1.dy]],
			{ stroke: color, opacity: opacity, strokeWidth: WIRE_WIDTH });
		return line;
	};
}(Workshop, jQuery));
