var LevelSelector = (function ($) {
    "use strict";
    var my = {};                 
    var level = all_levels[0];
    var pagenumber = 0;

    my.setLevel = function (newLevel) {
        var oldLevel;
        oldLevel = level;
        level = newLevel;
        Circuit.levelChanged(oldLevel, newLevel);
        FactoryFloor.levelChanged(oldLevel, newLevel);         
    }; 

    my.setPage = function (change) {
        pagenumber = change;        
    }; 

    my.getCurrentLevel = function () {     
        return level;
    };

    my.getCurrentPage = function () {
        return pagenumber;
    };

    my.setComplete = function (complete) {
        level.complete = complete;
    };

    return my;
}(jQuery));
