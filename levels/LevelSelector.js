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
        var par, self;
	    self = $('#clipboard');
	    par = self.parent();
	    self.width(par.width());
	    self.height(par.height());
	    //workshop.paper.setSize(par.width(), par.height());
	};
    
    return my;
}(jQuery));
