var imgpath = (function () {
	"use strict";

	var hasSvg = (function () {
		var SVGxml = "http://www.w3.org/TR/SVG11/feature#BasicStructure";
		return window.SVGAngle ||
			document.implementation.hasFeature(SVGxml, "1.1");
	}());

	var basePath = (function () {
		var browser, cwd, cdirs, ret, i;
		browser = self;
		if (!browser || !browser.location || !browser.location.href) {
			return '';
		}
		cwd = browser.location.href;
		i = cwd.indexOf('electras/');
		if (i < 0) {
			return cwd;
		}

		cwd = cwd.substring(i + 'electras/'.length);
		cdirs = cwd.split('/');
		ret = '';
		for (i = 0; i < cdirs.length - 1; i += 1) {
			ret += '../';
		}
		return ret;
	}());

	var my = {};

	my.get = function (baseName, extensions) {
		var i;
		for (i = 0; i < extensions.length; i += 1) {
			if (extensions[i] === 'svg') {
				if (hasSvg) {
					return basePath + baseName + '.svg';
				}
			} else {
				return basePath + baseName + '.' + extensions[i];
			}
		}
	};

	return my;
}());
