var FactoryFloor = (function ($) {
	"use strict";

	var imageData = [
		['floorbase', 0, 0, 2048, 1365.33],
		['punchglove', 1515, 720, 172.75, 455.88],
		['punchbox', 1420, 895, 446, 361.5],
		['producer', 1878, 450, 170, 361.5]
	];

	function createImages() {
		var par = $('#factory');
		$.each(imageData, function (i, data) {
			var name, src, elt;
			name = data[0]
			src = imgpath.get('resource/floor/' + name, ['svg', 'png']);
			par.append($('<img></img>').attr('src', src).attr('id', name));
		});
		layoutImages();
	}

	function layoutImages() {
		var r;
		r = $('#factory').width() / 2048.0
		$.each(imageData, function (i, data) {
			var name, x, y, w;
			name = data[0];
			x = r * data[1];
			y = r * data[2];
			w = r * data[3];
			$('#' + name).stop().width(w).css('left', x).css('top', y);
		});
	}

	var animationAlive = false;

	function doPause() {
	}

	function doPlay() {
		if (!animationAlive) {
			animationAlive = true;
			clearTable();
			startMachine(function () {
				animationAlive = false;
			});
			$("#tally").show();
		}
	}

	var buttonLocations = [
		[doPlay, 1776.20, 8.5, 267.32, 187.7],
		[doPause, 1820.2, 218.3, 159.3, 159.3]
	];

	var ClickHandler = function (e) {
		e.preventDefault();
	};

	ClickHandler.prototype.onRelease = function (e) {
		var par, poffs, r, x, y;
		if (e.isTap) {
			par = $('#factory');
			poffs = par.offset();
			r = par.width() / 2048.0;
			x = (e.pageX - poffs.left) / r;
			y = (e.pageY - poffs.top) / r;
			$.each(buttonLocations, function (i, data) {
				if (x >= data[1] && y >= data[2] && x < data[1] + data[3] &&
						y < data[2] + data[4]) {
					$('#tip').hide();
					data[0]();
				}
			});
		}
	};

	function startMachine(onDone){
		var count, candies, correctSet;
		count = 0;
		candies = getLevelType();
		correctSet = true;
		Audio.play('belt_sound');
		startNext();
		
		function startNext() {
			var failedCandy;
			if(count < candies.length) {
				var check = candies[count].checkCandy();
				var levelMark = false;
				var circuitMark = false;
				if (check === 1) {
					circuitMark = true;
					levelMark = true;
				} else if (check === 0) {
					circuitMark = false;
					levelMark = true;
					correctSet = false;
				} else if(check === -1) {
					circuitMark = false;
					levelMark = false;
				} else if (check === 2) {
					circuitMark = true;
					levelMark = false;
					correctSet = false;
					failedCandy = candies[count].src;
				}
				animateEach(candies[count],circuitMark,levelMark);
				count++;                        
				setTimeout(startNext, 3000);
			} else {
				$("#tip").show();
				onDone();
				Audio.pause('belt_sound');
				if (correctSet) {
					LevelSelector.setComplete(true);
					checkComplete();
					showMessage($("#success"));
				} else {
					LevelSelector.setComplete(false);
					showMessage($("#failure"));
					$("#failedCandy").append(failedCandy);
				}
			}
		}
	}

	function animateEach(candy, cir, lev) {
		placeCandy(candy);
		moveCandy(candy);
		createTally(candy.src, cir, lev);
		Circuit.setState(candy.circuitSays);
	}

	function getLevelType() {
		var seq, typeInfo;

		seq = computeSequence(LevelSelector.getCurrentLevel());
		typeInfo = [];
		for (var i = 0; i < seq.length; i += 1){
			typeInfo[i] = new Candy(seq[i].type, seq[i].levelSays,
				seq[i].circuitSays);
		}
		return typeInfo;
	}

	function createTally(picture, circuitSays, levelSays){
	/*
		layoutImages();
		var xflag = '<img src="../Floor/resource-image/envx.png" id="xflag"></img>';
		var checkmark = '<img src="../Floor/resource-image/checkmark.png" id="checkmark"></img>';
		var boxTally = '<img src="../Floor/resource-image/box.png" id="boxTally"></img>';
		var trashTally = '<img src="../Floor/resource-image/trash.png" id="trashTally"></img>';  
		
		$("#frow").append("<td class='upperrow'>" + picture + "</td>");
		
		if(circuitSays) { $("#srow").append("<td class='checkmarks'>" + boxTally + "</td>");}
		else { $("#srow").append("<td class='flags'>" + trashTally + "</td>");}
			
		if(levelSays) { $("#trow").append("<td class='checkmarks'>" + boxTally + "</td>");}
		else { $("#trow").append("<td class='flags' >" + trashTally + "</td>"); }
			
		if(levelSays === circuitSays) { $("#forow").append("<td class='checkmarks'>" + checkmark + "</td>");}
		else { $("#forow").append("<td class='flags'>" + xflag + "</td>"); }
	*/
	}

	function placeCandy(candy){
	/*
		var candyPic = candy.picture;
		candyPic.width('3%');
		var factory = $('#factory');
		var dropper = $("#dropper");
		var x = dropper.position().left;
		var y = dropper.position().top + dropper.height()/2.0 - candyPic.height()/2.0;
		candyPic.css('left', x).css('top', y);
		factory.append(candyPic);
		*/
	}

	function moveCandy(candy){
	/*
		var posleft, posdown;
		var candyPic = candy.picture;
		var belt = $('#belt');
		var box = $('#box');
		var dropper = $('#dropper');
		var glove = $("#glove");
		var trash = $("#trash");
		var punchingBox = $('#punchingbox');
		posleft = glove.position().left;
		posdown = trash.position().top - candyPic.position().top + candyPic.height() + trash.height()/4.0; 
			
		if(candy.checkCandy() === -1) {
			$(candyPic).animate({left:posleft},1500, 'linear', function(){movePuncher();});
			$(candyPic).animate({top:'+=' + posdown, width: '-=0' + candyPic.width()}, 600, 'linear',
				function(){
					Audio.play('garbage_sound');			
					Audio.play('correct_sound');
			});
		}
			
		else if(candy.checkCandy() === 0){
			$(candyPic).animate({left:posleft},1500, 'linear', function() {
				var flag = putAFlag(); 
				posdown = trash.position().top - flag.position().top + trash.height()/2.0;
				$(flag).animate({top: '+=' + (posdown),width: '-=0' + flag.width()}, 600, 'linear');
				movePuncher();
			});
			$(candyPic).animate({top:'+=' + posdown, width: '-=0'+ candyPic.width()}, 600, 'linear',function() {
				Audio.play('garbage_sound');});
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
			$(candyPic).animate({left: '-=' + (posdown),width: '-=0'+ candyPic.width()}, 1500, 'linear');  
		}
			
		else {
			posleft = dropper.position().left - belt.position().left;
			posdown = box.width()/3.0;
			$(candyPic).animate({left: '-=' + posleft}, 3000, 'linear', 
				function(){
					Audio.play('correct_sound');
			}); 
			$(candyPic).animate({left: '-=' + (posdown),width: '-=0'+candyPic.width()}, 1500, 'linear');
		}
		$(candyPic).fadeOut(600, function(){
			$(candyPic).hide();
		});
		*/
	}

	function putAFlag(){
	/*
		var flag = $('<img src="../Floor/resource-image/envx.png" id="flag"></img>');
		var dropper = $('#dropper');
		var flagPos;
		var factory = $('#factory');
		var glove = $('#glove');
		flag.width('2%');
		var x = glove.position().left;
		var y = dropper.position().top + dropper.height()/2.0 - flag.width() * 2.0;
		flag.css('left', x).css('top', y);
		factory.append(flag);
		Audio.play('incorrect_sound');
		return flag;
		*/
	}

	function moveFlag(flag){
		/*
		var belt = $('#belt');
		var glove = $('#glove');
		var x = flag.offset().left - belt.offset().left;
		$(flag).animate({left:'-=0' + x},3000, 'linear');
		$(flag).animate({width: '-=0' + flag.width()}, 1500, 'linear');
		*/
	}

	function movePuncher(){
		/*
		var belt = $('#belt');
		$('#glove').animate({top: '+=0' + belt.height()/3.0}, 
								(1000/ $("#glove").position().left),'linear', function() {
										Audio.play('punch_sound');});
		$('#glove').animate({top: '-=0' + belt.height()/3.0}, 600,'linear');
		*/
	}

	function clearTable(){
		/*
		$(".upperrow").remove();
		$(".checkmarks").remove();
		$(".flags").remove();
		*/
	}

	function showMessage(mess){
		mess.show();
		mess.fadeOut(20000, function(){
			mess.hide();
		});
	}

	$(document).ready(function () {
		createImages();

		$("#tally").hide();
		$("#success").hide();
		$("#failure").hide();

		multidrag.register($('#factory'), ClickHandler);
	});  

	var my = {}; 

	my.updateLayout = layoutImages;
	
	my.levelChanged = function () {
		clearTable();
		$("#tally").hide();
		layoutImages();
		$("#success").hide();
		$("#failure").hide();
	};
	
	my.windowResized = function () {
		var par;
		par = $('#main_container');
		$('#factoryParent').width(par.width()).height(par.height());
		$('#factory').width(par.width()).height(par.height());
		$('#factoryParent').offset(par.offset());
		layoutImages();
	}; 
	
	return my;              
}(jQuery));

