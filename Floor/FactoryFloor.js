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
	var flag = $('<img src="../Floor/resource-image/envx.png" id="flag"></img>');
	
	function startNext(){
		
		if(count < 8) {
			var check = candies[count].checkCandy();
			var levelMark = false;
			var circuitMark = false;
			if (check === 1) {
				levelMark = true;
				circuitMark = true;
			}

			else if (check === 0){
				levelMark = true;
				circuitMark = false;
				putAFlag(flag);
				moveFlag(flag);
				
			}
			else if(check === -1){
				//movePuncher();
				levelMark = false;
				circuitMark = false;
			}
			else{
				levelMark = false;
				circuitMark = true;
				putAFlag(flag);
				moveFlag(flag);
			}
			placeCandy(candies[count]);
			moveCandy(candies[count]);
			insertCandyIntoTally(candies[count].src);
			insertInfoIntoTally(circuitMark,levelMark);
			console.log(candies[count].circuitSays);
			Circuit.setState(candies[count].circuitSays);
			count++; 			
			setTimeout(startNext, 3000);
		}
	}
	
	startNext();
	//$("#start").attr("disabled",false);
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
	
	posleft = glove.position().left;
	posdown = trash.position().top - candyPic.position().top + candyPic.height() + trash.width()/4.0; 
	//$(candyPic).animate({left:posleft},1500, 'linear');
	
	if(candy.checkCandy() === -1) {
		$(candyPic).animate({left:posleft},1500, 'linear', function() {movePuncher();});
		$(candyPic).animate({top:'+=' + posdown, width: '-=40'}, 600, 'linear');
	}
	
	else {
		posleft = dropper.position().left - belt.position().left;
		posdown = box.width()/3.0;
		$(candyPic).animate({left: '-=' + posleft}, 3000, 'linear'); 
		$(candyPic).animate({left: '-=' + (posdown),width: '-=40'}, 1500, 'linear');
   }
}

function putAFlag(flag){
	"use strict";
	var dropper = $('#dropper');
	var flagPos;
	var factory = $('#factory');
	flag.width(20);
	var x = dropper.position().left;
	var y = dropper.position().top + dropper.height()/2.0 - flag.height()/2.0;
	flag.css('left', x).css('top', y);
	factory.append(flag);
	
}

function moveFlag(flag){
	"use strict";
	var belt = $('#belt');
	var glove = $('#glove');
	var flag = $('#flag');
	var x = flag.offset().left - belt.offset().left;
	
	$("#flag").animate({left:'-=0' + x},3000);
	$("#flag").hide(3000);
}


function movePuncher(){
	var belt = $('#belt'); 
	$('#glove').animate({top: '+=0' + belt.height()/3.0}, (1000/ $("#glove").position().left),'linear');
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

	my.levelChanged = function(oldLevel, newLevel) {
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


