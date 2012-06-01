var Placer = {};
(function(my, $){
	
	my.place = function(){
		placeBox();
		placeBelt();
		placeDropper();
		placePunchingBox();
		placeGlove();
		placeTrash();
		placeTally();
	}
	
	function moveTo(elt, x, y) {
		elt.css('left', x).css('top', y);
	}

	function placeBox(){
		"use strict";
		var box = $('img#box');
		var container = $('#factory');
		var boxPos = box.offset();
		box.height(container.height() * 0.3);
		box.width(box.height());
		var x =container.width() * (0.1);
		var y =container.height() * (0.5);
		moveTo(box, x, y);
	}

	function placeBelt(){
		"use strict";
		var belt = $('img#belt');
		var container = $('#factory');
		var box = $('img#box');
		belt.width(container.width() - box.position().left - box.width() + box.width()/4.0);
		belt.height(box.height());
		var x = box.position().left + box.width() - box.width()/4.0;
		var y = container.height() * (0.5);
		moveTo(belt,x,y);
	}
	
	function placeDropper(){
		"use strict";
		var dropper = $('img#dropper');
		var container = $('#factory');
		var belt = $('img#belt');
		dropper.height(belt.height());
		dropper.width(belt.width()/10);
		var x =belt.position().left + belt.width() - dropper.width();
		var y =container.height() * (0.5); 
		moveTo(dropper,x,y);
	}
	
	function placePunchingBox(){
		"use strict";
		var punchingBox = $('img#punchingbox');
		var container = $('#factory');
		var belt = $('img#belt');
		punchingBox.width(belt.width() /6.0);
		punchingBox.height(belt.height()/2.0);
		var x = belt.position().left + belt.width()/2.0 ;
		var y =container.height() * (0.5) - punchingBox.height();
		moveTo(punchingBox,x,y);
	}
	
	function placeGlove(){
		"use strict";
		var glove = $('img#glove');
		var belt = $('img#belt');
		var punchingBox = $('img#punchingbox')
		glove.height(belt.height()/2.0);
		var x = (punchingBox.width() - glove.width())/2.0 + punchingBox.position().left;
		var y =punchingBox.position().top + punchingBox.height()/3.0;
		moveTo(glove,x,y);
	}
	
	function placeTrash(){
		"use strict";
		var trash = $("img#trash");
		var punchingBox = $("img#punchingbox");
		var belt = $("img#belt");
		var container = $('#factory');
		trash.height(punchingBox.height());
		trash.width(punchingBox.width());
		var x = punchingBox.position().left;
		var y = container.height() * 0.8;
		moveTo(trash,x,y);
	}
	
	function placeTally(){
		"use strict";
		var tally = $('#tally');
		var punchingBox = $("img#punchingbox");
		var container = $('#factory');
		var x = container.width() * 0.5;
		var y = container.height() * 0.001;
		moveTo(tally,x,y);
		
		var tallyPosBottom = tally.position().top + tally.height();
		var punchingBoxPos = punchingBox.position().top;
		var tallyPosRight = tally.position().left + tally.width();
		if (tallyPosBottom > punchingBoxPos || tallyPosRight > container.width()) {
			tally.hide();
		}
		else{
			tally.show();
		}
	}
	
}(Placer, jQuery));




