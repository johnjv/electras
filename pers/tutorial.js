highlighted = true;

function hideHighlighter(){
	"use strict";
	$('#hgt').click(function(){
		highlighted = false;
	});
}

function blink(interval){
    var timer = window.setInterval(function(){
        $("img").css("opacity", "0");
        window.setTimeout(function(){
        if(highlighted){
            $("img#highlighter").css("opacity", "1");
          }
        }, 1000);
    }, interval);
}

function highlightSection(x, y, width, height, isCircular){
	if(isCircular){
		var circHighlighter = $('<img src = "circ_highlighter.svg" id = "highlighter"></img>');
		circHighlighter.width(width);
		circHighlighter.height(height);
		circHighlighter.offset({left: x, top: y});
		var body = $('body');
		body.append(circHighlighter);
	}else{
		var circHighlighter = $('<img src = "rect_highlighter.png" id = "highlighter"></img>');
		circHighlighter.width(width);
		circHighlighter.height(height);
		circHighlighter.offset({left: x, top: y});
		var body = $('body');
		body.append(circHighlighter);
	}
	blink(3000, 2000);
}

$(document).ready(function (){
	hideHighlighter();
	highlightSection(800, 900, 100, 150, true);
	var text = 'This is the start of the our speech (or tip) bubbles that will be used by starters if they are willing to';
	var target = $('#highlighter');
	placeBubble(target, text);
});

function createSpeechBubble(target, text){
	"use strict";
	var bubbleContainer = $('<div id = "container"></div>');
	$('body').append(bubbleContainer);
	bubbleContainer.text(text);
	bubbleContainer .offset({left: target.offset().left + target.outerHeight(), top: target.offset().top + target.outerHeight()});
	bubbleContainer.css("opacity", 0);
}

function isOffBounds(target, text){  //return false if any part of text falls below the screen/ true otherwise
	createSpeechBubble(target, text);
	var y = target.offset().top + target.outerHeight() + $('#container').outerHeight();
	if(y > $(document).height()){
		return true;
	}
	return false;
}
function placeBubble(target, text){
	if(isOffBounds(target, text)){
		var y = target.offset().top - $('#container').outerHeight();
		$('div#container').remove();
		var bubbleContainer = $('<div id = "container"></div>');
			$('body').append(bubbleContainer);
			bubbleContainer.text(text);
			bubbleContainer .offset({left: target.offset().left + target.outerWidth(), top: y});
	}else{
		var y = target.offset().top + target.outerHeight();
		createSpeechBubble(target, text);	
	}
	$('div#container').css('opacity', 1);
}
