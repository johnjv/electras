var Candy = (function ($) {
	"use strict";

	var my = function (type, levelSays, circuitSays) {
		this.type = type;
		this.picture = this.setCandyPicture();
		this.levelSays = levelSays;
		this.circuitSays = circuitSays;
		this.src = this.getPicSource();
	};

	my.prototype.getCandyType = function(){
		return this.type;
	};

	my.prototype.setCandyPicture = function(){
		return $(this.getPicSource());
	};

	my.prototype.getPicSource = function(){
		var candy, color, shape;
		candy = $.trim(this.type);
		color = 'CRGY'.indexOf(candy[0]);
		shape = 'o|-'.indexOf(candy[1]);
		return '<img src="../Floor/resource-image/candy' + color + shape +
			'.png" class="srcCandy"></img>';
	};

	my.prototype.checkCandy = function(){
		var value;
		if (this.circuitSays.accept === false) {
			if (this.levelSays) {
				value = 0;
			} else {
				value = -1;
			}
		} else {
			if (this.levelSays) {
				value = 1;
			} else {
				value = 2;
			}
		}
		return value;
	};

	return my;
}(jQuery));
