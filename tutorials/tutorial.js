
Tutorial = {};

(function(my, $){
	"use strict";
	var highlightId = 0;
	
	function blink(){
		"use strict";
		var curId = highlightId;
	    $(".highlight").each(function(){
	    		$(this).fadeOut(1000, function(){
	    			if(highlightId === curId){
	    				$(this).fadeIn(1600, function(){
	    					blink();
	    				});
	    			}
	    		});
	    	});	
	}
	
	my.highlightSections = function(parameters){
		"use strict";
		Tutorial.unhighlightSection();
		highlightId += 1;
		$.each(parameters, function(index, parameter){
			var highlightDiv = $('<div class = "highlight"></div>');
			var body = $('body');
			body.append(highlightDiv);
			highlightDiv.offset({left: parameter.x, top: parameter.y});
			highlightDiv.width(parameter.width);
			highlightDiv.height(parameter.height);
			var imageUrl;
			if(parameter.isCircular){
				imageUrl = ('../tutorials/circ_highlighter.png');
				highlightDiv.css('background-image', 'url(' + imageUrl + ')');
				highlightDiv.css('background-size', '100% 100%');
				highlightDiv.css('background-repeat' ,'no-repeat');
			}else{
				imageUrl = encodeURI('../tutorials/rect_highlighter.png');
				highlightDiv.css('background-image', 'url(' + imageUrl + ')');
				highlightDiv.css('background-size', '100%');
				highlightDiv.css('background-repeat' ,'no-repeat');
			}
			highlightDiv.on('click mousedown mouseup mousemove touchstart touchmove touchend', function(e){
				var elt, under;
				elt = $(e.target);
				elt.hide();
				under = document.elementFromPoint(e.pageX, e.pageY);
				elt.show();
				$(under).trigger(e);
			});
			blink(3000, 1000);
		});
	}
	

	/*highlight an element's section*/
	my.highlightSection = function(x, y, width, height, isCircular){
		"use strict";
		Tutorial.unhighlightSection();
		highlightId += 1;
		var highlightDiv = $('<div class = "highlight"></div>');
		var body = $('body');
		body.append(highlightDiv);
		highlightDiv.offset({left: x, top: y});
		highlightDiv.width(width);
		highlightDiv.height(height);
		var imageUrl;
		if(isCircular){
			imageUrl = ('../tutorials/circ_highlighter.png');
			highlightDiv.css('background-image', 'url(' + imageUrl + ')');
			highlightDiv.css('background-size', '100% 100%');
			highlightDiv.css('background-repeat' ,'no-repeat');
		}else{
			imageUrl = encodeURI('../tutorials/rect_highlighter.png');
			highlightDiv.css('background-image', 'url(' + imageUrl + ')');
			highlightDiv.css('background-size', '100%');
			highlightDiv.css('background-repeat' ,'no-repeat');
		}
		highlightDiv.on('click mousedown mouseup mousemove touchstart touchmove touchend', function(e){
			var elt, under;
			elt = $(e.target);
			elt.hide();
			under = document.elementFromPoint(e.pageX, e.pageY);
			elt.show();
			$(under).trigger(e);
		});
		blink(3000, 1000);
		
	}
	
	function registerDraggable(){
		var body, canv, paper, onDrag, onUp;

		body = $('body');
		canv = $('#container');
		onDrag = null;
		onUp = null;

		function MoveBubble(e) {
			e.preventDefault();
			this.offsetDiff = {diffX: e.pageX - canv.offset().left, diffY: e.pageY - canv.offset().top};
		};

		MoveBubble.prototype.onDrag = function (e) {
			var newX = e.pageX - this.offsetDiff.diffX;
			var newY = e.pageY - this.offsetDiff.diffY
			e.preventDefault();
			if(newX > 0 && newY > 0 && (newX + canv.outerWidth()) < (body.width()) && (newY + canv.outerHeight()) < body.height()){
				canv.offset({left: newX, top: newY});
				this.offsetDiff = {diffX: e.pageX - canv.offset().left, diffY: e.pageY - canv.offset().top};
			}
		};

		multidrag.register(canv, MoveBubble);
	}

	/*create temporary speech bubble*/
	function createSpeechBubble(target, text){
		"use strict";
		var bubbleContainer = $('<div id = "container"></div>');
		$('body').append(bubbleContainer);
		bubbleContainer.text(text);
		bubbleContainer.offset({left: target.x + target.r, top: target.y + target.r});
		bubbleContainer.css('opacity', '0');
	}

	/*if you need to remove the highlighter*/
	my.unhighlightSection = function(){
		highlightId += 1;	
		$('div.highlight').each(function(){
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
		var x = target.x + target.r;
		var y = target.y + target.r;
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
		//bubbleContainer.draggable({scroll: false, containment: $('body')});
		registerDraggable();
		$('div#container').css('opacity', '.8');
	}

  //var script_hash = {

  //}

  var call_script = function(script_name){
    try {
      $('#container').hide()
      eval(script_name + "_events()")
//      console.log("called ", script_name, "_events()")
    } catch (ReferenceError) {
//      console.log("tried but failed to call ", script_name, "_events().  ")//this is called if you cannot find _events()
//      console.log("The error:", ReferenceError)
    }
  }

  my.circuitChanged = function(){
    var script = LevelSelector.getCurrentLevel().script
    call_script(script)
  }
}(Tutorial, jQuery));
