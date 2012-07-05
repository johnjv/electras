var Translator = (function ($) {
	var my = {};

	var current_language = 'EN';
	var current_texts = {};
	var english_texts = {};
	var listeners = [];
	var lang = 'KO';

	function getId(domElt) {
		var classes, i;
		classes = domElt.classList;
		if (!classes) {
			classes = domElt.className.split(' ');
		}
		if (classes) {
			for (i = 0; i < classes.length; i += 1) {
				if (classes[i] !== 'stop') {
					return classes[i];
				}
			}
		}
		return '?';
	}

	function hashify(html) {
		var elt = $(html);
		if (!elt.hasClass('stop') && elt.children().length > 0) {
			var new_hash = {};
			elt.children().each(function (i, child) {
				new_hash[getId(child)] = hashify(child);
			});
			return new_hash;
		} else {
			return elt.html();
		}
	};

	my.getText = function () {
		var i, node, isOnEnglish;
		node = current_texts;
		isOnEnglish = node === english_texts;
		for (i = 0; i < arguments.length; i += 1) {
			if (node.hasOwnProperty(arguments[i])) {
				node = node[arguments[i]];
			} else {
				if (isOnEnglish) {
					// Already searched for English text - just use key
					return arguments[arguments.length - 1];
				} else {
					// Not found - backing up to get English instead
					i = -1;
					node = english_texts;
					isOnEnglish = true;
				}
			}
		}
		return node;
	};

	my.changeLanguage = function (language_code) {
		current_language = language_code;
		current_texts = hashify($('#translations #' + language_code));
		$.each(listeners, function (i, listener) {
			listener();
		});
		if (language_code === 'EN') {
			lang = 'KO';
		} else {
			lang = 'EN';
		}
	};

	my.getCurrentLanguage = function () {
		return lang;
	};

	my.list_languages = function () {
		return $('#translations').children().map(function (i, child) {
			return child.id;
		});
	};

	my.addListener = function (function_added) {
		listeners.push(function_added);
	};

	$(document).ready(function () {
		Translator.changeLanguage('EN');
		english_texts = hashify($('#translations #EN'));
		my.en_text = english_texts;
	});

	return my;
}(jQuery));
