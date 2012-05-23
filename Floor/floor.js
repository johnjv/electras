var Placer = {};
        (function(my, $){
	
	my.placing = function(){
		placeBox();
		placeBelt();
		placeDropper();
		placePunchingBox();
		placeGlove();		
	}

	function placeBox(){
		"use strict";
		var box = $('img#box');
		var body = $('body');
		var boxPos = box.offset();
		var x =body.width() * (0.1);
		var y =body.height() * (0.5);
		box.offset({left: x , top: y});
	}

	function placeBelt(){
		"use strict";
		var belt = $('img#belt');
		var body = $('body');
		var box = $('img#box');
		var x = box.offset().left + box.width() -25;
		var y =body.height() * (0.5);
		belt.offset({left: x , top: y});
	}
	
	function placeDropper(){
		"use strict";
		var dropper = $('img#dropper');
		var body = $('body');
		var belt = $('img#belt');
		var space = (belt.height() - dropper.height())/2.0; 
		var x =belt.offset().left + belt.width() - dropper.width();
		var y =body.height() * (0.5) + space;
		dropper.offset({left: x , top: y});
	}
	
	function placePunchingBox(){
		"use strict";
		var punchingBox = $('img#punchingbox');
		var body = $('body');
		var belt = $('img#belt');
		var x =(belt.width() * (0.6)) + belt.offset().left ;
		var y =body.height() * (0.5) - punchingBox.height()-10;
		punchingBox.offset({left: x , top: y});
	}
	
	function placeGlove(){
		"use strict";
		var glove = $('img#glove');
		var belt = $('img#belt');
		var punchingBox = $('img#punchingbox')
		var x = (punchingBox.width() - glove.width())/2.0 + punchingBox.offset().left;
		var y =punchingBox.offset().top + punchingBox.height() / 3.0;
		glove.offset({left: x , top: y});
	}	
}(Placer, jQuery));




