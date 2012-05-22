(function (my, $) {
	"use strict";
	var WIRE_WIDTH = 3,
		CONNECT_RADIUS = 3,
		baseDirectory;

	my.getRelativePath = function (desired) {
		var cwd, cdirs, ddirs, i, j, ret;
		if (!self || !self.location || !self.location.href) {
			return '';
		}
		cwd = self.location.href;
		i = cwd.indexOf('electras/');
		if (i >= 0) {
			cwd = cwd.substring(i + 'electras/'.length);
		}
		cdirs = cwd.split('/');
		ddirs = desired.split('/');
		j = 0;
		while (j < cdirs.length && j < ddirs.length && cdirs[j] === ddirs[j]) {
			j += 1;
		}
		ret = '';
		for (i = j; i < cdirs.length - 1; i += 1) {
			ret += '../';
		}
		for (i = j; i < ddirs.length; i += 1) {
			ret += ddirs[i] + '/';
		}
		return ret;
	};

	baseDirectory = my.getRelativePath('workshop/resource');

	my.getResourcePath = function (filename) {
		return baseDirectory + filename;
	};

	function setterImage(elt) {
		return function (imgName) {
			var newName = my.getResourcePath(imgName + '.png');
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
		var type, img, offs0;

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
		offs0 = info.canvas.offset();
		img.offset({ left: offs0.left + elt.x + elt.type.imgX,
			top: offs0.top + elt.y + elt.type.imgY });

		$.each(elt.conns, function (i, conn) {
			my.DrawCirc.attachStub(info, conn);
		});
	};

	my.DrawCirc.removeElement = function (info, elt) {
		$.each(elt.conns, function (i, conn) {
			var j;
			if (conn.circ !== null) {
				conn.circ.remove();
			}
			if (conn.stub !== null) {
				conn.stub.remove();
			}
			if (conn.line !== null) {
				conn.line.remove();
			}
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				if (conn.conns[j].line !== null) {
					conn.conns[j].line.remove();
					conn.conns[j].line = null;
					my.DrawCirc.showStub(info, conn.conns[j]);
				}
			}
		});
		elt.imgElt.remove();
	};

	my.DrawCirc.repositionElement = function (info, elt) {
		var type, offs0, x, y, img;

		type = elt.type;
		offs0 = info.canvas.offset();
		x = offs0.left + elt.x + elt.type.imgX;
		y = offs0.top + elt.y + elt.type.imgY;
		elt.imgElt.offset({left: x, top: y});

		$.each(elt.conns, function (i, conn) {
			var j;
			my.DrawCirc.attachStub(info, conn);
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				my.DrawCirc.attachWire(info, conn, conn.conns[j]);
			}
		});
	};

	my.DrawCirc.createStubCircle = function (info, conn, dx, dy) {
		var color, x0, y0, circ;

		color = getColor(info.state && info.state.getValue(conn));
		x0 = conn.elt.x + conn.x;
		y0 = conn.elt.y + conn.y;
		if (typeof dx !== 'undefined') {
			x0 += dx;
		}
		if (typeof dy !== 'undefined') {
			y0 += dy;
		}
		if (conn.input) {
			circ = info.paper.circle(x0, y0, CONNECT_RADIUS);
		} else {
			circ = info.paper.circle(x0, y0, CONNECT_RADIUS);
			circ.attr('fill', color);
		}
		circ.attr('stroke', color);
		return circ;
	};

	my.DrawCirc.createStub = function (info, conn, dx, dy) {
		var color, x0, y0, x1, y1, circ, stub;

		color = getColor(info.state && info.state.getValue(conn));
		x0 = conn.elt.x + conn.x;
		y0 = conn.elt.y + conn.y;
		if (typeof dx !== 'undefined') {
			x0 += dx;
		}
		if (typeof dy !== 'undefined') {
			y0 += dy;
		}
		x1 = x0 + conn.dx;
		y1 = y0 + conn.dy;
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
		stub = info.paper.path('M' + x0 + ',' + y0
			+ 'L' + x1 + ',' + y1);
		stub.attr('stroke-width', WIRE_WIDTH);
		stub.attr('stroke', color);

		circ = my.DrawCirc.createStubCircle(info, conn, dx, dy);

		return {circ: circ, stub: stub};
	};

	my.DrawCirc.attachStub = function (info, conn, dx, dy) {
		var elts;

		if (conn.circ) {
			conn.circ.remove();
		}
		if (conn.stub) {
			conn.stub.remove();
		}

		elts = my.DrawCirc.createStub(info, conn, dx, dy);
		conn.circ = elts.circ;
		conn.stub = elts.stub;

		if (conn.conns.length > 0) {
			conn.stub.hide();
			if (conn.input) {
				conn.circ.hide();
			}
		}
	};

	my.DrawCirc.hideStub = function (info, conn) {
		if (conn) {
			conn.stub.hide();
			conn.circ.hide();
		}
	};

	my.DrawCirc.showStub = function (info, conn) {
		if (conn) {
			if (conn.conns.length === 0) {
				conn.stub.show();
				conn.circ.show();
			} else if (!conn.input) {
				conn.circ.show();
			}
		}
	};

	my.DrawCirc.createWire = function (info, conn0, conn1, dx0, dy0) {
		var c0, c1, x0, y0, x1, y1, line;
		if (conn0.input) {
			c0 = conn1;
			c1 = conn0;
		} else {
			c0 = conn0;
			c1 = conn1;
		}
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		x1 = c1.elt.x + c1.x;
		y1 = c1.elt.y + c1.y;
		if (typeof dx0 !== 'undefined') {
			if (c0 === conn0) {
				x0 += dx0;
				y0 += dy0;
			} else {
				x1 += dx0;
				y1 += dy0;
			}
		}
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x1 + ',' + y1 +
			'L' + (x1 + c1.dx) + ',' + (y1 + c1.dy));
		line.attr('stroke', getColor(info.state && info.state.getValue(c0)));
		line.attr('stroke-width', WIRE_WIDTH);
		line.attr('stroke-linecap', 'round');
		return line;
	}

	my.DrawCirc.attachWire = function (info, conn0, conn1) {
		var line;
		if (conn0.line) {
			conn0.line.remove();
			conn0.line = null;
		}
		if (conn1.line) {
			conn1.line.remove();
			conn1.line = null;
		}
		line = my.DrawCirc.createWire(info, conn0, conn1, 0, 0);
		if (conn0.input) {
			conn0.line = line;
		} else {
			conn1.line = line;
		}
		return line;
	};

	my.DrawCirc.removeWire = function (info, conn0, conn1) {
		if (conn0.line !== null) {
			conn0.line.remove();
			conn0.line = null;
		}
		if (conn1.line !== null) {
			conn1.line.remove();
			conn1.line = null;
		}
		my.DrawCirc.showStub(info, conn0);
		my.DrawCirc.showStub(info, conn1);
	};

	my.DrawCirc.hideWire = function (info, conn0, conn1) {
		if (conn0.line !== null) {
			conn0.line.hide();
		}
		if (conn1.line !== null) {
			conn1.line.hide();
		}
	};

	my.DrawCirc.showWire = function (info, conn0, conn1) {
		if (conn0.line !== null) {
			conn0.line.show();
		}
		if (conn1.line !== null) {
			conn1.line.show();
		}
	};

	my.DrawCirc.recolorConnection = function (info, conn) {
		var color;

		color = getColor(info.state && info.state.getValue(conn));
		if (conn.stub) {
			conn.stub.attr('stroke', color);
		}
		if (conn.circ) {
			conn.circ.attr('stroke', color);
			if (!conn.input) {
				conn.circ.attr('fill', color);
			}
		}
		if (conn.line) {
			conn.stub.attr('stroke', color);
		}
		$.each(conn.conns, function (i, c) {
			if (c.stub) {
				c.stub.attr('stroke', color);
			}
			if (c.circ) {
				c.circ.attr('stroke', color);
			}
			if (c.line) {
				c.line.attr('stroke', color);
			}
		});
	};

	my.DrawCirc.ghostWireToCoord = function (info, c0, x, y) {
		var x0, y0, color, line;
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		color = getColor(info.state && info.state.getValue(c0));
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x + ',' + y);
		line.attr('stroke', color);
		line.attr('opacity', 0.3);
		line.attr('stroke-width', WIRE_WIDTH);
		return line;
	};

	my.DrawCirc.ghostWireToConn = function (info, c0, c1) {
		var x0, y0, x1, y1, color, line;
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		x1 = c1.elt.x + c1.x;
		y1 = c1.elt.y + c1.y;
		if (c0.input) {
			color = getColor(info.state && info.state.getValue(c1));
		} else {
			color = getColor(info.state && info.state.getValue(c0));
		}
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x1 + ',' + y1 +
			'L' + (x1 + c1.dx) + ',' + (y1 + c1.dy));
		line.attr('stroke', color);
		line.attr('opacity', 0.6);
		line.attr('stroke-width', WIRE_WIDTH);
		return line;
	};
}(Workshop, jQuery));
