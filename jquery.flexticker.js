/**
 * jQuery responsive odometer Ticker Plugin
 * Inspired by http://www.electriceasel.com/plugins/jquery/odoticker
 * and adapted by me as a responsive svg based jQuery plugin.
 * @name jquery.flexticker.js
 * @author Neacsu Adelin
 * @version 0.1
 * @date Oct 2, 2012
 * @category jQuery plugin
 * @copyright (c) 2012 Neacsu Adelin
 * @license Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)  - http://creativecommons.org/licenses/by-sa/3.0/
 */

(function($){
var defaults = {
	number: 99999,
	height: 30,
	speed: 	250,
	width: 20,		
	scale: 1
};

var options;

var methods = {
	init : function(init_options) {
		var element = this;
		options = $.extend(defaults, init_options);
		$(element).each(function(){        
			element.addClass('flexTicker');		
			loadTicker();		
			function loadTicker(){
				var ticnum = options.number;
				var fticnum = addCommas(ticnum);        	
				if (ticnum==0) {fticnum='0';ticnum='0';}
				addTicker(fticnum);
				setTimeout(function(){loadValues();},10);
				//loadValues();
				function loadValues(){
					if (ticnum) {
						var s = String(fticnum);
						for (i=s.length;i>=0; i--)
						{
							var onum=s.charAt(i);
							element.children("div[rel='num"+i+"']").attr('value', onum);
						}
						element.children('.flexNumber').each(function(){
							var nval=$(this).attr('value');
							if (!isNaN(nval)){
								var nheight = Number(nval)*options.height*-1;						
								$(this).css({
									'transform':'translateY('+nheight*options.scale+'px)',
									'-moz-transform': 'translateY('+nheight*options.scale+'px)', 
									'-webkit-transform': 'translateY('+nheight*options.scale+'px)', 
									'-o-transform': 'translateY('+nheight*options.scale+'px)',
									'-moz-transition': '-moz-transform '+nval*options.speed+'ms',									
									'transition': 'transform '+nval*options.speed+'ms',
									'-webkit-transition': '-webkit-transform '+nval*options.speed+'ms',
									'-o-transition': '-o-transform '+nval*options.speed+'ms'						
								});
								if (navigator.appName == 'Microsoft Internet Explorer'){
									$(this).animate({top: nheight*options.scale+'px'}, 10*options.speed);
								}
							}
							if (nval==',' || nval=='.'){
								$(this).css({
									'transform':'translateY('+(-options.height*10)*options.scale+'px)',
									'-moz-transform': 'translateY('+(-options.height*10)*options.scale+'px)', 
									'-webkit-transform': 'translateY('+(-options.height*10)*options.scale+'px)', 
									'-o-transform': 'translateY('+(-options.height*10)*options.scale+'px)',
									'-ms-transform': 'translateY('+(-options.height*10)*options.scale+'px)'							
								});						
								if (navigator.appName == 'Microsoft Internet Explorer'){
									$(this).animate({top: -options.height*10*options.scale+'px'}, 10*options.speed);
								}
							}
							$(this).css({
								'width':options.width*options.scale+"px",
								'height':options.height*11*options.scale+"px",			
								'background-size': options.width*options.scale+"px"
							})
						});
					}
				}
			};			
			function addTicker(newnum) {
				var digitcnt = element.children(".flexNumber").size();
				var nnum = String(newnum).length;
				var digitdiff = Number(nnum - Number(digitcnt));
				if (digitdiff <0) {
					var ltdig = (Number(nnum)-1);
					element.children(".flexNumber:gt(" + ltdig + ")").remove();
				}
				for(i=1;i<=digitdiff;i++) {
					element.append('<div class="flexNumber" rel="num' + (Number(digitcnt+i-1)) + '">&nbsp;</div>');
					$('.flexNumber').css({
						'width':options.width*options.scale+"px",
						'height':options.height*11*options.scale+"px",			
						'background-size': options.width*options.scale+"px"						
					})
				}
			}			
			function addCommas(nStr) {
				nStr += '';
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				return x1 + x2;
			}
		});
	},
	scaleTicker : function(){
		function getScale(){		
			var scale=$(window).width()/1000;
			scale=scale.toFixed(1);
			return scale;
		}
		function getTransformY(obj) {
			var matrix = obj.css("-webkit-transform") ||
			obj.css("-moz-transform")    ||
			obj.css("-ms-transform")     ||
			obj.css("-o-transform")      ||
			obj.css("transform");
			if(matrix !== 'none') {
				var values = matrix.split('(')[1].split(')')[0].split(',');
				var y = values[5];							
			} 
			return y;
		}
		var old_scale=options.scale;		
		options.scale=getScale();
		if (old_scale!=options.scale){
			$('.flexTicker').css('height',options.height*options.scale+'px');
			$('.flexNumber').each(function (){
				var mtop=getTransformY($(this));
				$(this).css({
					'width':options.width*options.scale+"px",
					'height':options.height*11*options.scale+"px",				
					'background-size': options.width*options.scale+"px"
					});				
				$(this).css({
					'transform':'translateY('+(mtop/old_scale)*options.scale+'px)',
					'-moz-transform': 'translateY('+(mtop/old_scale)*options.scale+'px)', 
					'-webkit-transform': 'translateY('+(mtop/old_scale)*options.scale+'px)', 
					'-o-transform': 'translateY('+(mtop/old_scale)*options.scale+'px)',
					'-ms-transform': 'translateY('+(mtop/old_scale)*options.scale+'px)',
					'-moz-transition': 'none'
				});	
				if (navigator.appName == 'Microsoft Internet Explorer'){
					mtop=$(this).css('top').replace('px','');
					$(this).css({'top': (mtop/old_scale)*options.scale+'px'});
				}
			})
		}
	}			
};

$.fn.flexTicker = function(methodOrOptions) {
	if ( methods[methodOrOptions] ) {
		return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
		// Default to "init"
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.flexTicker' );
	}    
};    
})(jQuery);