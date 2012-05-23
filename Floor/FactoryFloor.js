$(document).ready(function(){
	"use strict";	
	
	Placer.place();
	
	$("#start").click(function(){
		updateChalkBoard();
		startMachine();
	});
	
	function startMachine(){
		var items = createPictures();
		var count =0;
		var candies = getLevelType();
		
		function startNext(){
			if(count < 8) {
				var check = candies[count].checkCandy();
				if (check === 1) console.log(count + " Correct");
			
				else if (check === 0){
					console.log(count + " Push away, mark X");
					movePuncher();
					putAFlag();
			        moveFlag();
				}
				else if(check === -1){
					console.log(count + " Pushed away, correct");
					movePuncher();
				}
				else{
				   console.log(count + " Kept, mark X");
				   putAFlag();
			       moveFlag();
				}
				placeCandy(items[count]);
				moveCandy(items[count]);
				count++; 
			
				setTimeout(startNext, 3000);
			}
		}
		startNext();
	}
	
	
	function getLevelType(){
		"use strict";
		var level;
		level = LevelSelector.getCurrentLevel();
		var typeInfo = new Array();		
		var analyze = level.analyze();
		//console.log(analyze);
		
		for (var i=0; i < 8 ; i+=1){
			var type = analyze[i].type;
			var levelSays = analyze[i].levelSays;
			var circuitSays = analyze[i].circuitSays.accept;
		 	typeInfo[i] = new Candy(type, levelSays,circuitSays);
		}
		return typeInfo;
	}
	
	function createPictures(){
		var picArray = [];
		var candyInfo = getLevelType();	
		for (var j = 0; j < candyInfo.length;j+=1){	
			var candyName = candyInfo[j].type;	    
			picArray[j] = candyInfo[j].picture;
		}
		//console.log(picArray);
		return picArray;
	}
	
	function placeCandy(candyPic){
		"use strict";
		var dropper, candyPos, items;
        candyPic.width(20);
        var body = $('body');
        body.append(candyPic);
        var dropper = $("#dropper");
        $(candyPic).each(function(){
        	var x = dropper.offset().left;
        	var y = dropper.offset().top + dropper.height()/2.0 - candyPic.height()/2.0;
       	 	candyPic.offset({left:x , top:y});
        	body.append(candyPic);
        	//console.log("just added");
        });
             
    }
    var count =0;
    var movedCandies = [];
    
    function moveCandy(candyPic){
    	"use strict";
    	var belt = $('#belt');
    	var box = $('#box');
    	var dropper = $('#dropper');
    	var posleft = belt.width() - dropper.width();
    	var posdown = box.width()/2.0;
    	movedCandies.push(candyPic);
  
    	
    	$(candyPic).animate({
        	left: '-=' + posleft
        }, 3000); 
        $(candyPic).animate({
        	left: '-=' + (posdown-count),
        	width: '-=10',
        	
        }, 1500); 
        count+=10;
        return movedCandies;
    }
	
	function putAFlag(){
		"use strict";
		var flag = $('<img src="../Floor/resource-image/envx.png" id="flag"></img>');
		var glove = $('#glove');
		var flagPos;
		var body = $('body');
		flag.width(20);
		body.append(flag);
		var x  = glove.offset().left + glove.width()/2.0;
		var y = glove.offset().top + glove.height();
		
		flag.offset({left:x,top:y});
		console.log(x);
        console.log(y);
	}
	
	function moveFlag(){
		"use strict";
		$("#flag").animate({
			left:'-=300' // this should be machine.width - arm.left
		},2000);
		$(flag).animate({
			height: 'toggle'
		},3000);
	}

	function movePuncher(){
		var belt = $('#belt');
		$('#glove').animate({top: '+=0' + belt.height()/5.0}, 1500);
		$('#glove').animate({top: '-=0' + belt.height()/5.0}, 1000);
	}
	
	function stopMovingPuncher(){
		$('#glove').stop();
	}
	
	
	function changeCandyPos(){
		"use strict";
		var box = $("#box");
		var body = $('body');
		var x = box.offset().left + box.width()/2.0;
		var y = box.offset().top + box.width()/2.0;
		
		for(var i=0; i<movedCandies.length ; i+=1){
			movedCandies[i].remove();
			body.append(movedCandies[i]);	
			movedCandies[i].offset({left:x+ 2*i, top:y});
		}
	}
	
	var FactoryFloor = (function($) {
		"use strict";
		var my = {}; 

		my.levelChanged = function(oldLevel, newLevel) {
			level = newLevel;
			updateChalkBoard();
		};

		my.getleverLocation = function(){
			"use strict";
			var leverLocation, leverPos;
			leverPos = $("#lever").offset();
			leverLocation = new Object();
			leverLocation.x = leverPos.left;
			leverLocation.y = leverPos.top;
			leverLocation.width = $("#lever").width();
			leverlocation.height = $("#lever").height();         
			return leverLocation;                
		};

		my.getAdvanceLocation = function(){
			"use strict";
			var advanceLocation, advancePos;
			advancePos = $("#advanceLevel").offset();
			advanceLocation = new Object();
			advanceLocation.x = advancePos.left;
			advanceLocation.y = advancePos.top;
			advanceLocation.width = $("#advanceLevel").width();
			advanceLocation.height = $("#advanceLevel").height();
			return advanceLocation;
		};
		
		return my;
		
		}(jQuery));
		
	$(window).resize(function() {
		count = 0;
		Placer.place();
		changeCandyPos();
		stopMovingPuncher();
	});

});


