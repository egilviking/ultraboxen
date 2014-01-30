/**
 * Made by Per Sjölin, persjolin90@gmail.com
 */
 

	 	// Variable to store images
	var $images,$dndimages;
	var $init = true;
	var $intervallId;
	var $intervallPaus = false;
	
	// Id of your drag n drop div. IMPORTANT
	var $dnd = $("#dragndrop");	
	
	// Slideshow
	var $rotateSlideshow = 2000; // 2 sec
	var $slideshowimagefade = 2000;
	
	// Lightbox
	var $lightboxfade	= 1000;
	
	// Loadingimage
	var $loadingimage = 1500;
	
	// Html
	var $htmldelay = 3000;
	var $htmlfade = 1500;
	
	// Forms
	var $formfade = 2500;
	var $submitfade = 1000;
/**
 *  Event functions 
 */
 
	// Grab the files and set them to our variable
	function prepareUpload(event)	{
		$images = event.target.files;
		$('#newimages h3#uploadFiles').hide();
		console.log('Upload has been touched.');
	}	
	
	// Catch the form submit and upload the files.
	function uploadPreview(event)	{
		console.log('Proccessing to preview images.');
		
		event.preventDefault(); // Totally stop stuff happening.

		// START A LOADING SPINNER HERE
		$('.spinnernewimages').fadeIn($loadingimage,function(){
			$(this).css('display', 'block');
		});
		//$('#newimages img .spinner').hide();
		
		// Create a formdata object and add the files.
		var data = new FormData();
		
		//Iterates trough each image.
		$.each($images, function(key, value)	{
			data.append(key, value);
		});
		
		$.ajax({
			url: 'proccessimages.php?action=new',
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			success: successPreview,
		});
	}
		
	// Catch the drag n drop and upload the files.
	function dragdropUpload(event)	{

		console.log('Drops.');
	  event.stopPropagation();
		event.preventDefault(); // Totally stop stuff happening.
		
		//Style dragndrop div.
		$('#dragndrop').css('border', '2px dotted #0B85A1');
	
		// START A LOADING SPINNER HERE
		$('.spinnernewimages').fadeIn($loadingimage,function(){
			$(this).css('display', 'block');
		});
		//$('#newimages img .spinner').hide();
		
		$dndimages = event.originalEvent.dataTransfer.files;

		// Create a formdata object and add the files.
		var data = new FormData();
		
		//Iterates trough each image.
		$.each($dndimages, function(key, value)	{
			data.append(key, value);
		});
		
		$.ajax({
			url: 'proccessimages.php?action=new',
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			success: successPreview,
		});
	}
	
	// Catch the form submit and upload the files.
	function uploadFiles(event)	{
		event.preventDefault(); // Totally stop stuff happening.
		console.log('Proccessing to upload the images.');
		
		$.ajax({
			url: 'proccessimages.php?action=save',
			type: 'post',
			data: $("form").serialize(),
			cache: false,
			dataType: 'json',
			success: successUpload,
		});
	}
	
	// Load form to the image.
	function showForm(e)	{
		e.preventDefault();
		
		if( $('#images img').hasClass('current') ){
			//Remove form.
			$('#images form[name="updateImage"]').fadeOut($formfade,function() {
				$('#images form[name="updateImage"]').remove();
			});
			$('#images img').removeClass('current');
			console.log('remove form');
		}else{
			var $id = $(this).attr('id');
			console.log('Get image form id: ' + $id);
			// START A LOADING SPINNER HERE	
			$.ajax({
				url: 'proccessimages.php?action=loadimageform',
				type: 'post',
				data: {id:$id},
				cache: false,
				dataType: 'json',
				success: successLoadImageForm,
			});
		}
	}
	
	// Load form to the image.
	function updateImage(e)	{
		e.preventDefault();
		console.log('Updating image');
	
		$.ajax({
			url: 'proccessimages.php?action=updateimage',
			type: 'post',
			data: $(this).serialize(),
			cache: false,
			dataType: 'json',
			success: successUpdateImage,
		});
	}

	// Load form to the image.
	function deleteImage(e)	{
		e.preventDefault();
		console.log('Deleting image');
	
		$.ajax({
			url: 'proccessimages.php?action=deleteimage',
			type: 'post',
			data: $("form[name='updateImage']").serialize(),
			cache: false,
			dataType: 'json',
			success: successDeletingImage,
		});
	}
	

	/**
 *	On success functions 
 */
	 
	//Success preview
	var successPreview =  function(data) {
		$('.spinnernewimages').fadeOut($loadingimage);
		console.log("Images: " + data.html);
		$('#newimages form')
		.hide()
		.html(data.html)
		.fadeIn($htmlfade);
		
		//Show new images message
		$('#newimages h3#uploadFiles')
		.hide()
		.removeClass()
		.addClass('blueinfo')
		.html('New images added: ' + data.totalimages)
		.fadeIn($htmlfade)
		.delay($htmldelay)
		.fadeOut($htmlfade,function() {
			$('#newimages h3#uploadFiles').remove();
		});
		
		//Show new images message
		$('#newimages h3.imgexists')
		.hide()
		.fadeIn($htmlfade)
		.delay($htmldelay)
		.fadeOut($htmlfade,function() {
			$('#newimages h3.imgexists').remove();
		});
		
		//Show error message
		$('#newimages h3.imgerror')
		.hide()
		.fadeIn($htmlfade)
		.delay($htmldelay)
		.fadeOut($htmlfade,function() {
			$('#newimages h3.imgerror').remove();
		});
		
		$('.preview').addClass('red').show()
		.attr({
			disabled:"disabled",
			value:"Please fill the inputs"
		});
		
		console.log("Errors: " + data.error);
		console.log("Information: " + data.information);
		console.log("Successfull Ajax Request, successPreview");
	};
	
	//Success uploading
	var successUpload =  function(data) {
		console.log("Successfull Ajax Request, successUpload");
		
		//Clean the preview images div and show success message.
		$('#newimages').children().fadeOut($htmlfade,function(){
			$('#newimages h3#uploadFiles')
				.removeClass()
				.addClass('greeninfo')
				.html('Upload Complete')
				.fadeIn($htmlfade)
				.delay($htmldelay)
				.fadeOut($htmlfade,function() {
					$('#newimages h3#uploadFiles').remove();
				});
		});		
		loadImages();
	};

	//Success loading images
	var successLoadImages =  function(data) {
		console.log("Successfull Ajax Request, successLoadImages");
		$('#images').html(data.html);
	};
	
	//Success loading image form
	var successLoadImageForm =  function(data) {
		console.log("Successfull Ajax Request, successLoadImageForm");
		var $id;
		$id = data.information;
		console.log('Look for id = #' + $id);
		$('#images').find('img[id="'+$id+'"]').addClass('current');
		
		$(data.html).hide().insertAfter('.current').fadeIn($htmlfade);

	};

	//Success updating images
	var successUpdateImage =  function(data) {
		console.log("Successfull Ajax Request, successUpdateImage");
	
		//Show new images message
		if( $('h3#changeImages').length )	{
			$('h3#changeImages').remove().hide();
			$('#images').prepend('<h3 id="changeImages"> Action: ' + data.html + '</h3>');
			$('#images h3#changeImages').hide().addClass('blueinfo').fadeIn($htmlfade).delay($htmldelay).fadeOut($htmlfade);
		}
		else{
			$('#images').prepend('<h3 id="changeImages"> Action: ' + data.html + '</h3>');
			$('#images h3#changeImages').hide().addClass('blueinfo').fadeIn($htmlfade).delay($htmldelay).fadeOut($htmlfade);
		}
		
		$('#images form[name="updateImage"]').fadeOut($formfade, function(){
			$('#images form[name="updateImage"]').remove();
		});
		$('#images img').removeClass('current');
	};

	//Success deleting image
	var successDeletingImage =  function(data) {
		console.log("Successfull Ajax Request, successDeletingImage");
		// Load existing images.
		
		//Show new images message
		if( $('h3#changeImages').length )	{
			$('h3#changeImages').remove().hide();
			$('#images').prepend('<h3 id="changeImages"> Action: ' + data.html + '</h3>');
			$('#images h3#changeImages').hide().addClass('blueinfo').fadeIn($htmlfade).delay($htmldelay).fadeOut($htmlfade);
		}
		else{
			$('#images').prepend('<h3 id="changeImages"> Action: ' + data.html + '</h3>');
			$('#images h3#changeImages').hide().addClass('blueinfo').fadeIn($htmlfade).delay($htmldelay).fadeOut($htmlfade);
		}
		
		//Remove deleted img from images
		console.log('removing img and fade out');
		$('form[name="updateImage"]').fadeOut(1500,function (){
			$('.current').fadeOut(300, function() { $(this).remove(); $('form[name="updateImage"]').remove(); });
		});
	};
	
	//Success loading slideshow images
	var successLoadSlideshowImages = function(data) {
		console.log("Successfull Ajax Request, LoadSlideshowImages");
		
		//Throw the img's into place.
		$('#slideshow').html(data.html);
		
		//Start the slideshow
		slideshowInit();
	};
		
	//Success loading gallery images
	var successLoadGalleryImages = function(data) {
		console.log("Successfull Ajax Request, LoadGalleryImages");
		
		//Throw the img's into place.
		$('.gallery-all').html(data.html);
		
		//Load the gallery.
		galleryInit();
	};
	
/**
 * Initializing functions
 */
	 
	// Load exisiting images.
	function loadImages()	{
		console.log('Loading exisiting images...');
		
		$.ajax({
			url: 'proccessimages.php?action=loadimages',
			type: 'post',
			cache: false,
			dataType: 'json',
			success: successLoadImages,
		});
	} 
	
	// Load slideshow images.
	function loadGalleryImages()	{
		console.log('Loading gallery images...');
		
		$.ajax({
			url: 'proccessimages.php?action=loadgallery',
			type: 'post',
			cache: false,
			dataType: 'json',
			success: successLoadGalleryImages,
		});
	} 
	
	// Load slideshow images.
	function loadSlideshowImages()	{
		console.log('Loading slideshow images...');
		
		$.ajax({
			url: 'proccessimages.php?action=loadslideshow',
			type: 'post',
			cache: false,
			dataType: 'json',
			success: successLoadSlideshowImages,
		});
	} 
	
	// The slideshow 
  function slideshowInit() {
    
		var numberImages =  $('#slideshow img').length,
      currentImage = numberImages - 1,
			
    // Get current z-index for the slideshow and stack all images above this z-index
      zIndex = parseInt($('#slideshow').css('z-index')),
      currentZIndex = zIndex;
    
			// Fore each image, set it up.
			$('#slideshow img')
				.each(function() { 
				
					// Use i to set the z-index of the image, stack them on top of each other
					$(this)
						.attr('src', $(this).attr('src'))
						.css('z-index', currentZIndex++);
						//console.log("Z INDEX: " + currentZIndex);	
			});

    // Function to rotate images
    var rotateImages = function() {
      // Fade out current image and reorder z-index
      $('#slideshow img')
        .eq(currentImage)
        .fadeOut('slow', function() {
          $(this)
            .css('z-index', zIndex)
            .fadeIn($slideshowimagefade)
            .siblings()
						.each(function() {
              $(this).css('z-index', ((parseInt($(this).css('z-index')) - zIndex + 1) % numberImages + zIndex));
          });
        });
      currentImage = (numberImages + currentImage - 1) % numberImages;
      console.log('Rotating pictures in slideshow.' + currentImage );
    };
    
		
		// To play/pause the slideshow intervall
    $intervallId = setInterval(function() {rotateImages();}, $rotateSlideshow);
		
		/*
		$('#slideshow').ready(function() {
     intervallId = setInterval(function() {rotateImages();}, 2500);
      console.log("Clicked to rotate slideshow.");
    });
		*/
		
    console.log("Slideshow was initiated.");
  };	
	
	// The gallery
	function galleryInit() {
		//Width and height calculations.
		var $useheight, $usewidth, $imgheight, $imgwidth, $boxheight, $boxwidth, $padding = 0;
		
		$('<img>')
			.addClass('selected')
			.attr({
			src: $('.gallery-all img:first').attr('src'),
			'data-title': $('.gallery-all img:first').attr('data-title'),
			'data-caption': $('.gallery-all img:first').attr('data-caption'),
			})
			.load(function(){
				$(this).prependTo($('.gallery-current'));
				
				$('.gallery-current').find('.selected').each(function(){
		
				//Get width and height of the box gallery current image will be.
				$boxheight = $('.gallery-current').height() - $padding;
				$boxwidth = $('.gallery-current').width()	- $padding;
				
				$imgheight = $(this).height();
				$imgwidth = $(this).width();
				
				//Height -Use the box height to fit the image inside the box.
				if($imgheight < $boxheight)	{ $useheight = $imgheight; console.log('Use img height: ' + $useheight);}
				else{ $useheight = $boxheight; console.log('Use box height : ' + $useheight);}
				
				//Width
				if($imgwidth < $boxwidth)	{ $usewidth = $imgwidth; console.log('Use img width : ' + $usewidth);}
				else{ $usewidth = $boxwidth; console.log('Use box width : ' + $usewidth);}
			
				if($useheight > $usewidth){ $useheight = $useheight/2;}
				
				$(this)
					.attr({
					'height' : $useheight,
					'width' : $usewidth,
					});
				});
			});

		console.log("Gallery was initiated.");
	};

	//Load existing, slideshow and gallery.
	var imagesInit = function(){
	
		// Load existing images.
		loadImages(); 
		
		// Load slideshow images and start slideshow.
		loadSlideshowImages();
		
		// Load slideshow images and start slideshow.
		loadGalleryImages();
	}; 
	
	
$(document).ready(function(){
  'use strict';

	/**
	 *  Event captures
	 */
	 
	$('.gallery-all').on('click','img',function(e){
		e.preventDefault();   //prevent the click from jumping esp on hashes
		e.stopPropagation();  //prevent from any parent click handlers that didn't prev
		
		//Width and height calculations.
		var $useheight, $usewidth, $imgheight, $imgwidth, $boxheight, $boxwidth;
		
		$('<img>')
		.addClass('selected')
		.attr({
			'src' : $(this).attr('src'),
			'data-title' : $(this).attr('data-title'),
			'data-caption' : $(this).attr('data-caption'),
		})
		.load(function(){
			
			$('.gallery-current').find('.selected').hide().remove();
			$(this).prependTo('.gallery-current');
			
			$('.gallery-current').find('.selected').each(function(){
		
				//Get width and height of the box gallery current image will be.
				$boxheight = $('.gallery-current').height();
				$boxwidth = $('.gallery-current').width();
				
				$imgheight = $(this).height();
				$imgwidth = $(this).width();
				
				//alert('Width: ' + $imgwidth + 'Height: ' + $imgheight);
					
				//Height -Use the box height to fit the image inside the box.
				if($imgheight < $boxheight)	{ $useheight = $imgheight; console.log('Use img height: ' + $useheight);}
				else{ $useheight = $boxheight; console.log('Use box height : ' + $useheight);}
				
				//Width
				if($imgwidth < $boxwidth)	{ $usewidth = $imgwidth; console.log('Use img width : ' + $usewidth);}
				else{ $usewidth = $boxwidth; console.log('Use box width : ' + $usewidth);}
			
				if($useheight > $usewidth){ $useheight = $useheight/2;}
				
				$(this)
				.attr({
					'height' : $useheight,
					'width' : $usewidth,
				});
			});
		});
	});
	
	$('.gallery-current .caption').hide();
	
	// Catch a click and show form below image.
	$('#images').on( 'click', 'img', showForm);
	
	// Browsing files
	$('input:file').on('change', prepareUpload);
	
	// Drag N Drop files
	$dnd.on('dragenter', function (e){
		console.log('Drag n Drop enter.');
		e.stopPropagation();
		e.preventDefault();
		$(this).css('border', '2px solid #0B85A1');
		$('#newimages h3#uploadFiles').fadeOut($htmlfade);
	});
	
	$dnd.on('dragover', function (e){
	  e.stopPropagation();
	  e.preventDefault();
	});
	
	// On drop do upload.
	$dnd.on('drop', dragdropUpload);

	// In case files being drop outside the div.
	$(document).on('dragenter', function (e) {
			e.stopPropagation();
			e.preventDefault();
	});
	
	$(document).on('dragover', function (e) {
		e.stopPropagation();
		e.preventDefault();
		$dnd.css('border', '2px dotted #0B85A1');
	});
	
	$(document).on('drop', function (e) {
			e.stopPropagation();
			e.preventDefault();
	});
	
	// Preview images
	$("form[name='uploadPreview']").submit(uploadPreview);
	
  // Get the form data and save the images with information to database
  $("form[name='uploadFiles']").submit(uploadFiles);

	// Catch update image form submit
	$("form[name='updateImage']").live('submit', updateImage);
	
	// Catch update image form submit
	$("input[name='delete']").live('click', deleteImage);
	
		// For the checkbox
	$('input[type=checkbox]').live('click', function(e){			
     if($(this).attr('checked')){
        $(this).val(1);
     }else{
        $(this).val(0);
     }
		console.log('CHECKBOX');
	});

	// Display the lightbox on current gallery image.
	$('.gallery-current').on('click','img', function() {
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
        'max-width':  windowWidth,
      })
      .load(function() {
        $('#lightbox')
          .css({
            'top':  (windowHeigth - $('#lightbox').height()) / 2,
            'left': (windowWidth  - $('#lightbox').width())  / 2
          })
          .fadeIn($lightboxfade);
      })
      .appendTo('#lightbox');
      
			console.log('LIGHTBOX Image clicked is : ' + $(this).attr('src'));
			var $title = $(this).attr('data-title');
			console.log('Title is : ' + $title);
			var $desc = $(this).attr('data-caption');
			console.log('Desc is : ' + $desc);
			var $html;
			
			$html = '<div class="caption"><div class="captionwrapper"><div class="title"><h5>' 
				+ $title + '</h5></div><div class="desc"><p>' 
				+ $desc + '</p></div></div></div>';

			$($html).appendTo('#lightbox').show();
				
      // Remove it all on click
      $('#overlay, #lightbox').click(function() {
        $('#overlay, #lightbox').	fadeOut($lightboxfade,function() { $(this).remove(); });
					console.log('Clicked to close, fading out.');
      });
	});
	
	// Display the lightbox on current gallery image.
	$('.gallery-current').on('hover',function(e) {
		
		console.log('Image hover: ' + $('img').attr('src'));
		
		var $title = $('.gallery-current img').attr('data-title');
		var $desc = $('.gallery-current img').attr('data-caption');
		var $html;
	
		console.log('Title is : ' + $title);
		console.log('Desc is : ' + $desc);
		
		$html = '<div class="captionwrapper"><div class="title"><h5>' 
		+ $title + '</h5></div><div class="desc"><p>' 
		+ $desc + "</p></div></div>";
	
	 $('.gallery-current .caption')
		
		.stop()
		.html($html)
		.animate({ height: 'toggle'});
	});
	
	// Make submit save button only show if inputs are true
	$('#newimages form').on('input',function() {

		var empty_flds = 0;
		$("#newimages .req").each(function() {
				if(!$.trim($(this).val())) {
						empty_flds++;
				}    
		});

		if (empty_flds) { 
			console.log('empty fields');
			$('.preview').fadeOut($submitfade, function(){
				$('.preview')
				  .removeClass('green')
					.addClass('red')
					.fadeIn($submitfade)
					.attr({
						disabled:"disabled",
						value:"Fill all the inputs"
					});	
			});	
		
		} else {
				console.log('fields');
				$('.preview').fadeOut($submitfade, function() {
					$('.preview')
				  .removeClass('red')
					.addClass('green')
					.attr('value','Save Images')
					.removeAttr('disabled')
					.fadeIn($submitfade)
				});
			}
	});
	
	// Fullscreen image click inside form
	$('#images').on('click','#link',function(e) {
		console.log('lightboxlink');
		e.preventDefault();
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
      .attr('src', $('#images .current').attr('src'))
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
          .fadeIn($lightboxfade);
      })
      .appendTo('#lightbox');
      
			console.log('LIGHTBOX Image clicked is : ' + $('#images .current').attr('src'));

			$('#lightbox')
			.hide()
			.fadeIn($lightboxfade);

			
      // Remove it all on click
      $('#overlay, #lightbox').click(function() {
        $('#overlay, #lightbox').	fadeOut(1000,function() { $(this).remove(); });
					console.log('Clicked to close, fading out.');
      });
	});
	
	// Fullscreen image click inside form
	$('#newimages').on('click','.link',function(e) {
		console.log('lightboxlink');
		e.preventDefault();
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
      .attr('src', $(this).attr('data-image'))
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
          .fadeIn($lightboxfade);
      })
      .appendTo('#lightbox');
      
			console.log('LIGHTBOX Image clicked is : ' + $(this).attr('data-image'));

			$('#lightbox')
			.hide()
			.fadeIn($lightboxfade);

			
      // Remove it all on click
      $('#overlay, #lightbox').click(function() {
        $('#overlay, #lightbox').	fadeOut(1000,function() { $(this).remove(); });
					console.log('Clicked to close, fading out.');
      });
	});
	
	//Call functions
	imagesInit();
});
	


