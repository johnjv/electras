$("#start").click(function(){
		updateChalkBoard();
		startMachine();
		$("#tally").show();
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
					placeCandy(candies[count]);
					moveCandy(candies[count]);
					levelMark = true;
					circuitMark = true;
				}

				if (check === 0){
					placeCandy(candies[count]);
					moveCandy(candies[count]);
					levelMark = true;
					circuitMark = false;
					//movePuncher();
					putAFlag(flag);
					moveFlag(flag);
					
				}
				else if(check === -1){
					// move to trash
					//movePuncher();
					placeCandy(candies[count]);
					moveCandy(candies[count]);
					levelMark = false;
					circuitMark = false;
				}
				else{
					placeCandy(candies[count]);
					moveCandy(candies[count]);
					levelMark = false;
					circuitMark = true;
					console.log(count + " Kept, mark X");
					putAFlag(flag);
					moveFlag(flag);
				}
				
				insertCandyIntoTally(candies[count].src);
				insertInfoIntoTally(circuitMark,levelMark);
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
		var analyze = level.analyze();
		var typeInfo = new Array();	
		
		for (var i=0; i < 8 ; i+=1){
			var type = analyze[i].type;
			var levelSays = analyze[i].levelSays;
			var circuitSays = analyze[i].circuitSays.accept;
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
		
		
		if(circuitSays) { $("#srow").append("<td>" + checkmark + "</td>");}
		else { $("#srow").append("<td>" + xflag + "</td>");}
		
		if(levelSays) { $("#trow").append("<td>" + checkmark + "</td>");}
		else { $("#trow").append("<td>" + xflag + "</td>"); }
		
		if(levelSays === circuitSays) { $("#forow").append("<td>" + checkmark + "</td>");}
		else { $("#forow").append("<td>" + xflag + "</td>"); }
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
    	
    	if(candy.checkCandy() === -1) {
    		posleft = glove.position().left;
			posdown = trash.position().top - candyPic.position().top; 
			$(candyPic).animate({left:posleft},3000, movePuncher());
			$(candyPic).animate({top:'+=' + posdown, width: '-=40' },1500);
    	}
    	
    	else {
    		posleft = belt.width() - dropper.width();
    		posdown = box.width()/3.0;
    		$(candyPic).animate({left: '-=' + posleft}, 3000); 
    		$(candyPic).animate({left: '-=' + (posdown),width: '-=40'}, 1500); 
        	//$(candyPic).hide(1500);
       }
    }
	
	function putAFlag(flag){
		"use strict";
		var glove = $('#glove');
		var flagPos;
		var body = $('#main_container');
		flag.width(20);
		var x  = glove.offset().left + glove.width()/2.0;
		var y = glove.offset().top + glove.height();
		flag.offset({left:x,top:y});
		body.append(flag);
		
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
	
	
	function getOrder(){
		"use strict";
		var level = LevelSelector.getCurrentLevel();
		var order = level.orderText;
		return order;
		//console.log(order);
	}
	
	function updateChalkBoard(order){
		"use strict"
		var orderText = getOrder();
		$('#order').text(orderText);
	}

	function movePuncher(){
		var belt = $('#belt'); 
		$('#glove').animate({top: '+=0' + belt.height()/3.0}, 3000);
		$('#glove').animate({top: '-=0' + belt.height()/3.0}, 600);
		console.log("punch");
	}
	
	function stopMovingPuncher(){
		$('#glove').stop();
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


