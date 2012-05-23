(function (my) {
	"use strict";

	my.Wire = {};

	my.Wire.dist2 = function (xq, yq, x0, y0, x1, y1) {
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
	};

	my.Wire.find = function (layout, x, y, maxDist) {
		var bestD2, ret;
		bestD2 = maxDist * maxDist + 1;
		ret = null;
		$.each(layout.elts, function (i, elt) {
			var j, k, p0, p1, x0, y0, x1, y1, d2;
			for (k = elt.ports.length - 1; k >= 0; k -= 1) {
				p0 = elt.ports[k];
				x0 = elt.x + p0.x;
				y0 = elt.y + p0.y;
				if (p0.input) {
					for (j = p0.ports.length - 1; j >= 0; j -= 1) {
						p1 = p0.ports[j];
						x1 = p1.elt.x + p1.x;
						y1 = p1.elt.y + p1.y;
						d2 = my.Wire.dist2ToSegment(x, y, x0, y0, x1, y1);
						if (d2 < bestD2) {
							bestD2 = d2;
							ret = [p1, p0];
						}
					}
				}
			}
		});
		return ret;
	};
}(Workshop));
