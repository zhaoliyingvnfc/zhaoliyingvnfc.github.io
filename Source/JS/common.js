$(function (){

	//phushMenu
	$('#pushLink').hover(
		function(){$(this).animate({left: "0"}, 400);},
		function(){$(this).animate({left: "-409px"}, 400);}
	);

	// Ajax Load -----------------------

//	domain = 'http://' + location.host + '/kengakimi/';

// redirect
	if ( location.href != domain ) {
		var goHash = location.href.replace(domain, '');
		if ( !/^\#/.test(goHash)) {
			location.href = domain + '#' + goHash;
			return false;
		}
	}
	$('#wrapper').append('<div id="loader"><p>loading</p></div>');
	$('#loader').fadeOut();

	// hash change event
	$(window).bind('hashchange', function (e) {

		/* sound stop */
		var voice = $('.voice');
		if(voice[0]) {
			$('.vplay').each(function() {
				var vNum =  $(this).attr('id');
				$('#sv'+ vNum).jPlayer('stop');
			});
			setTimeout (function() {
				$('#player').jPlayer('volume', 0.8);
			},300);

		}

		if ( !location.hash ) {
			ajaxLoad(domain);
		} else if( location.hash == "#" ) {
			ajaxLoad(location.hash.replace('#', 'index.php'));
		} else {
			ajaxLoad(location.hash.replace('#', ''));
		}
	});
	if ( location.hash && location.hash != '#/' ) $(window).trigger('hashchange');

	// Page Scroll
	function pageScroll() {
		var target = $($.browser.msie || $.browser.mozilla || $.browser.opera ? 'html' : 'body');
		var position = target.offset().top;
		target.queue([]).stop();
		target.animate({scrollTop : position}, 600, 'easeInOutExpo');
	}

	// href replace function
	$.fn.hrefReplace = function () {
		var elms = $(this);
		elms.each(function (){
			$(this)
				.filter(function (){
					return this.href.indexOf(domain,0) != -1 ;
				})
				.attr('href', $(this).attr('href').match(/^\./)
					? $(this).attr('href')
						.replace(domain, '')
						.replace(/^\./, '#')
					: '#' + $(this).attr('href').replace(domain, ''))
				.click(function() {
					if ( this.hash === location.hash ) {
						pageScroll();
					}
					location.hash = this.hash;
					return false;
				});
		});
	}

	// href replace
	if ( !/https/.test(location.href) ) {
			$('a[href],area[href]').not("[href*='#'], .sns, .normalLink, .popup, .cboxImg, .cboxMovie, .iframe_img, .modalBox").hrefReplace();
	}

	// Ajax Load Function
	function ajaxLoad(url){

		pageScroll();
		$("#loader").fadeIn();

		$.ajax({
				type: 'GET',
				dataType: 'html',
				url: url,
				complete:function (){
		},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					if ( textStatus === 'error' ) {
						alert('ページが存在しないため、トップページヘ移動します。');
						location.href = domain;
					}
				},
				success: function (html) {
					if ( _gaq ) {
						_gaq.push(['_trackPageview', url]);
					}
					//Tag Delete
					html = html.replace(/<script(?:[ \t\r\n][^>]*)?>[\S\s]*?<\/script[ \t\r\n]*>|<\/?(?:i?frame|html|script|object)(?:[ \t\r\n][^<>]*)?>/gi, '');

					// Make Contents
					var _div = $('<div>' + html + '</div>'),
					contents = $('#contents', _div);

					// Title Replace
					title = html.match(/\<title\>([^\<]+)\<\/title\>/) ? RegExp.$1 : '',
					document.title = title;

					// Contents Replace
					$('#wrapperInner').html(contents);

					// Href Replace
					contents.find('a[href],area[href]').not("[href*=#], .normalLink, .popup, .cboxImg, .cboxMovie, .iframe_img, .modalbox").hrefReplace();

					// Character Rollover	--------------------------------
					$('#charaAnchor a').on ({
						'mouseenter' : function(){
							$("#" + $(this).attr('id') + "_on").stop().show();
						},'mouseleave' : function(){
							$("#" + $(this).attr('id') + "_on").stop().hide();
						}
					});

					// Colorbox ------------------------
					$('a.cboxImg').colorbox({transition:"elastic", speed:"50", maxWidth: "80%", maxHeight: "80%"});

					/* iframe */
					$('.eg-box a.iframe_img').colorbox({iframe:true, scrolling:false, width:"922", height:"625", rel:'group1'});

					/* Youtube */
					$('a.cboxMovie').colorbox({ iframe: true, innerWidth: 650, innerHeight: 550, maxWidth: "80%", maxHeight: "80%"});
					$('a.cboxMovie').on({
						'click' : function (){
							$('#player').jPlayer('volume', 0);
						},'cbox_open' :function(){
							$('#colorbox').addClass('movieModal');
						},'cbox_closed' :function(){
							$('#player').jPlayer('volume', 0.8);
							$('#colorbox').removeClass('movieModal');
						}
					});

					//Magnific-popup ------------------------
					$('.btn-buy a').magnificPopup({
						items: {
							type: 'inline',
							src: '.modalBox',
							closeBtnInside: false
						}
					});
					//Magnific-popup ------------------------
					$('.modal-tokaido a').each(function() {
						var target = $(this)[0].className;
						$(this).magnificPopup({
							items: {
								type: 'inline',
								src: '.modal-' + target,
								closeBtnInside: false
							}
						});
					});

					$('.interview-modal a').each(function() {
						var target = $(this)[0].className;
						$(this).magnificPopup({
							items: {
								type: 'inline',
								src: '.modal-' + target,
								closeBtnInside: false
							}
						});
					});

					// ToolTip
					var tiptarget = $('.requirebtn');
					if(tiptarget[0]) {
						$('.requirebtn').hover(function(){
							tip = $('.productLeft').find('.require');
							if ($.support.opacity) {
								tip.fadeIn();
							} else {
								tip.show();
							}
						}, function() {
							if ($.support.opacity) {
								tip.fadeOut();
							} else {
								tip.hide();
							}
						});
					}
					// Character Voice  ------------------------
					var voice = $('.voice');
					if (voice[0]) {
						// Voice Load
						$('.vplay').each(function() {
							var vNum =  $(this).attr('id');
							$('#sv' + vNum ).jPlayer({
								ready: function (){
									$(this).jPlayer('setMedia', {
												mp3: domain + 'media/voice/sv' + vNum + '.mp3'
									}).jPlayer('stop');
								},
									swfPath: domain + 'common/js',
									supplied: 'mp3',
									//errorAlerts :true,
									cssSelectorAncestor: '#jp_interface_' + vNum ,
									ended: function (event) {
										$('#player').jPlayer('volume', 0.8);
										$('.vstop').hide();
										$('.vplay').show();
								}
							});
						});
						// Voice Play and Stop
						function vplay(voinum) {
							$('#player').jPlayer('volume', 0);
							$('.vplay').each(function() {
								var vNum =  $(this).attr('id');
								$('#sv' + vNum ).jPlayer('stop');
							});
							setTimeout(function (){
								$('#sv' + voinum ).jPlayer('play');
							},300);
						}
						function vstop(){
							$('.vplay').each(function() {
								var vNum =  $(this).attr('id');
								$('#sv' + vNum ).jPlayer('stop');
							});
							setTimeout(function (){
								$('#player').jPlayer('volume', 0.8);
							},300);
						}
						$('.vstop').hide();

						/* Voice Play */
						$('.vplay').click(function (){
							var vn = $(this).attr('id');
							vplay(vn);
						});
						/* Voice Stop */
						$('.vstop').click(function (){
							vstop();
						});
					}
					// Carousel -------------------------------------
					var charaNavWrap = $('#charaNavWrap');
					if (charaNavWrap[0]) {
						$('.chara-current').show();
						$('.chara-pre').hide();
						$('.btn-pre').hide();
						$('.btn-current').on('click',function() {
							$('.chara-current').hide();
							$('.chara-pre').show();
							$('.btn-current').hide();
							$('.btn-pre').show();
						});
						$('.btn-pre').on('click',function() {
							$('.chara-pre').hide();
							$('.chara-current').show();
							$('.btn-pre').hide();
							$('.btn-current').show();
						});
					}
					$("#loader").fadeOut();
					// window load event
					$(window).trigger('load');
				}
		});
	}
});

jQuery.event.add(window, 'load', function (){

	// gnav -------------------------
	$('#gnav ul li.parent').on ({
		'mouseenter' : function() {
			var hidden =  $(this).find('.hidden');
			var target = hidden.find('ul');
			$(this).children('a').addClass('hover');
			hidden.show();
			target.stop().animate ({right : '0'},1000);
		},'mouseleave' : function() {
			var hidden =  $(this).find('.hidden');
			var target = hidden.find('ul');
			var scrwidth = target.width();
			$(this).children('a').removeClass('hover');
			target.stop().animate ({
				right : 0 - scrwidth
			},500 , function(){
				hidden.hide();
			});
		}
	});

	// Popup Window ------------------------
	$('.popup01').click(function (){
		window.open(this.href, "WindowName","width=760,height=900,resizable=yes,scrollbars=yes");
		return false;
	});

	// Popup Window ------------------------
	$('.popup02').click(function (){
		window.open(this.href, "WindowName","width=820,height=810,resizable=yes,scrollbars=yes");
		return false;
	});

	// Popup Window ------------------------
	$('.popup03').click(function (){
		window.open(this.href, "WindowName","width=820,height=730,resizable=yes,scrollbars=yes");
		return false;
	});

	// Tinyscrollbar -------------------------------------
	$('.infoInner').tinyscrollbar();

});


// BGM Switch
$(function(){
	kengakimiBgm.init();
});


/***************************************
 *
 * bgm
 *
 ***************************************/
(function() {
	var $player,
		$trackList;

	kengakimiBgm = {
		init: function() {
			var trackList = $('#bgmTrackList'),
				trackListLi = $('#bgmTrackList li'),
				trackListName = $('#bgmTrackListName'),
				isOver = false;
				$player = $('#player');
			//mouseover
			trackList.mouseenter(function(e) {
				if (!isOver) {
					isOver = true;
					e.stopPropagation();
					trackList.animate({
						height:  14 * trackListLi.length + 100
					}, 450);
					trackListName.addClass('mouseover');
				}
			});
			//mouseout
			trackList.mouseleave(function(e) {
				var element = this,
						currentTarget;
				if (e.toElement) {
					currentTarget = e.toElement;
				} else if (e.relatedTarget) {
					currentTarget = e.relatedTarget;
				}
				if( element != currentTarget ) {
					trackList.animate({
						height: 14
					}, 300, null, function() {
						isOver = false;
					});
					trackListName.removeClass('mouseover');
				}
			});

			//click
			trackListLi.click(function(e) {
				var className = e.currentTarget.className,
					trackListNameP = $('#bgmTrackListName p'),
					trackListName = $('#bgmTrackListName');
					trackListNameP.attr('class', className);
					trackListName.width(trackListNameP.width());
					kengakimiBgm.playMP3();
			});

			//jplayer
			$player.jPlayer({
				ready: function() {
					$('#bgmTrackList li:eq(' + (Math.floor(Math.random()*trackListLi.length)) + ')').trigger('click');
				},
				supplied: 'mp3',
				swfPath: domain + 'common/js',
				//errorAlerts : true,
				cssSelectorAncestor: '#control',
				solution: 'html,flash',
				ended: function (event) {
					$player.jPlayer('play');
				}
			});
		},
		//設定されたメディアの再生
		playMP3: function () {
			var $trackListNameP;
			if ($player != null) {
				$trackListNameP = $('#bgmTrackListName p');
				$player.jPlayer('setMedia', {
					mp3: domain + 'media/sound/' + $trackListNameP.attr("class") + '.mp3'
				}).jPlayer('play').jPlayer('volume', 0.8);
			}
		}
	};
})();

/*-----------------------------------------------------------
jquery-rollover.js
jquery-opacity-rollover.js
-------------------------------------------------------------*/

/*-----------------------------------------------------------
jquery-rollover.js　※「_on」画像を作成し、class="over"を付ければOK
-------------------------------------------------------------*/

function initRollOverImages() {
  var image_cache = new Object();
  $("img.over").each(function(i) {
    var imgsrc = this.src;
    var dot = this.src.lastIndexOf('.');
    var imgsrc_on = this.src.substr(0, dot) + '_on' + this.src.substr(dot, 4);
    image_cache[this.src] = new Image();
    image_cache[this.src].src = imgsrc_on;
    $(this).hover(
      function() { this.src = imgsrc_on; },
      function() { this.src = imgsrc; });
  });
}

$(document).ready(initRollOverImages);



/*-----------------------------------------------------------
jquery-opacity-rollover.js　※class="opa"を付ければOK
-------------------------------------------------------------*/

$(document).ready(function(){
	$("img.opa").fadeTo(0,1.0);
	$("img.opa").hover(function(){
		$(this).fadeTo(200,0.4);
	},function(){
		$(this).fadeTo(200,1.0);
	});
}); 

/*=====================================================
meta: {
  title: "jquery-opacity-rollover.js",
  version: "2.1",
  copy: "copyright 2009 h2ham (h2ham.mail@gmail.com)",
  license: "MIT License(http://www.opensource.org/licenses/mit-license.php)",
  author: "THE HAM MEDIA - http://h2ham.seesaa.net/",
  date: "2009-07-21"
  modify: "2009-07-23"
}
=====================================================*/
(function($) {
	
	$.fn.opOver = function(op,oa,durationp,durationa){
		
		var c = {
			op:op? op:1.0,
			oa:oa? oa:0.2,
			durationp:durationp? durationp:'fast',
			durationa:durationa? durationa:'fast'
		};
		

		$(this).each(function(){
			$(this).css({
					opacity: c.op,
					filter: "alpha(opacity="+c.op*100+")"
				}).hover(function(){
					$(this).fadeTo(c.durationp,c.oa);
				},function(){
					$(this).fadeTo(c.durationa,c.op);
				})
		});
	},
	
	$.fn.wink = function(durationp,op,oa){

		var c = {
			durationp:durationp? durationp:'slow',
			op:op? op:1.0,
			oa:oa? oa:0.8
		};
		
		$(this).each(function(){
			$(this)	.css({
					opacity: c.op,
					filter: "alpha(opacity="+c.op*100+")"
				}).hover(function(){
				$(this).css({
					opacity: c.oa,
					filter: "alpha(opacity="+c.oa*100+")"
				});
				$(this).fadeTo(c.durationp,c.op);
			},function(){
				$(this).css({
					opacity: c.op,
					filter: "alpha(opacity="+c.op*100+")"
				});
			})
		});
	}
	
})(jQuery);
