/**
 * Place your JS-code here.
 */
$(document).ready(function(){
  'use strict';
  $('#main img').click(function( event ) {
    var windowHeigth = window.innerHeight || $(window).height(), // make it work on ipad & android
        windowWidth  = window.innerWidth  || $(window).width();

    // Display the overlay
    $('<div id="overlay"></div>')
      .css('opacity', '0')
      .animate({'opacity' : '0.5'}, 'slow')
      .appendTo('body');
    
    // Create the lightbox container
    $('<div id="lightbox"></div>')
      .hide()
      .appendTo('body');
    
    // Display the image on load
    $('<img>')
      .attr('src', $(this).attr('src'))
      .css({
        'max-height': windowHeigth, 
        'max-width':  windowWidth
      })
      .load(function() {
        $('#lightbox')
          .css({
            'top':  (windowHeigth - $('#lightbox').height()) / 2,
            'left': (windowWidth  - $('#lightbox').width())  / 2
          })
          .fadeIn(1000);
      })
      .appendTo('#lightbox');
      
			console.log('Image clicked is : ' + $(this).attr('src'));
			var $title = $(this).attr('data-title');
			console.log('Title is : ' + $title);
			var $desc = $(this).attr('data-desc');
			console.log('Desc is : ' + $desc);
			
			$('<div class="caption"></div>')
			.html('<div class="title"><h5>' + $title + '</h5></div><div class="desc"><p>' + $desc + '</p><span>Click anywhere to close</span></div>')
			.appendTo('#lightbox');
			
      // Remove it all on click
      $('#overlay, #lightbox').click(function() {
        $('#overlay, #lightbox').	fadeOut(1000,function() { $(this).remove(); });
					console.log('Clicked to close, fading out.');
      });
  });
});