/* tikslus carousel (a fully resposive carousel) by Pushpendra Singh Chouhan : pushpendra.as400@gmail.com
version: 2.0.0 
version 2 release date: 3 june 2014
http://tikslus.com
New Features in version 2.0
1. Thumbnails view 
2. Full Screen option (button gets visible on hover)
3. Added new effect: zoom
4. Added NavIcons
5. Added a  progress bar 
6. Added button to pause and resume slideshow (button gets visible on hover)
7. Shows current slide number (visible on hover)
*/
(function($){
   var TikslusCaraousel = function(element, options)
   {
        var carousel = $(element);
	//	var animating=false; //used in zoom effect
		var obj=this;
		var defaults = {
  
   
                current: 1,
                prev: "&laquo;",
               
                next: "&raquo;",
                  type: 'slide', // can rotate,slide and zoom (zoom is new in version 2.0)
                autoplayInterval: 10000,
                animationInterval: 800,
                dotRatio: 0.02, //always in percentage a whole number 2% by default
                loader:'ajax-loader.gif',
                customAnimationClassIn: '',
                customAnimationClassOut: '',
                customAnimationCaption: '',
                captionAnimationInterval: 100,
				captionFontRatio:0.15,//always in percentage a whole number 15% by default
				width:0,
				height:0,
				nav:'dots', //can be dots or thumbnails (thumbnails new in version 2.0)
				navIcons:true // new in version 2.0
							
            };
           
// Extend our default options with those provided.
 options = $.extend(defaults, options);
 
  
 var current=options.current;
var count=carousel.find("li").length;
var slider_nav;
var thumb_wt;
var paused=false;
var arr=['slide','rotate','zoom','dots','thumbnails'];
var autoPlayHandler;
carousel.find("ul").addClass("carousel");
var ul = carousel.find("ul.carousel");
ul.find("img").addClass("tslider");
var wrapper_wt=ul.find("li:first").width();

ul.hide(); //hide all li's until all images are loaded
carousel.append("<p class='preload'><img src='"+options.loader+"' border=0/>Loading Images</p>"); //create loader image

carousel.find(".preload").css({position:'absolute',top:"48%",left:"35%",backgroudColor:'#fff',textAlign:"center",color:'#000',padding:'0.5em'}).show();




            var addCaptions = function() {
              //  var li = carousel.find("ul").find("li");
			   var li = carousel.find("ul.carousel").find("li");
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
			};
			
			// Function to toggle fullscreen
var toggleFullScreen = function(i) {

  if (i.requestFullscreen) {
    i.requestFullscreen();
} else if (i.webkitRequestFullscreen) {
    i.webkitRequestFullscreen();
} else if (i.mozRequestFullScreen) {
    i.mozRequestFullScreen();
} else if (i.msRequestFullscreen) {
    i.msRequestFullscreen();
}

carousel.find(".op .fullscreenbutton").addClass("exit_fullscreenbutton");
			carousel.addClass("fullscreen");
			carousel.find(".block").remove();
			ul.find(".tslider").css({maxWidth:"100%"});
			carousel.find(".thumbnails_wrapper").addClass("fullscreen_thumbnails");

};
// End Toggle Full Screen
			
var cancelFullScreen = function(){
if (document.exitFullscreen) {
   document.exitFullscreen();
} else if (document.webkitExitFullscreen) {
   document.webkitExitFullscreen();
} else if (document.mozCancelFullScreen) {
   document.mozCancelFullScreen();
} else if (document.msExitFullscreen) {
   document.msExitFullscreen();
}

if(carousel.hasClass("fullscreen")){
			setWidth();
			carousel.removeClass("fullscreen");
			carousel.find(".thumbnails_wrapper").removeClass("fullscreen_thumbnails");
			carousel.find(".op .fullscreenbutton").removeClass("exit_fullscreenbutton");
			}
			

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
			
			var resetzoom=function(){
			
				
			      carousel.find("ul.carousel>li").css({ken:0,
                '-webkit-transform':'scale(1)',
                'transform':'scale(1)',
                '-ms-transform':'scale(1)'});
									
			carousel.find("li").stop(true,false);
				window.clearInterval(autoPlayHandler);
               ul.stop(true,false);	
			};
			
			
			var zoomEffect=function(rotate_to){
						
		ul.stop();
		ul.find("> li").show();
	
			var li_current = ul.find("li:nth-child(" + rotate_to  + ")");
		li_current.fadeIn("fast");
				 
					  
					  
					
		
		
			
		
        		var rnd=(Math.random() * 1) + 1;
				li_current.css({ken:1});
			
				li_current.animate({ ken:rnd  }, {
				start:function(){
				//animating=true;
				
				},
				
        step: function(now,fx)
        {
            $(this).css({
                '-webkit-transform':'scale('+now+')',
                'transform':'scale('+now+')',
                '-ms-transform':'scale('+now+')'});
        },duration:options.autoplayInterval/2,
complete:function() {
li_current.animate({ ken:1 }, {
        step: function(now,fx)
        {
            $(this).css({
                '-webkit-transform':'scale('+now+')',
                'transform':'scale('+now+')',
                '-ms-transform':'scale('+now+')'});
        },duration:options.autoplayInterval/3,
		complete:function(now,fx){
		 
		  		li_current.css({ken:0});
			carousel.find("ul.carousel > li").css({
                '-webkit-transform':'scale(1)',
                'transform':'scale(1)',
                '-ms-transform':'scale(1)'});

		},
		
		}
		
		);


}});
	 

slideTo(rotate_to);
			};
			
			
			var animateProgressBar=function(){
			var progressbar=carousel.find(".progress");
			   var currentProgress=progressbar.width();
			   progressbar.stop().animate({width:carousel.width()},options.autoplayInterval,function(){
			   
			 resetProgressBar();
			
			   }
			   );
			};
			
			var resetProgressBar=function(){
			var progressbar=carousel.find(".progress");
			progressbar.css({width:0});
			};
			
			var stopProgressBar=function(){
			var progressbar=carousel.find(".progress");
			progressbar.stop(true,false);
			};
			
			var slideTo=function(scroll_to){
					
			 var li = ul.find("li:nth-child(" + (scroll_to) + ")");
			  if (options.current == scroll_to)
                    return false;
					var left = (scroll_to * 100) -100;
					
					left = left * -1;
					 var caption = li.find("img").attr("caption");
					  $(".caption").hide();//hide all captions
					  ul.stop(true,true).animate({left: left + "%"}, options.animationInterval); //animate sliding
					
			hidenavbuttons();
                highlightDot();
				
			};
			
			
			/* public function can be called from outside */
			
			         this.scrollTo = function(start_from) {
				
				if(paused==true){return false;}
				
					start_from=parseInt(start_from);
				 	resetProgressBar();
					resetzoom();
					;
			 var li = ul.find("li:nth-child('" + start_from + "')");
			 	 animateProgressBar();
			 switch(options.type){
			 case "slide":
			slideTo(start_from);
				break;
				case "rotate":
				 rotateTo(start_from);
				break;

				
				case "custom":
				  customEffect(start_from);
				  break;
				 
				  case "zoom":
				 
				  zoomEffect(start_from);
				  break;
				  default:
				  rotateTo(start_from);
				
			 }

			
                setTimeout(function() {
                   showCaption(start_from);
                }, options.captionAnimationInterval*options.current);
				

				  options.current=start_from;
                    if (options.current > count) {
                        options.current = count;
                    }
				
				navIcons();
				setStats();
				//autoscroll			
				autoPlayHandler = setInterval(autoScroll, options.autoplayInterval); 
				hide_msg_();
            };
			
			var scrollNext=function(){
			var moveto=options.current + 1;
                if (moveto > count) {
                    moveto = 1;
                }
               
			   
                 obj.scrollTo(moveto);
			};
			var scrollPrev=function(){
			var moveto=options.current - 1;
                if (moveto < 1) {
                    moveto = 1;
                }
               
			   
                 obj.scrollTo(moveto);
			};
			
	

		var autoScroll=function(){
		
			var moveto=options.current + 1;
                if (moveto > count) {
                    moveto = 1;
                }
            
			 
                 obj.scrollTo(moveto);
				
            };
			

			
									/* highlight navigational dot */
		var highlightDot=function(){
		if(options.nav=="dots"){
		slider_nav.find(".nav").removeClass("selected");
		slider_nav.find(".nav:nth-child("+(options.current+1)+")").addClass("selected");
		}
              
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
		
		var setWidth=function(){
		//if user has provided width and height parameter appley it to image and wrapper				
				if(options.width>0 ){ //both parameters should be provided else only width will do the trick
				carousel.css({"max-width":options.width + "px"});
					ul.find("img").css({"max-width":options.width + "px",width:"100%",height:"auto"});
					}
		};
		
		
		var setStats=function(){
		carousel.find(".stats").html(options.current + " of " + count);
		};
		
		
					var thumbnailsScroller = function(elem){
var wrapper =	elem;

var thumbnails	= wrapper.find('.thumbnails');
var inactiveMargin = thumbnails.find("li:first").width();
wrapper.scrollLeft(thumbnails.outerWidth());
wrapper.bind('mousemove',function(e){
var wrapperWidth = wrapper.width();
var menuWidth = thumbnails.outerWidth() + 2 * inactiveMargin;
var left = (e.pageX - wrapper.offset().left) * (menuWidth - wrapperWidth) / wrapperWidth - inactiveMargin;
wrapper.scrollLeft(left);
});
} ;


var navIcons=function(){
var nav_left=carousel.find(".nav_left");
var nav_right=carousel.find(".nav_right");
if(options.current<=1){ ;nav_left.hide();}else{nav_left.show();}
if(options.current>=count){nav_right.hide();}else{nav_right.show();}
if(options.navIcons==true){
//nav_left.show();nav_right.show();
nav_right.find("span").hide();
nav_left.find("span").hide();
if(!nav_right.hasClass("navIcons")){nav_right.addClass("navIcons");}
if(!nav_left.hasClass("navIcons")){nav_left.addClass("navIcons");}
if(options.current<count){
var tn=parseInt(options.current) + 1;
if(!nav_right.hasClass("navIcons_next")){nav_right.addClass("navIcons_next");}
nav_right.html("").append(ul.find("li:nth-child("+(tn) + ")").html());
nav_right.find("img.tslider").removeClass("tslider");
}
if(options.current>1){
var tp=parseInt(options.current-1);
if(!nav_left.hasClass("navIcons_prev")){nav_left.addClass("navIcons_prev");}
nav_left.html("").append(ul.find("li:nth-child("+(tp) + ")").html());
nav_left.find("img.tslider").removeClass("tslider");
}
}




};

//shows a message
var show_msg_=function(msg,type){
var m=carousel.find('.msg');
m.html('');
switch(type){
case 'info':
m.html(msg).removeClass().addClass("msg").addClass('info');
break;
case 'error':
m.html(msg).removeClass().addClass("msg").addClass('error');
break;
default:
m.html(msg).removeclass().addClass("msg").addClass('info');

}
m.css({top:0}).slideDown("fast");

};

var hide_msg_=function(){
carousel.find('.msg').hide().css({top:"-100px"});
};

		
/* initialize caraousel */		
				
				var init_=function(){
			
				setWidth();
				
				
				carousel.addClass("tiksluscarousel").css({"position": "relative",height:"auto"});
				//carousel.append("<span class='demo' style='position:absolute;bottom:1%'>Only for Demo</span>");
				
					
				ul.css({"width": 100 * count + "%", "height": "100%"});
				ul.find("li").css({"width": 100 / count + "%", "height": "100%"});
  
				carousel.append("<div class='progress'></div>");
			
			if(options.nav=="dots"){
			carousel.append("<div class='slider_nav'><ul></ul></div>");
			slider_nav=carousel.find(".slider_nav");

				for(var i=0;i<count;i++) //create nav dots
				{
                carousel.find(".slider_nav").append("<div class='nav'></div>");
                carousel.find(".slider_nav").find(".nav").css({width:  carousel.width()*options.dotRatio + "px", height: carousel.width()*options.dotRatio + "px"});
				}

   
			//position slider nav
            var slider_navigation = carousel.find(".slider_nav");
            slider_navigation.css("right", "1%");
			}
			carousel.append("<div class='msg'></div>");
			 carousel.append("<div class='nav_left'><span>" + options.prev + "</span></div><div class='nav_right'><span>" + options.next + "</span></div>");
			carousel.append("<div class='op'><div class='stats'></div><ul><li><a href='#' class='fullscreenbutton responsive_img'></a></li><li><a href='#' class='pausebutton responsive_img'></a></li></ul></div>");
			//position next,prev button to center
	    
		//error handling
		if(options.current>count || options.current<0){options.current=1;current=1;show_msg_("Invalid <b>Current</b> value. Reset to 1","error");}
		if($.inArray(options.type,arr)<=-1){show_msg_("Invalid <b>type</b> value. Reset to <b>rotate</b>","error");}
		if($.inArray(options.nav,arr,4)<=-1){show_msg_("Invalid <b>nav</b> value. Must be <b>dots</b> or <b>thumbnails</b>","error");}
		
		if(isNaN(options.animationInterval) || options.animationInterval<=0){show_msg_("Invalid <b>animationInterval</b> value. Must be > 0","error");}		
		if(isNaN(options.dotRatio) || (options.dotRatio<0.01 && options.dotRatio >0.1)){show_msg_("Invalid <b>dotRatio</b> value. Must be > 0.01 and < 0.1","error");}	
		if(isNaN(options.captionFontRatio) || (options.captionFontRatio<0.1 && options.captionFontRatio >1)){show_msg_("Invalid <b>captionFontRatio</b> value. Must be >= 0.1 and <= 1","error");}	
		if(isNaN(options.width) || options.width<0){show_msg_("Invalid <b>width</b> value. Must be >= 0","error");}
if(isNaN(options.height) || options.height<0){show_msg_("Invalid <b>height</b> value. Must be > 0","error");}		
if(isNaN(options.captionAnimationInterval) || options.captionAnimationInterval<=0){show_msg_("Invalid <b>captionAnimationInterval</b> value. Must be > 0","error");}			
		if(options.autoPlayInterval<=0){show_msg_("Invalid <b>autoPlayInterval</b> value. Must be > 0","error");}	
		$(".slider_nav").hide();
							//preload all the images

                ul.find("img").each(function(i) {
                    var img_ = new Image();
                    img_.src = $(this).attr("src");
                    img_.onload = function() {
					
                   //  carousel.find(".preload span").html(i +" of " + count);   
                    }

                });
				

			
				
				
			carousel.find(".preload").remove();
				if(options.nav=="thumbnails"){
				carousel.append("<div class='thumbnails_wrapper'><ul class='thumbnails'></ul></div>");
			//create thumbs and append them
			var thumbnails=carousel.find(".thumbnails_wrapper .thumbnails");
			
			
			
			ul.find("li").each(function(i){
			
			 thumb_wt=wrapper_wt/10;
			 
			thumbnails.append("<li class='thumb list_"+i+"' num='"+(i+1)+"'><a href='#' class='athumb'>"+$(this).html()+"</a></li>");
			var lt=carousel.find(".thumbnails .thumb:eq("+i+")");
			
			lt.css({width:thumb_wt + "px",display:'block'});
			lt.find("img").removeClass('tslider').addClass("responsive_img");
			thumbnails.css({width:count*thumb_wt + thumb_wt+ "px"});
			});
			
			
			
			}
		
			
			ul.show();
			$(".slider_nav").show();
	
	
			    addCaptions();
                if (options.current >= 1) {
				    if (options.type == "slide") {
                        ul.css({left: ((current * 100) - 100) * -1 + "%"}); //start from current li

                    } else {
                        carousel.find("ul.carousel >li").hide();
                        carousel.find("ul.carousel >li:nth-child(" + current + ")").fadeIn("fast");
                    }

                }

				highlightDot();

                hidenavbuttons();
				
		
                showCaption(options.current);
				thumbnailsScroller(carousel.find(".thumbnails_wrapper"));
				navIcons();
				setStats();
						
                autoPlayHandler = setInterval(autoScroll, options.autoplayInterval);
			animateProgressBar();
				};
				
				//call init_
				
				init_();
	   
				
				/* all event based funcitons here */
				
		
				
				//click event for dots
				if(options.nav=="dots"){
				slider_nav.find(".nav").click(function(e) {
               
                var index = $(this).parent().children().index(this);
                
                obj.scrollTo(index);
				});
				}
				
				/* click event for nav left and nav right arrow buttons */
				 carousel.find(".nav_left").click(function(e) {
               
					if(options.current==1){
                    return false;
					}
					/*
					if(animating==true){
					return false;
				}*/
				paused=false;
				carousel.find(".op .resumebutton").removeClass("resumebutton").addClass("pausebutton");
                obj.scrollTo(options.current - 1);
				});


				carousel.find(".nav_right").click(function(e){
				
                if (options.current == count) {
                    return false;
                }
				paused=false;
				carousel.find(".op .resumebutton").removeClass("resumebutton").addClass("pausebutton");
				 obj.scrollTo(parseInt(options.current + 1)) ;
				});
				
				
				/* slide on image click */
				carousel.find(".tslider").click(function(e) {
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
			
			carousel.find(".tslider").mouseenter(function(e){
							
			carousel.find(".op").fadeIn("fast");
			
			
			if(options.navIcons==true){ //animate navicons 
			carousel.find(".nav_right").stop().animate({right:0,opacity:1},1000);
			carousel.find(".nav_left").stop().animate({left:0,opacity:1},1000);
			}
			
			}).mouseleave(function(e){
		
			if(e.relatedTarget.tagName=="a" || e.relatedTarget.tagName=="A"){e.preventDefault();}else{
			carousel.find(".op").fadeOut("fast");}
			if(options.navIcons==true){
			carousel.find(".nav_right").stop().animate({right:-20,opacity:0.8},1000);
			carousel.find(".nav_left").stop().animate({left:-20,opacity:0.8},1000);
			}
			
			});
			
			
			
			carousel.find(".op  .fullscreenbutton").click(function(e){

			e.preventDefault();
			var button_=$(this);
			if(button_.hasClass("fullscreenbutton")){
			if(carousel.hasClass("fullscreen")){
			cancelFullScreen();
			}else{
			toggleFullScreen(element);
			} 
			}//fullscreen
			});
			
			carousel.find(".op .pausebutton, .op .resumebutton").click(function(e){
			e.preventDefault();
			var button_=$(this);
			if(button_.hasClass("pausebutton")){
			button_.addClass("resumebutton").removeClass("pausebutton");
			paused=true;
			stopProgressBar();
			window.clearInterval(autoPlayHandler);
			show_msg_("Paused","info");
			return ;
			}
			if(button_.hasClass("resumebutton")){
			autoPlayHandler=setInterval(autoScroll,options.autoplayInterval);
				animateProgressBar();
				paused=false;
				hide_msg_();
				button_.addClass("pausebutton").removeClass("resumebutton");
				return;
		}
			
			});
			
			
			
			
			
				
				carousel.find(".thumbnails li a").click(function(e){
				e.preventDefault();
				var num=parseInt($(this).closest("li.thumb").attr("num"));		
				paused=false;
				carousel.find(".op .resumebutton").removeClass("resumebutton").addClass("pausebutton");
				obj.scrollTo(num);
				
				});
	
								


function FullscrenONOFF()
{
    var checkFullscreen = ((typeof document.webkitIsFullScreen) !== 'undefined') ? document.webkitIsFullScreen : document.mozFullScreen;
    if (!checkFullscreen) 
        {//fullscreen is inactive
		 if(carousel.hasClass("fullscreen")){
			setWidth();
			carousel.removeClass("fullscreen");
			carousel.find(".thumbnails_wrapper").removeClass("fullscreen_thumbnails");
			carousel.find(".op .fullscreenbutton").removeClass("exit_fullscreenbutton");
			}             
        } 
   else {
           // code if fullscreen is active do nothing
        }

};
		
					
			
			/* if user resizes window try to resize navigation dots,navs and captions(font size) in order to make them responsive */
			
			$(window).resize(function(){

			carousel.find(".caption").css({fontSize:carousel.width()*options.captionFontRatio + "%"}); 
			carousel.find(".slider_nav .nav").css({width:  carousel.width()*options.dotRatio + "px", height: carousel.width()*options.dotRatio + "px"});
			//if carousel is in full screen mode and user press escape key (on pressing escape key window resizes)
	
			FullscrenONOFF();
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