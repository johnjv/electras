function transitionNext(src, dst) {
	var dist;
	src.css('z-index', 2);
	dst.css('z-index', 1);
	dst.css('top', 0);
	dst.show();
	dist = $('#clipboard').height();
	src.height(dist - 100);
	src.stop().animate({ top: -dist + 'px' }, 1000, function () {
		src.hide();
	});
}

function transitionPrev(src, dst) {
	var dist;
	src.css('z-index', 1);
	dst.css('z-index', 2);
	dist = $('#clipboard').height();
	dst.height(dist - 100);
	dst.css('top', -dist + 'px');
	dst.show();
	dst.stop().animate({ top: '0px' }, 1000, function () {
		src.hide();
	});
}

$(document).ready(function () {
	$('#clipboard').height($('body').height() - 200);
	$('.page').hide();
	$('#page1').show();

	$('#page1').click(function (e) {
		e.preventDefault();
		transitionNext($('#page1'), $('#page2'));
	});
	$('#page2').click(function (e) {
		e.preventDefault();
		transitionNext($('#page2'), $('#page3'));
	});
	$('#page3').click(function (e) {
		e.preventDefault();
		transitionPrev($('#page3'), $('#page1'));
	});
});
