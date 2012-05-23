$(document).ready(function(){
	"use strict";
	
	$("#advanceLevel").click(function(){
		LevelSelector.advanceLevel(true); 
		updateChalkBoard();
		updateLevelName();
	});
	
	$("#prev").click(function(){
		LevelSelector.previousLevel(true); 
		updateChalkBoard();
		updateLevelName();
	});
	
	$("#showLevels").click(function(){
		LevelSelector.showSelector(true);			
	});
	
	$("#hint").click(function(){
		console.log("show hint here");
	});
});	
	
function updateChalkBoard(){
	"use strict"
	var level = LevelSelector.getCurrentLevel();
	$('#order').text(level.orderText);
}	

function getHint(){
    var level = LevelSelector.getCurrentLevel();
    return level.hint;
}

function updateLevelName(){
    var level = LevelSelector.getCurrentLevel();
    $('#levelname').text(level.levelname);
}   
