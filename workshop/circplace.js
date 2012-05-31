var Circuit = (function ($, Workshop) {
	"use strict";

	var my = {},
		colorNames = 'CRGY',
		shapeNames = 'o|-',
		colorSensors = [],
		shapeSensors = [];

	my.elementMap = {};

	(function () {
		var ports, i, c, sensor;

		function propagateSensor(elt, state) {
			state.setValue(elt.ports[0], state.getState(elt));
		}

		ports = [ new Workshop.Port(false, 0, 0, -10, 0) ];
		for (i = 0; i < colorNames.length; i += 1) {
			c = colorNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'color' + i,
				-60, -25, 50, 50, ports, propagateSensor);
			sensor.isSensor = true;
			colorSensors.push(sensor);
			my.elementMap[c] = sensor;
		}
		for (i = 0; i < shapeNames.length; i += 1) {
			c = shapeNames.substring(i, i + 1);
			sensor = new Workshop.ElementType(c, 'shape' + i,
				-60, -25, 50, 50, ports, propagateSensor);
			sensor.isSensor = true;
			shapeSensors.push(sensor);
			my.elementMap[c] = sensor;
		}

		$.each(['in', 'out', 'and', 'or', 'not'], function (i, key) {
			var val = Workshop.getElementType(key);
			if (val) {
				my.elementMap[key] = val;
			}
		});
	}());

	function getSensor(c) {
		var j;
		j = colorNames.indexOf(c);
		if (j >= 0) {
			return colorSensors[j];
		} else {
			j = shapeNames.indexOf(c);
			if (j >= 0) {
				return shapeSensors[j];
			} else if (c !== ' ') {
				console.log('invalid sensor name "' + c + '"'); //OK
				return null;
			} else {
				return null;
			}
		}
	}

	my.computeLayout = function (sensorsString, link, width, height) {
		var layout, outT, outElt, i, c, type, sensor;

		layout = new Workshop.Layout();

		outT = Workshop.getElementType('out');
		outElt = new Workshop.Element(outT, 100, 50);
		outElt.isFrozen = true;
		layout.addElement(outElt);

		for (i = 0; i < sensorsString.length; i += 1) {
			c = sensorsString.substring(i, i + 1);
			type = getSensor(c);
			if (type !== null) {
				sensor = new Workshop.Element(type, 70, i * 60 + 30);
				sensor.isFrozen = true;
				layout.addElement(sensor);
				
				if (c === link) {
					layout.addWire(sensor.ports[0], outElt.ports[0]);
				}
			}
		}

		my.autoplace(layout, width, height);

		return layout;
	};

	function placeEltsVertically(elts, x, height) {
		var totalHeight, i, elt, gap, y;
		
		totalHeight = 0;
		for (i = 0; i < elts.length; i += 1) {
			elt = elts[i];
			totalHeight += elt.type.imgHeight;
		}
		gap = 1.0 * (height - totalHeight) / (elts.length + 1);
		if (gap < 10) {
			gap = 10;
		}

		y = gap;
		for (i = 0; i < elts.length; i += 1) {
			elt = elts[i];
			elt.x = x - (elt.type.imgX + elt.type.imgWidth / 2);
			elt.y = Math.round(y + elt.type.imgHeight / 2);
			y += elt.type.imgHeight + gap;
		}
	}

	function updateLeafCountMaybe(node) {
		var children, height, leafCount, leafWeight,
			j, child;
		children = node.children;
		height = 0;
		leafCount = 0;
		leafWeight = 0;
		for (j = children.length - 1; j >= 0; j -= 1) {
			child = children[j];
			if (child.hasOwnProperty('leafCount')) {
				leafCount += child.leafCount;
				leafWeight += child.leafWeight;
				if (child.height + 1 > height) {
					height = child.height + 1;
				}
			} else {
				return false; // Some children are missing - don't update
			}
		}

		node.leafCount = leafCount;
		node.leafWeight = leafWeight;
		if (leafCount > 0) {
			node.leafMean = leafWeight / leafCount;
		} else {
			node.leafMean = 0;
		}
		node.height = height;
		return true;
	}

	function autoplaceOthers(allElts, inElts, outElts) {
		var nodes, x0, x1, y0, y1, levels, found, maxHeight, id, node,
			levNum, level, i, x, levelElts;

		nodes = {};
		$.each(allElts, function (i, elt) {
			nodes[elt.id] = {id: elt.id, elt: elt};
		});

		$.each(nodes, function (i, node) {
			var elt, children, j, port, k;
			elt = node.elt;
			children = [];
			for (j = elt.ports.length - 1; j >= 0; j -= 1) {
				port = elt.ports[j];
				if (port.input) {
					for (k = port.ports.length - 1; k >= 0; k -= 1) {
						children.push(nodes[port.ports[k].elt.id]);
					}
				}
			}
			node.children = children;
		});

		y0 = 1e6;
		y1 = -1e6;
		x0 = 1e6;
		x1 = -1e6;
		$.each(inElts, function (i, elt) {
			var node, x, y;
			x = elt.x;
			y = elt.y;
			node = nodes[elt.id];
			node.leafCount = 1;
			node.leafWeight = y;
			node.height = 0;
			if (y < y0) { y0 = y; }
			if (y > y1) { y1 = y; }
			if (x < x0) { x0 = x; }
			if (x > x1) { x1 = x; }
		});
		$.each(outElts, function (i, elt) {
			var node, x, y;
			x = elt.x;
			y = elt.y;
			node = nodes[elt.id];
			node.leafCount = 1;
			if (y < y0) { y0 = y; }
			if (y > y1) { y1 = y; }
			if (x < x0) { x0 = x; }
			if (x > x1) { x1 = x; }
		});

		levels = {};

		found = true;
		maxHeight = 0;
		while (found) {
			found = false;
			for (id in nodes) {
				if (nodes.hasOwnProperty(id)) {
					node = nodes[id];
					if (!node.hasOwnProperty('leafCount')) {
						if (updateLeafCountMaybe(node)) {
							found = true;
							if (!levels.hasOwnProperty(node.height)) {
								levels[node.height] = [node];
							} else {
								levels[node.height].push(node);
							}
							if (node.height > maxHeight) {
								maxHeight = node.height;
							}
						}
					}
				}
			}
		}

		function compareMeans(a, b) {
			return a.leafMean - b.leafMean;
		}

		for (levNum = 1; levels.hasOwnProperty(levNum); levNum += 1) {
			level = levels[levNum];
			level.sort(compareMeans);
			x = x0 + (x1 - x0) * levNum / (maxHeight + 1);
			levelElts = [];
			for (i = 0; i < level.length; i += 1) {
				levelElts.push(level[i].elt);
			}
			placeEltsVertically(levelElts, x, y1 + y0);
		}
	}

	my.autoplace = function (layout, width, height) {
		var outT, inElts, outElts;

		outT = Workshop.getElementType('out');
		inElts = [];
		outElts = [];
		$.each(layout.elts, function (i, elt) {
			if (elt.type === outT) {
				outElts.push(elt);
			} else if (elt.type.isSensor) {
				inElts.push(elt);
			}
		});

		placeEltsVertically(inElts, 10 + colorSensors[0].imgWidth / 2, height);
		placeEltsVertically(outElts, width - 10 - outT.imgWidth / 2, height);
		autoplaceOthers(layout.elts, inElts, outElts);
	};

	return my;
}(jQuery, Workshop));
