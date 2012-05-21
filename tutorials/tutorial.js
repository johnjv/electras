
Tutorial = {};

(function(my, $){
	"use strict";
	function blink(interval){
		"use strict";
		var timer = window.setInterval(function(){
		    $("img.highlighter").each(function(){
		    		$(this).css("opacity", "0");
		    	});
		    window.setTimeout(function(){
		    $("img.highlighter").each(function(){
		    		$(this).css("opacity", "1");
		    	});
		    }, 1000);
		}, interval);
	}

	/*highlight an element's section*/
	my.highlightSection = function(x, y, width, height, isCircular){
		"use strict";
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

	/*create temporary speech bubble*/
	function createSpeechBubble(target, text){
		"use strict";
		var bubbleContainer = $('<div id = "container"></div>');
		$('body').append(bubbleContainer);
		bubbleContainer.text(text);
		bubbleContainer .offset({left: target.x + target.width, top: target.y + target.height});
		bubbleContainer.css('opacity', '0');
	}

	/*if you need to remove the highlighter*/
	my.unhighlightSection = function(){
		$('img.highlighter').each(function(){
		$(this).remove();
		});
		$('div#container').remove();
	}
	/*add speech bubble*/
	my.placeBubble = function(target, text){
		"use strict";
		if($('#container').length > 0){
			$('#container').each(function(){
				$(this).remove();	
			});
		}
		createSpeechBubble(target, text);
		var bubbleContainer = $('div#container');
		var x = target.x + target.width;
		var y = target.y + target.height;
		var otherY = target.y - bubbleContainer.height();
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
}(Tutorial, jQuery));
