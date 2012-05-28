var raphwrap = (function (Raphael, $) {
	"use strict";

	var RaphWrap, SVGxml;

	SVGxml = "http://www.w3.org/TR/SVG11/feature#BasicStructure";

	function setAttrs(elt, attrs) {
		var key, k;
		for (key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				if (key === 'strokeWidth') {
					k = 'stroke-width';
				} else {
					k = key;
				}
				elt.attr(k, attrs[key]);
			}
		}
		return elt;
	}

	RaphWrap = function (id, width, height) {
		var hasSvg;
		hasSvg = window.SVGAngle ||
			document.implementation.hasFeature(SVGxml, "1.1");
		if (hasSvg) {
			this.paper = Raphael(id, width, height);
		} else {
			console.log("no svg support!!");
			this.paper = null;
		}
	}

	RaphWrap.prototype.path = function (points, attrs) {
		var path, i;

		path = 'M' + points[0][0] + ',' + points[0][1];
		for (i = 1; i < points.length; i += 1) {
			path += 'L' + points[i][0] + ',' + points[i][1];
		}
		return setAttrs(this.paper.path(path), attrs);
	};

	RaphWrap.prototype.circle = function (x, y, r, attrs) {
		return setAttrs(this.paper.circle(x, y, r), attrs);
	};

	RaphWrap.prototype.setSize = function (width, height) {
		this.paper.setSize(width, height);
	};

	return function (jqElt, width, height) {
		return new RaphWrap(jqElt, width, height);
	}
}(Raphael, jQuery));
