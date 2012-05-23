(function (my, $) {
	"use strict";

	my.stringify = function (layout) {
		var ret, ids, i, elt, cur, j, ci, co, k, sep;

		ids = {};
		for (i = layout.elts.length - 1; i >= 0; i -= 1) {
			elt = layout.elts[i];
			ids['i' + elt.id] = i;
		}

		ret = '';
		for (i = 0; i < layout.elts.length; i += 1) {
			elt = layout.elts[i];
			if (i == 0) {
				cur = '';
			} else {
				cur = ';';
			}
			cur += elt.type.id + elt.x + ',' + elt.y;
			sep = ':';
			for (j = 0; j < elt.conns.length; j += 1) {
				ci = elt.conns[j];
				if (ci.input) {
					if (ci.conns.length === 0) {
						cur += sep;
					} else {
						co = ci.conns[0];
						cur += sep + ids['i' + co.elt.id];
						k = $.inArray(co, co.elt.conns);
						if (k !== 0) {
							cur += '.' + k;
						}
					}
					sep = ',';
				}
			}
			ret += cur;
		}

		return ret;
	};

	my.parse = function (str, typeLookup) {
		var layout, i, j, k, descs, parts, reComp, comps, conns,
			comp, conn, part, comp1;
		layout = new my.Layout();
		descs = str.split(';');
		reComp = /^([^0-9]+)([0-9]+),([0-9]+)(:[0-9,.]*)?$/;
		comps = {};
		conns = {};
		for (i = 0; i < descs.length; i += 1) {
			parts = reComp.exec(descs[i]);
			if (parts === null) {
				console.log('component ' + i + ' "' + comps[i] //OK
					+ '" does not match regex');
				continue;
			}
			if (typeLookup.hasOwnProperty(parts[1])) {
				comp = new my.Element(typeLookup[parts[1]],
					parseInt(parts[2], 10), parseInt(parts[3], 10));
				layout.addElement(comp);
				comps[i] = comp;
			} else {
				console.log('unknown part ID "' + parts[1] + '"'); //OK
			}
			if (parts[4] && parts[4].length > 0) {
				conns[i] = parts[4];
			}
		}

		for (i in conns) {
			if (conns.hasOwnProperty(i) && i in comps) {
				comp = comps[i];
				parts = conns[i].split(',');
				k = 0;
				for (j = 0; j < comp.conns.length; j += 1) {
					conn = comp.conns[j];
					if (conn.input) {
						if (k === 0) {
							part = parts[k].substring(1);
						} else {
							part = parts[k];
						}
						k += 1;
						if (part.length > 0) {
							comp1 = comps[parseInt(part, 10)];
							if (comp1) {
								layout.addWire(conn, comp1.conns[0]);
							}
						}
					}
				}
			}
		}
		return layout;
	};
}(Workshop, jQuery));
