var FloorTally = (function ($) {
	"use strict";

	function tallyEnsureCreated() {
		var tally, tbody, i, j, tr, td;
		tally = $('#tally');
		if (tally.size() === 0) {
			tbody = $('<tbody></tbody>');
			tally = $('<table></table>').attr('id', 'tally').append(tbody);
			for (i = 0; i < 3; i += 1) {
				tr = $('<tr></tr>');
				for (j = 0; j < 9; j += 1) {
					td = $('<td></td>');
					if (j === 0) {
						td.addClass('tallyHead');
					} else {
						td.addClass('tallyCell');
					}
					tr.append(td);
				}
				tbody.append(tr);
			}
			tally.hide();
			$('#factory').append(tally);
			tallySetHeaders(); // depends on tally being added into DOM
		}
		return tally;
	}

	function tallySetHeaders() {
		$('#tally tr:eq(1) td.tallyHead').text(
			Translator.getText('floor', 'tallyExpected'));
		$('#tally tr:eq(2) td.tallyHead').text(
			Translator.getText('floor', 'tallyActual'));
	}

	function getImgSrc(value, correct) {
		var filename;
		if (value) {
			filename = 'tallybox';
		} else {
			filename = 'tallycan';
		}
		if (!correct) {
			filename += 'x';
		}
		return imgpath.get('resource/floor/' + filename, ['svg', 'png']);
	}

	function tallySetCell(i, j, src) {
		var td, img;
		td = $('#tally tr:eq(' + i + ') td:eq(' + j + ')');
		img = $('img', td);
		if (img.size() > 0) {
			if (img.css('display') === 'none') {
				img.attr('src', src);
				img.fadeIn(200);
			} else {
				img.fadeOut(100, function () {
					img.attr('src', src);
					img.fadeIn(100);
				});
			}
		} else {
			img = $('<img></img>').attr('src', src).hide();
			td.append(img);
			img.fadeIn(200);
		}
	}

	var my = {};

	my.setCandy = function (i, candySrc) {
		tallySetCell(0, i + 1, candySrc);
	}

	my.setExpected = function (i, expect) {
		tallySetCell(1, i + 1, getImgSrc(expect, true));
	};

	my.setActual = function (i, actual, correct) {
		tallySetCell(2, i + 1, getImgSrc(actual, correct));
	};

	my.showCleared = function () {
		var tally = tallyEnsureCreated();
		$('img', tally).hide();
		tally.fadeIn(200);
	};

	$(document).ready(function () {
		Translator.addListener(tallySetHeaders);
	});

	return my;
}(jQuery));
