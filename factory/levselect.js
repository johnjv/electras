var LevelSelector = (function ($) {
    "use strict";
    var my = {};                 
	var listeners = [];
    var curLevel = all_levels[0];

	my.addListener = function (listener) {
		listeners.push(listener);
	};

    my.setLevel = function (newLevel) {
        var oldLevel = curLevel;
        curLevel = newLevel;
		$.each(listeners, function (i, listener) {
			listener(oldLevel, newLevel);
		});
    }; 

    my.getCurrentLevel = function () {     
        return curLevel;
    };

    my.setComplete = function (complete) {
        curLevel.complete = complete;
    };

    return my;
}(jQuery));
