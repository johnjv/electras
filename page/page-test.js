$(document).ready(function () {
	$('#clipboard').height($('body').height() - 200);
	$('.page').hide();
	transitionCut(null, $('#page1'));

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
