var FactoryFloor = (function ($) {
	"use strict";

	function createImages() {
		var imageData = [
			['floorbase', 0, 0, 2048, 1365.33],
			['punchglove', 1480, 688, 180, 474.969],
			['punchbox', 1420, 879, 387, 313.738],
			['producer', 1879, 450, 170, 361.5]
		];
		$.each(imageData, function (i, data) {
			var src;
			src = imgpath.get('resource/floor/' + data[0], ['svg', 'png']);
			$('#factory').append($('<img></img>')
				.attr('src', src)
				.attr('id', data[0])
				.css({left: data[1], top: 1365.33 - data[2] - data[4],
					width: data[3]}));
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
		this.enabled = true;
		if (Clipboard.isInClipboardTip(e)) {
			this.enabled = false;
			Clipboard.setVisible(true);
		}
	};

	ClickHandler.prototype.onRelease = function (e) {
		var par, poffs, r, x, y;
		console.log('ClickHandler', e.pageX, e.pageY);
		if (e.isTap && this.enabled) {
			par = $('#main_container');
			poffs = par.offset();
			r = 2048.0 / par.width();
			x = (e.pageX - poffs.left) * r;
			y = (e.pageY - poffs.top) * r;
			console.log('ClickHandler 2', x, y);
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

	var initialized = false;

	function ensureInitialized() {
		if (!initialized) {
			initialized = true;
			createImages();

			$("#tally").hide();
			$("#success").hide();
			$("#failure").hide();

			multidrag.register($('#factory'), ClickHandler);
		}
	}

	function updateLevel(oldLevel, newLevel) {
		if (newLevel === null) {
			$('#factory').hide();
		} else {
			ensureInitialized();
			clearTable();
			$("#tally").hide();
			$("#success").hide();
			$("#failure").hide();
			$('#factory').show();
			$('#factoryParent').show();
		}
	};

	$(document).ready(function () {
		LevelSelector.addListener(updateLevel);
	});  

	var my = {}; 

	my.windowResized = function (w, time) {
		var x, y;
		x = -(2048 - w) / 2;
		y = x / 1.5;
		$('#factoryParent').stop().animate({ width: w, height: w / 1.5 }, time);
		$('#factory').stop().animate({ left: x, top: y,
			transform: 'scale(' + (w / 2048)  + ')' }, time);
	}; 

	return my;              
}(jQuery));
