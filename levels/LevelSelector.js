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
        FactoryFloor.levelChanged(temp, level);         
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

    my.setComplete = function(complete){
        level.complete = complete;
    };
    
    my.windowResized = function () {
        var par, self, container, clipPos, tip;
        self = $('#clipboard');
        container = $('#main_container');
        tip = $('#cliptip');
        clipPos = self.position();       
        clipPos.left = (container.width() - self.width())/2        
        clipPos.top = container.height() *0;
        self.css('left', clipPos.left).css('top', clipPos.top);	
        tip.css('left', container.width() * 0.45).css('bottom' , '0%'); 
    };
    return my;
}(jQuery));
