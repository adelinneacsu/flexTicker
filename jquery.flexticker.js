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
        speed: 	250,
        align: ''
    };
    var methods = {
        init : function(init_options) {
            var element = $(this);
            var totalWidth=0;
            var options;
            var data = element.data('options');
            if (!data){
                options = $.extend(defaults, init_options);
            } else{
                options = $.extend(data, init_options);
            }
            if (element.css('font-size')){
                options.height = element.css('font-size').replace('px','');
            }

            data = element.data('options',{
                number: options.number,
                height: options.height,
                speed: 	options.speed,
                align: options.align
            });
            element.addClass('flexTicker');
            element.css('height', options.height+'px');
            loadTicker();
            function loadTicker(){
                element.attr('number-value',options.number);
                if (options.number == "00") {fticnum="00"
                }else {
                    var ticnum = options.number;
                    var fticnum = addCommas(ticnum);
                    if (ticnum==0) {fticnum='0';ticnum='0';}
                    if (options.align == 'right') {
                        fticnum = fticnum.split("").reverse().join("");
                        element.addClass('rightAlign');
                    }else if (options.align == 'left') {
                        element.addClass('leftAlign');
                    }else if (options.align == 'center') {
                        element.addClass('centerAlign');
                    }
                }
                addTicker(fticnum);
                setTimeout(function(){loadValues(ticnum, fticnum);},10);
            };

            //
            //  Load Values
            //

            function loadValues(ticnum, fticnum){
                if (ticnum) {
                    var s = String(fticnum);
                    for (i=s.length;i>=0; i--)
                    {
                        var onum=s.charAt(i);
                        element.children("div[rel='num"+i+"']").attr('value', onum);
                    }
                    if (options.align == 'center') {
                        element.css({width: s.length*element.children('.flexNumber').width(), margin:'auto'});
                    }
                    element.children('.flexNumber').each(function(){
                        var nval=$(this).attr('value');
                        if (!isNaN(nval)){
                            var nheight = Number(nval)*options.height*-1;
                            $(this).css({
                                'top':  nheight+'px',
                                'width': 'auto',
                                '-moz-transition': 'top '+nval*options.speed+'ms',
                                '-webkit-transition': 'top '+nval*options.speed+'ms',
                                '-0-transition': 'top '+nval*options.speed+'ms',
                                'transition': 'top '+nval*options.speed+'ms'
                            });
                            if (navigator.appName == 'Microsoft Internet Explorer'){
                                $(this).animate({top: nheight+'px'}, nval*options.speed);
                            }
                        }
                        if (nval==',' || nval=='.'){
                            $(this).css({
                                'top':  -options.height*10+'px',
                                '-moz-transition': 'none',
                                '-webkit-transition': 'none',
                                '-o-transition': 'none',
                                'transition': 'none',
                                'width': '5px'
                            });
                            if (navigator.appName == 'Microsoft Internet Explorer'){
                                $(this).css({top: -options.height*10+'px', width: '4px'});
                            }
                        }
                        $(this).css({                            
                            'line-height': options.height+'px',
                            'height':options.height*11+"px"
                        })

                    });
                }
            }

            //
            // Add Ticker
            //

            function addTicker(newnum) {
                var digitcnt = element.children(".flexNumber").size();
                var nnum = String(newnum).length;
                var digitdiff = Number(nnum - Number(digitcnt));
                if (digitdiff <0) {
                    var ltdig = (Number(nnum)-1);
                    element.children(".flexNumber:gt(" + ltdig + ")").remove();
                }
                for(i=1;i<=digitdiff;i++) {
                    element.append('<div class="flexNumber" rel="num' + (Number(digitcnt+i-1)) + '">0<br/>1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>,<br/></div>');
                    element.children('.flexNumber').css({                        
                        'line-height': options.height+'px',                  
                        'height':options.height*11+"px",
                        'top': '0'
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
        },
/*        
		scaleTicker : function(){
            var element = $(this);
            var options= element.data('options');
            options.height=element.css('font-size').replace('px','');
            var old_height=options.height;
            if (old_height!=options.height){
                element.css('height', options.height*options.height+'px');
                element.children('.flexNumber').each(function (){
                    $(this).css({                        
                        'line-height': options.height*options.height+'px',                        
                        'height':options.height*11*options.height+"px",
                        '-moz-transition': 'none',
                        '-webkit-transition': 'none',
                        '-o-transition': 'none',
                        'transition': 'none'
                    });
                    var mtop=$(this).css('top').replace('px','');
                    $(this).css({'top': (mtop/old_height)*options.height+'px'});

                })
            }
        },
*/
        destroy:function(){
            var element=$(this);
            element.removeClass('flexTicker');
            element.find('.flexNumber').remove();
            element.removeData('options');
            console.log("destroying flexticker");
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