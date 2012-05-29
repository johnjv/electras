var LevelSelector = (function($) {
    "use strict";
    var my = {};                 
    var level = all_levels[0];
    var pagenumber = 0;

    my.setLevel = function(change) {
        var temp;
        temp = level;
        level = change;
        Circuit.levelChanged(temp, level);         
    }; 
    
    my.setPage = function(change) {
        pagenumber = change;        
    }; 

   my.getCurrentLevel = function(){     
      return level;
    };
    
   my.getCurrentPage = function(){
      return pagenumber;
    };
    
    my.windowResized = function () {
        var par, self, container, clipPos;
	    self = $('#clipboard');
	    container = $('#main_container');
	    clipPos = self.position();       
        clipPos.left = container.width() * 0.4;
        clipPos.top = container.height() * 0.15;
        self.css('left', clipPos.left).css('top', clipPos.top);	    
	    /*resizeClipboard();
	    resizeCliporder();
	    resizeClipbuttons();*/
	};
    
    return my;
}(jQuery));
