var FactoryFloor = (function ($) {
	"use strict";

	function createImages() {
		var imageData = [
			['floorbase', 0, 0, 2048, 1365.33],
			['punchglove', 1480, 688, 180, 474.969],
			['punchbox', 1420, 879, 387, 313.738],
			['producer', 1879, 450, 170, 361.5],
			['light1', 1420 + 230, 879 + 218, 60, 60]
		];
		$.each(imageData, function (i, data) {
			var src, elt;
			src = imgpath.get('resource/floor/' + data[0], ['svg', 'png']);
			elt = $('<img></img>')
				.attr('src', src)
				.attr('id', data[0])
				.css({left: data[1], top: 1365.33 - data[2] - data[4],
					width: data[3]});
			if (data[0] === 'light1') {
				elt.css('display', 'none');
			}
			$('#factory').append(elt);
		});
	}

	var curAnimation = null;

	function doPause() {
	}

	function doPlay() {
		var cur = curAnimation;
		if (cur) {
			cur.remove();
		}
		curAnimation = new FloorAnimation();
	}

	var buttonLocations = [
		[doPlay, 1776.20, 8.5, 267.32, 187.7],
		[doPause, 1820.2, 218.3, 159.3, 159.3]
	];

	var ClickHandler = function (e) {
		e.preventDefault();
		this.enabled = true;
		if (Clipboard.isInClipboardTip(e.pageX, e.pageY)) {
			this.enabled = false;
			Clipboard.setVisible(true);
		}
	};

	ClickHandler.prototype.onRelease = function (e) {
		var par, poffs, r, x, y;
		console.log('ClickHandler', e.pageX, e.pageY);
		if (e.isTap && this.enabled) {
			par = $('#main_container');
			poffs = par.offset();
			r = 2048.0 / par.width();
			x = (e.pageX - poffs.left) * r;
			y = 1365.33 - (e.pageY - poffs.top) * r;
			console.log('ClickHandler 2', x, y);
			$.each(buttonLocations, function (i, data) {
				if (x >= data[1] && y >= data[2] && x < data[1] + data[3] &&
						y < data[2] + data[4]) {
					$('#tip').hide();
					data[0]();
				}
			});
		}
	};

	function showMessage(mess){
		mess.show();
		mess.fadeOut(20000, function(){
			mess.hide();
		});
	}

	var initialized = false;

	function ensureInitialized() {
		if (!initialized) {
			initialized = true;
			createImages();

			$("#tally").hide();
			$("#success").hide();
			$("#failure").hide();

			multidrag.register($('#factory'), ClickHandler);
		}
	}

	function updateLevel(oldLevel, newLevel) {
		if (newLevel === null) {
			$('#factory').hide();
		} else {
			ensureInitialized();
			$("#tally").hide();
			$("#success").hide();
			$("#failure").hide();
			$('#factory').show();
			$('#factoryParent').show();
		}
	};

	$(document).ready(function () {
		LevelSelector.addListener(updateLevel);
	});  

	var my = {}; 

	my.windowResized = function (w, time) {
		var x, y;
		x = -(2048 - w) / 2;
		y = x / 1.5;
		$('#factoryParent').stop().animate({ width: w, height: w / 1.5 }, time);
		$('#factory').stop().animate({ left: x, top: y,
			transform: 'scale(' + (w / 2048)  + ')' }, time);
	}; 

	my.getHandler = function (e) {
		return new ClickHandler(e);
	};

	return my;              
}(jQuery));
