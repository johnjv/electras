
function blink(interval){
    var timer = window.setInterval(function(){
        $("img.highlighter").css("opacity", "0");
        window.setTimeout(function(){
        $("img.highlighter").css("opacity", "1");
        }, 1000);
    }, interval);
}

/*highlight an element's section*/
function highlightSection(x, y, width, height, isCircular){
	if(isCircular){
		var circHighlighter = $('<img src = "circ_highlighter.svg" class = "highlighter"></img>');
		circHighlighter.width(width);
		circHighlighter.height(height);
		circHighlighter.offset({left: x, top: y});
		var body = $('body');
		body.append(circHighlighter);
	}else{
		var circHighlighter = $('<img src = "rect_highlighter.png" class = "highlighter"></img>');
		circHighlighter.width(width);
		circHighlighter.height(height);
		circHighlighter.offset({left: x, top: y});
		var body = $('body');
		body.append(circHighlighter);
	}
	blink(3000, 1000);
}

/**********************************TEST BEGIN**************************************/
$(document).ready(function (){
	highlightSection(50, 100, 100, 150, true);
	highlightSection(100,70, 50, 80, false);
	var text = 'Le bonheur est dans le pré. Cours-y vite;, cours-y vite. Le bonheur est dans le pré. Cours-y vite. Il va filer. Si tu veux le rattraper, cours-y vite, cours-y vite. Si tu veuxle rattraper, cours-y vite. Il va filer. Dans l’ache et le serpolet, cours-y vite, cours-y vite, dans l’ache et le serpolet, cours-y vite. Il va filer. Sur les cornes du bélier, cours-y vite, cours-y vite, sur les cornes du bélier, cours-y vite. Il va filer';
	$('img.highlighter').each(function(){
		placeBubble($(this), text);
	});
	$('#hgt').click(function(){
		unhighlightSection();
	});
});

/**********************************TEST END**************************************/

/*create temporary speech bubble*/
function createSpeechBubble(target, text){
	"use strict";
	var bubbleContainer = $('<div id = "container"></div>');
	$('body').append(bubbleContainer);
	bubbleContainer.text(text);
	bubbleContainer .offset({left: target.offset().left + target.width(), top: target.offset().top + target.height()});
	bubbleContainer.css('opacity', '0');
}

/*if you need to remove the highlighter*/
function unhighlightSection(){
	$('img.highlighter').each(function(){
	$(this).remove();
	});
	$('div#container').remove();
}
/*add speech bubble*/
function placeBubble(target, text){
	if($('#container').length > 0){
		$('#container').each(function(){
			$(this).remove();	
		});
	}
	createSpeechBubble(target, text);
	var bubbleContainer = $('div#container');
	var x = target.offset().left + target.width();
	var y = target.offset().top + target.height();
	var otherY = target.offset().top - bubbleContainer.height();
	var removed = false;
	if((x + bubbleContainer.width()) > $(document).width()){
		x = target.offset().left - bubbleContainer.width();
		removed = true;
		bubbleContainer.remove();
	}
	if((y + bubbleContainer.height()) > $(document).height()){
		y = otherY;
		if(!removed){
			bubbleContainer.remove();
			removed = true;
		}
	}
	if(removed){
	bubbleContainer = $('<div id = "container"></div>');
	$('body').append(bubbleContainer);
		bubbleContainer.text(text);
		bubbleContainer.offset({left: x, top: y});
	}
	bubbleContainer.draggable();
	$('div#container').css('opacity', '.8');
}
