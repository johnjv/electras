$(document).ready(function(){
	var startC = 0;
	$("#showhide").hide();
	
	$("#tally").hide();
	
	$("#start").click(function(){
	
		$("#start").attr("disabled",true);
		if (startC === 0 ) {
			startMachine();
		}
		else {
			clearTable();
			startMachine();
		}
		$("#tally").show();
		startC += 1;
	});
});	
function startMachine(){
	var count =0;
	var candies = getLevelType();
	var correct = true;
	//SOUND
	var belt = $('#belt_sound')[0];
	belt.play();
	
	function startNext(){
		
		if(count < 8) {
			var check = candies[count].checkCandy();
			var levelMark = false;
			var circuitMark = false;
			if (check === 1) {
				circuitMark = true;
				levelMark = true;
			}

			else if (check === 0){
				circuitMark = false;
				levelMark = true;
			}
			else if(check === -1){
				circuitMark = false;
				levelMark = false;
			}
			else if (check === 2){
				circuitMark = true;
				levelMark = false;
			}
			else if (check === 1 || check === -1){
				correct = false;
			}
			placeCandy(candies[count]);
			moveCandy(candies[count]);
			insertCandyIntoTally(candies[count].src);
			insertInfoIntoTally(circuitMark,levelMark);
			Circuit.setState(candies[count].circuitSays);
			count++; 			
			setTimeout(startNext, 3000);
		}
		else if (count >= 8) {
			belt.pause();
		}
	}
	
	startNext();
	if (correct) {
		// level is completed
	}
	else{
		// level is not completed
	}
}


function getLevelType(){
	"use strict";
	var level;
	level = LevelSelector.getCurrentLevel();
	var analyze = level.analyze();
	var typeInfo = new Array();	
	
	for (var i=0; i < 8 ; i+=1){
		var type = analyze[i].type;
		var levelSays = analyze[i].levelSays;
		var circuitSays = analyze[i].circuitSays;
	 	typeInfo[i] = new Candy(type, levelSays,circuitSays);
	}
	return typeInfo;
}

function insertCandyIntoTally(picture){
	"use strict";
	$("#frow").append("<td class='upperrow'>" + picture + "</td>");
}

function insertInfoIntoTally(circuitSays, levelSays){
	"use strict";
	var xflag = '<img src="../Floor/resource-image/envx.png" id="xflag"></img>';
	var checkmark = '<img src="../Floor/resource-image/checkmark.png" id="checkmark"></img>';
	
	
	if(circuitSays) { $("#srow").append("<td class='checkmarks'>" + checkmark + "</td>");}
	else { $("#srow").append("<td class='flags'>" + xflag + "</td>");}
	
	if(levelSays) { $("#trow").append("<td class='checkmarks'>" + checkmark + "</td>");}
	else { $("#trow").append("<td class='flags' >" + xflag + "</td>"); }
	
	if(levelSays === circuitSays) { $("#forow").append("<td class='checkmarks'>" + checkmark + "</td>");}
	else { $("#forow").append("<td class='flags'>" + xflag + "</td>"); }
}


function placeCandy(candy){
	"use strict";
	var candyPic = candy.picture;
	candyPic.width(40);
    var factory = $('#factory');
    var dropper = $("#dropper");
	var x = dropper.position().left;
	var y = dropper.position().top + dropper.height()/2.0 - candyPic.height()/2.0;
 	candyPic.css('left', x).css('top', y);
	factory.append(candyPic);
}

function moveCandy(candy){
	"use strict";
	var posleft, posdown;
	var candyPic = candy.picture;
	var belt = $('#belt');
	var box = $('#box');
	var dropper = $('#dropper');
	var glove = $("#glove");
	var trash = $("#trash");
	var factory = $('#factory');
	var punchingBox = $('#punchingbox');
	var garbage = $('#garbage_sound')[0];
	var correct = $('#correct_sound')[0];
	
	posleft = glove.position().left;
	posdown = trash.position().top - candyPic.position().top + candyPic.height() + trash.height()/4.0; 
	
	if(candy.checkCandy() === -1) {
		$(candyPic).animate({left:posleft},1500, 'linear', function() {movePuncher();});
		$(candyPic).animate({top:'+=' + posdown, width: '-=40'}, 600, 'linear', function() {
			garbage.play();});
	}
	
	else if(candy.checkCandy() === 0){
		$(candyPic).animate({left:posleft},1500, 'linear', function() {
			var flag = putAFlag(); 
			posdown = trash.position().top - flag.position().top + trash.height()/2.0;
			$(flag).animate({top: '+=' + (posdown),width: '-=20'}, 1500, 'linear');
			movePuncher();
		});
		$(candyPic).animate({top:'+=' + posdown, width: '-=40'}, 600, 'linear', function() {
			garbage.play();});
		
	}
	
	else if(candy.checkCandy() === 2){
		$(candyPic).animate({left:posleft},1500, 'linear', 
			function(){
				var flag = putAFlag();
				moveFlag(flag);
			});
		
		posleft = glove.position().left - belt.position().left;
		posdown = box.width()/3.0;
		$(candyPic).animate({left: '-=' + posleft}, 3000, 'linear'); 
		$(candyPic).animate({left: '-=' + (posdown),width: '-=40'}, 1500, 'linear');
		
	}
	
	else if(candy.checkCandy() ===  2){
		$(candyPic).animate({left:posleft},1500, 'linear', 
			function(){
				var flag = putAFlag();
				moveFlag(flag);
			});
		
		posleft = glove.position().left - belt.position().left;
		posdown = box.width()/3.0;
		$(candyPic).animate({left: '-=' + posleft}, 3000, 'linear'); 
		$(candyPic).animate({left: '-=' + (posdown),width: '-=40'}, 1500, 'linear');
		
	}
	
	else {
		posleft = dropper.position().left - belt.position().left;
		posdown = box.width()/3.0;
		$(candyPic).animate({left: '-=' + posleft}, 3000, 'linear', 
			function() {
				correct.play();}); 
		$(candyPic).animate({left: '-=' + (posdown),width: '-=40'}, 1500, 'linear');
   }
}

function putAFlag(){
	"use strict";
	var flag = $('<img src="../Floor/resource-image/envx.png" id="flag"></img>');
	var dropper = $('#dropper');
	var flagPos;
	var factory = $('#factory');
	var glove = $('#glove');
	flag.width(20);
	var x = glove.position().left;
	var y = dropper.position().top + dropper.height()/2.0 - flag.width() * 2.0;
	flag.css('left', x).css('top', y);
	factory.append(flag);
	return flag;
}

function moveFlag(flag){
	"use strict";
	var belt = $('#belt');
	var glove = $('#glove');
	var x = flag.offset().left - belt.offset().left;
	$(flag).animate({left:'-=0' + x},3000, 'linear');
	$(flag).animate({width: '-=20'}, 1500, 'linear');
}


function movePuncher(){
	var belt = $('#belt'); 
	var punch = $('#punch_sound')[0];
	$('#glove').animate({top: '+=0' + belt.height()/3.0}, 
				(1000/ $("#glove").position().left),'linear', function() {
					punch.play();});
	$('#glove').animate({top: '-=0' + belt.height()/3.0}, 600,'linear');
}

function stopMovingPuncher(){
	$('#glove').stop();
}

function clearTable(){
	$(".upperrow").remove();
	$(".checkmarks").remove();
	$(".flags").remove();
}

var FactoryFloor = (function($) {
	"use strict";
	var my = {}; 

	my.levelChanged = function() {
		clearTable();
		$("#start").attr("disabled",false);
	};
	my.windowResized = function () {
        var par;
        par = $('#main_container');
        console.log(par.width(), par.height(), $('#factoryParent').offset());
        $('#factoryParent').width(par.width()).height(par.height());
        $('#factory').width(par.width()).height(par.height());
        $('#factoryParent').offset(par.offset());
        console.log(par.width(), par.height(), $('#factoryParent').offset());
        Placer.place();
    };  
    
	return my;		
	}(jQuery));


