$(document).ready(function () {
	var body, canv, paper, onDrag, onUp;

	body = $('body');
	canv = $('#canv');
	paper = Raphael("canv", canv.width(), canv.height());
	onDrag = null;
	onUp = null;

	function DrawLine(e) {
		e.preventDefault();
		this.pos0 = 'M' + e.pageX + ',' + e.pageY;
		this.path = paper.path(this.pos0);
	};

	DrawLine.prototype.onDrag = function (e) {
		var newpath;

		e.preventDefault();
		newpath = paper.path(this.pos0 + 'L' + e.pageX + ',' + e.pageY);
		newpath.attr({
			'stroke-dasharray': '-',
			'stroke-linecap': 'round',
			'stroke-width': 4,
		});
		this.path.remove();
		this.path = newpath;
	};

	multidrag.register(canv, DrawLine);
});
