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

	// Clips a line segment into an axis-aligned box. If the
	// segment lies entirely outside the box, returns null.
	// If the segment intersects the box, returns an array of
	// four numbers giving endpoints of subsegment within box.
	my.Wire.clip = function (x, y, w, h, x0, y0, x1, y1) {
		// Liang-Barsky implementation largely taken from
		// http://www.skytopia.com/project/articles/compsci/clipping.html
		var dx, dy, tMin, tMax, edge, p, q, r;
		dx = x1 - x0;
		dy = y1 - y0;
		tMin = 0;
		tMax = 1;
		for (edge = 0; edge < 4; edge += 1) {
			if (edge < 2) {
				if (edge === 0) {
					p = -dx;
					q = x0 - x;
				} else { // edge === 1
					p = dx;
					q = (x + w) - x0;
				}
			} else {
				if (edge === 2) {
					p = -dy;
					q = y0 - y;
				} else { // edge === 3
					p = dy;
					q = (y + h) - y0;
				}
			}
			if (p === 0) {
				if (q < 0) {
					return null; // parallel line outside box
				}
			} else if (p < 0) {
				r = q / p;
				if (r > tMin) {
					tMin = r;
					if (tMin > tMax) {
						return null;
					}
				}
			} else { // p > 0
				r = q / p;
				if (r < tMax) {
					tMax = r;
					if (tMin > tMax) {
						return null;
					}
				}
			}
		}

		return [x0 + tMin * dx, y0 + tMin * dy,
			x0 + tMax * dx, y0 + tMax * dy];
	};

	my.Wire.midpoint = function (locs, y0, x1, y1) {
		if (locs.length && locs.length === 4) {
			return [(locs[0] + locs[2]) / 2, (locs[1] + locs[3]) / 2];
		} else {
			return [(locs + x1) / 2, (y0 + y1) / 2];
		}
	};

	my.Wire.find = function (layout, x, y, maxDist) {
		var bestD2, ret;
		bestD2 = maxDist * maxDist + 1;
		ret = null;
		layout.forEachWire(function (p0, p1) {
			var x0, y0, x1, y1, d2;
			x0 = p0.elt.x + p0.x;
			y0 = p0.elt.y + p0.y;
			x1 = p1.elt.x + p1.x;
			y1 = p1.elt.y + p1.y;
			d2 = my.Wire.dist2(x, y, x0, y0, x1, y1);
			if (d2 < bestD2) {
				bestD2 = d2;
				ret = [p1, p0];
			}
		});
		return ret;
	};
}(Workshop));
