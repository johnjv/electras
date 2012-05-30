
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
			var body = $('#circuit');
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
		console.log("highlight");
	}
	

	/*highlight an element's section*/
	my.highlightSection = function(x, y, width, height, isCircular){
		"use strict";
		Tutorial.unhighlightSection();
		highlightId += 1;
		var highlightDiv = $('<div class = "highlight"></div>');
		var body = $('#circuit');
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
		var body, canv, onDrag, onUp;

		body = $('#circuit');
		canv = $('#container');
		onDrag = null;
		//onUp = null;
		function MoveBubble(e) {
			e.preventDefault();
			this.offsetDiff = {diffX: e.pageX - canv.offset().left, diffY: e.pageY - canv.offset().top};
			Circuit.setInterfaceEnabled(false, true);
			console.log("dragged");
		};

		MoveBubble.prototype.onDrag = function (e) {
			console.log("dragging");
			Circuit.setInterfaceEnabled(false);
			var newX = e.pageX - this.offsetDiff.diffX;
			var newY = e.pageY - this.offsetDiff.diffY
			e.preventDefault();
			if(newX > 0 && newY > 0 && (newX + canv.outerWidth()) < (body.width()) && (newY + canv.outerHeight()) < body.height()){
				canv.offset({left: newX, top: newY});
				this.offsetDiff = {diffX: e.pageX - canv.offset().left, diffY: e.pageY - canv.offset().top};
			}
		};
		MoveBubble.prototype.onUp = function (e) {
			Circuit.setInterfaceEnabled(true, true);
		}

    console.log("We're about to register it!!!")
		multidrag.register(canv, MoveBubble);
    console.log("We registered it")
	}

	/*create temporary speech bubble*/
	function createSpeechBubble(target, text){
		"use strict";
		var bubbleContainer = $('<div id = "container"></div>');
		$('#circuit_iface').append(bubbleContainer);
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
		var bubbleContainer;
		if($('#container').length <= 0){
			createSpeechBubble(target, text);
			bubbleContainer = $('div#container');
		}else{
			bubbleContainer = $('div#container');
			bubbleContainer.text(text);
		}
		var x = target.x + target.r;
		var y = target.y + target.r;
		
		if((x + bubbleContainer.width()) > $('#circuit').width()){
			x = $('#circuit').width() - bubbleContainer.width();
			bubbleContainer.offset({left: x, top: y});
		}
		if((y + bubbleContainer.height()) > $('#circuit').height()){
			y = $('#circuit').height() - bubbleContainer.height();
			bubbleContainer.offset({left: x, top: y});
		}
		$('div#container').css('opacity', '.8');
		registerDraggable();
	}

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
