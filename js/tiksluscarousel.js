/* tikslus carousel (a fully resposive carousel) by Pushpendra Singh Chouhan : pushpendra.as400@gmail.com
version: 1.0.0
http://tikslus.com
*/
(function($){
   var TikslusCaraousel = function(element, options)
   {
        var carousel = $(element);
		var obj=this;
		var defaults = {
  
   
                current: 1,
                prev: "&laquo;",
               
                next: "&raquo;",
                type: 'slide', // can rotate,slide,custom
                autoplayInterval: 7000,
                animationInterval: 800,
                dotRatio: 0.02, //always in percentage a whole number 2% by default
                loader:'ajax-loader.gif',
                customAnimationClassIn: '',
                customAnimationClassOut: '',
                customAnimationCaption: '',
                captionAnimationInterval: 100,
				captionFontRatio:0.15,//always in percentage a whole number 15% by default
				width:0,
				height:0
            };
           
// Extend our default options with those provided.
 options = $.extend(defaults, options);
 
  
 var current=options.current;
var count=carousel.find("li").length;
var slider_nav;
var autoPlayHandler;
var ul = carousel.find("ul");

ul.hide(); //hide all li's until all images are loaded
carousel.append("<p class='preload'><img src='"+options.loader+"' border=0/>Loading Images</p>"); //create loader image

carousel.find(".preload").css({position:'absolute',top:"48%",left:"35%",backgroudColor:'#fff',textAlign:"center",color:'#000',padding:'0.5em'}).show();

            var addCaptions = function() {
                var li = carousel.find("ul").find("li");
                li.each(function() {
                    if ($(this).find("img").attr("caption")) {
                        var caption_html = $(this).find("img").attr("caption");
                        $(this).append("<div class='caption'></div>");
                        $(this).find(".caption").css({left: $(this).position().left + $(this).width() +  $(this).find(".caption").width() + "px",width:100/count +"%","word-wrap":"break-word"}).html(caption_html).hide();
						//we have set the caption font size in % which is 10% of the wrapper div
						//here caption div width is always same as of parent li
                    }
                });
            };
			
			    var showCaption = function(n) {
			
                var li = carousel.find("li:nth-child(" + n + ")");
                var caption = li.find(".caption");
				var slideleft=100/count;
                if (caption.hasClass("animated")) {
                    caption.removeClass("animated").removeClass(options.customAnimationCaption);
                }
				
				if (options.customAnimationCaption != '') {
				var l=li.position().left;
                    li.find(".caption").css({left:l+"px",fontSize:carousel.width()*options.captionFontRatio + "%"});
                    li.find(".caption").addClass(options.customAnimationCaption).addClass("animated").show();
					
					
                }else{
				
				
                    li.find(".caption").css({left: 101+"%",fontSize:carousel.width()*options.captionFontRatio + "%"}).show().animate({left: (options.current*slideleft - slideleft) + "%"}, 1500);
				
				
				}
				
				
				
				
				
				
				

				
				/*
                else if(options.type=="slide") {
				var slideleft=100/count;
				

				
                    li.find(".caption").css({left: 101+"%",fontSize:carousel.width()*options.captionFontRatio + "%"}).show().animate({left: (options.current*slideleft - slideleft) + "%"}, 1500);
                
				
				}else{
				li.find(".caption").css({left: "101%"}).show().animate({left: "1%"}, 1500);
				}
				*/

            };
			/* run any custom effect (css 3)  class  
			for this function to call user must set options.type='custom' and provide either customaAnimationClassIn or customAnimationClassOut or both
			*/
			
			var customEffect=function(start_from){
			if(start_from==options.current) return false;
			if (options.customAnimationClassIn != '' || options.customAnimationClassOut != '') {
			
			 
                var li_current = ul.find("li:nth-child(" + options.current + ")");
				  var li_to = ul.find("li:nth-child(" + start_from + ")");
				  li_to.css({left: 0, display: 'block'});
                    li_current.removeClass().addClass("animated").addClass(options.customAnimationClassOut);
				  
				      setTimeout(function() {
                     
                    li_current.hide();
                            li_to.removeClass().addClass("animated").addClass(options.customAnimationClassIn);
                    
                    }, 1000);
					       
					}else{ //if user has specified custom option but doesn't provide customAnimationclassIn and customAnimationClassOut paramter than just rotate the slide
					li_current.fadeOut("fast");
                    li_to.fadeIn("slow");
					}
					 options.current = start_from;
                if (options.current > count) {
                    options.current = 1;
                }
                hidenavbuttons();
                highlightDot();
			};
			
			/* this function is called if options.type='rotate'
			*/
			
			    var rotateTo = function(rotate_to) {
                
				var li_current = ul.find("li:nth-child(" + options.current + ")");
                //var li_current = ul.find("li:eq(" + (options.current - 1) + ")");
                var li_to = ul.find("li:nth-child(" + rotate_to + ")");
				li_current.fadeOut("fast");
                li_to.fadeIn("slow");
				
                options.current = rotate_to;
                if (options.current > count) {
                    options.current = 1;
                }
                hidenavbuttons();
                highlightDot();

            };
			
			/* public function can be called from outside */
			
			         this.scrollTo = function(start_from) {
			
                if (options.type == "slide") {
					var move_to = start_from;
                
            
                var li = ul.find("li:nth-child(" + move_to + ")");
                if (options.current == move_to)
                    return false;

                    var left = (move_to * 100) - 100;
                    
                      left = left * -1;
                    
                var caption = li.find("img").attr("caption");
                $(".caption").hide();//hide all captions
                li.find(".caption").html(caption);
                ul.animate({left: left + "%"}, options.animationInterval); //animate sliding
					options.current=move_to;
                    if (options.current > count) {
                        options.current = count;
                    }
				hidenavbuttons();
                highlightDot();
                } else if (options.type == "rotate") {
                    rotateTo(start_from);
                } else if(options.type=="custom") {
                    customEffect(start_from);
                }else{
				rotateTo(start_from);
				}

                setTimeout(function() {
                   showCaption(start_from);
                }, options.captionAnimationInterval*options.current);

            };
			
			/* highlight navigational dot */
		var highlightDot=function(){
		slider_nav.find(".nav").removeClass("selected");
		slider_nav.find(".nav:nth-child("+(options.current+1)+")").addClass("selected");
              
			};
			

		var autoScroll=function(){
		
			var moveto=options.current + 1;
                if (moveto > count) {
                    moveto = 1;
                }
               
                 obj.scrollTo(moveto);
            };
			
			
			//hide left nav if current slide is 1 and hide right nav if current slide is >=count

				var hidenavbuttons=function(){
				if(options.current<=1){carousel.find(".nav_left").hide(); return false;}
                if (options.current >= count) {
                    carousel.find(".nav_right").hide();
                    return false;
                }
				carousel.find(".nav_left").show();
				carousel.find(".nav_right").show();
				};
		
/* initialize caraousel */		
				
				var init_=function(){
			
				
				
				carousel.addClass("tiksluscarousel").css({"position": "relative",height:"auto"});
				//carousel.append("<span class='demo' style='position:absolute;bottom:1%'>Only for Demo</span>");
				//if user has provided width and height parameter appley it to image and wrapper				
				if(options.width>0 ){ //both parameters should be provided else only width will do the trick
				carousel.css({"max-width":options.width + "px"});
					ul.find("img").css({"max-width":options.width + "px",width:"100%",height:"auto"});
					}
				ul.css({"width": 100 * count + "%", "height": "100%"});
				ul.find("li").css({"width": 100 / count + "%", "height": "100%"});
  

			
			
			
			carousel.append("<div class='slider_nav'><ul></ul></div>");
            carousel.append("<div class='nav_left'><span>" + options.prev + "</span></div><div class='nav_right'><span>" + options.next + "</span></div>");

			slider_nav=carousel.find(".slider_nav");

				for(var i=0;i<count;i++) //create nav dots
				{
                carousel.find(".slider_nav").append("<div class='nav'></div>");
                carousel.find(".slider_nav").find(".nav").css({width:  carousel.width()*options.dotRatio + "px", height: carousel.width()*options.dotRatio + "px"});
				}

   
			//position slider nav
            var slider_navigation = carousel.find(".slider_nav");
            slider_navigation.css("right", "1%");
			//position next,prev button to center
			carousel.find(".nav_left").css({"left":"1%","top":"45%"});
			carousel.find(".nav_right").css({"right":"1%","top":"45%"});
			$(".slider_nav").hide();
			$(".nav_left").hide();
			$(".nav_right").hide();
			
							//preload all the images

                ul.find("img").each(function(i) {
                    var img_ = new Image();
                    img_.src = $(this).attr("src");
                    img_.onload = function() {
					
                   //  carousel.find(".preload span").html(i +" of " + count);   
                    }

                });
				
			carousel.find(".preload").remove();
			ul.show();
			$(".slider_nav").show();
			$(".nav_left").show();
			$(".nav_right").show()
			
			

			    addCaptions();
                if (options.current >= 1) {
				    if (options.type == "slide") {
                        ul.css({left: ((current * 100) - 100) * -1 + "%"}); //start from current li

                    } else {
                        carousel.find("ul").find("li").hide();
                        carousel.find("ul").find("li:nth-child(" + current + ")").fadeIn("fast");
                    }

                }

				highlightDot();

                hidenavbuttons();
                autoPlayHandler = setInterval(autoScroll, options.autoplayInterval);
                showCaption(options.current);

				};
				
				//call init_
				init_();
				
				/* all event based funcitons here */
				
				//click event for dots
				slider_nav.find(".nav").click(function(e) {
               
                var index = $(this).parent().children().index(this);
                
                obj.scrollTo(index);
				});
				
				/* click event for nav left and nav right arrow buttons */
				 carousel.find(".nav_left").click(function(e) {
               
					if(options.current==1){
                    return false;
					}
                obj.scrollTo(options.current - 1);
                
				});


				carousel.find(".nav_right").click(function(e){
                if (options.current == count) {
                    return false;
                }
                obj.scrollTo(options.current + 1);
				});
				
				
				/* slide on image click */
				carousel.find("img").click(function(e) {
				var half=carousel.width()/2;
				if(e.pageX<=half){
				if(options.current>1){
				obj.scrollTo(options.current-1);
				}
				}
				if(e.pageX>=half){
                   if (options.current < count) {
				obj.scrollTo(options.current+1);
						}
					}
			});
				
			/* if user mouse overs image or dots or left and right nav then, stop auto scrolling */
			
				carousel.find("img,.nav,.nav_left,.nav_right").mouseover(function(){
				window.clearInterval(autoPlayHandler);
				}).mouseout(function(){
				autoPlayHandler=setInterval(autoScroll,options.autoplayInterval);
					});
			
			/* if user resizes window try to resize navigation dots,navs and captions(font size) in order to make them responsive */
			
			$(window).resize(function(){

			carousel.find(".caption").css({fontSize:carousel.width()*options.captionFontRatio + "%"}); 
			carousel.find(".slider_nav .nav").css({width:  carousel.width()*options.dotRatio + "px", height: carousel.width()*options.dotRatio + "px"});
			});


	   
	 };

   $.fn.tiksluscarousel = function(options)
   {
       return this.each(function()
       {
           var element = $(this);
          
           // Return early if this element already has a plugin instance
           if (element.data('tiksluscaraousel')) return;

           // pass options to plugin constructor
           var tiksluscaraousel = new TikslusCaraousel(this, options);

           // Store plugin object in this element's data
           element.data('tiksluscaraousel', tiksluscaraousel);
       });
   };
})(jQuery);	 