var LevelSelector = (function ($) {
    "use strict";
    var my = {};                 
	var listeners = [];
    var curLevel = allLevels[0];

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

    my.setComplete = function (level, complete) {
        level.complete = complete;
		$.each(listeners, function (i, listener) {
			if (listener.completeChanged) {
				listener.completeChanged(level);
			}
		});
    };

    return my;
}(jQuery));
