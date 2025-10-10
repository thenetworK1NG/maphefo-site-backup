$(document).ready(function(){
	
	// Sport Catalogue filtering
	$('.filter-btn').on('click', function(){
		var $btn = $(this);
		var target = $btn.data('filter');

		// button state
		$('.filter-btn').removeClass('active').attr('aria-pressed', 'false');
		$btn.addClass('active').attr('aria-pressed', 'true');

		// cards
		var $cards = $('.make-3D-space');
		if(target === 'all') {
			$cards.stop(true, true).fadeIn(150).attr('aria-hidden', 'false');
		} else {
			$cards.each(function(){
				var $card = $(this);
				var sport = ($card.data('sport') || '').toString();
				if(sport === target) {
					$card.stop(true, true).fadeIn(150).attr('aria-hidden', 'false');
				} else {
					$card.stop(true, true).fadeOut(150).attr('aria-hidden', 'true');
				}
			});
		}
	});

	// Lift card and show stats on Mouseover
	$('.product-card').hover(function(){
			$(this).addClass('animate');
			$(this).find('div.carouselNext, div.carouselPrev').addClass('visible');			
		 }, function(){
			// remove animate state
			$(this).removeClass('animate');			
			// hide carousel arrows
			$(this).find('div.carouselNext, div.carouselPrev').removeClass('visible');

			// if any select inside this card is open, blur it so native dropdown closes
			$(this).find('select').each(function(){
				try { this.blur(); } catch(e) { /* ignore */ }
			});
	});	
	
	// Flip card to the back side
	$('.view_details').click(function(){
		var $card = $(this).closest('.product-card');
		
		$card.find('div.carouselNext, div.carouselPrev').removeClass('visible');
		$card.addClass('flip-10');
		
		setTimeout(function(){
			$card.removeClass('flip-10').addClass('flip90').find('div.shadow').show().fadeTo( 80 , 1, function(){
				$card.find('.product-front, .product-front div.shadow').hide();			
			});
		}, 50);
		
		setTimeout(function(){
			$card.removeClass('flip90').addClass('flip190');
			$card.find('.product-back').show().find('div.shadow').show().fadeTo( 90 , 0);
			setTimeout(function(){				
				$card.removeClass('flip190').addClass('flip180').find('div.shadow').hide();						
				setTimeout(function(){
					$card.css('transition', '100ms ease-out');			
					$card.find('.cx, .cy').addClass('s1');
					setTimeout(function(){$card.find('.cx, .cy').addClass('s2');}, 100);
					setTimeout(function(){$card.find('.cx, .cy').addClass('s3');}, 200);				
					$card.find('div.carouselNext, div.carouselPrev').addClass('visible');				
				}, 100);
			}, 100);			
		}, 150);			
	});			
	
	// Flip card back to the front side
	$('.flip-back').click(function(){
		var $card = $(this).closest('.product-card');
		
		$card.removeClass('flip180').addClass('flip190');
		setTimeout(function(){
			$card.removeClass('flip190').addClass('flip90');
	
			$card.find('.product-back div.shadow').css('opacity', 0).fadeTo( 100 , 1, function(){
				$card.find('.product-back, .product-back div.shadow').hide();
				$card.find('.product-front, .product-front div.shadow').show();
			});
		}, 50);
		
		setTimeout(function(){
			$card.removeClass('flip90').addClass('flip-10');
			$card.find('.product-front div.shadow').show().fadeTo( 100 , 0);
			setTimeout(function(){						
				$card.find('.product-front div.shadow').hide();
				$card.removeClass('flip-10').css('transition', '100ms ease-out');		
				$card.find('.cx, .cy').removeClass('s1 s2 s3');			
			}, 100);			
		}, 150);			
		
	});	

	
	/* ----  Image Gallery Carousel   ---- */
	
	// Initialize each carousel independently
	$('.carousel').each(function() {
		var $carousel = $(this);
		var $carouselUl = $carousel.find('ul');
		var carouselSlideWidth = 335;
		var carouselWidth = 0;	
		var isAnimating = false;
		
		// building the width of the carousel
		$carousel.find('li').each(function(){
			carouselWidth += carouselSlideWidth;
		});

		// Fishing shirt variant selector - update description text
		var fishingDescriptions = {
			'LONG_SLEEVE': 'Long sleeve fishing shirt - breathable, UV protection.',
			'SHORT_SLEEVE': 'Short sleeve fishing shirt - lightweight and quick-dry.',
			'COLLAR_LONG_SLEEVE_BUTTONS': 'Collar long sleeve with buttons - smart casual with full coverage.',
			'COLLAR_SHORT_SLEEVE_BUTTONS': 'Collar short sleeve with buttons - neat and comfortable.',
			'HOODIE_WITH_THUMB_CUFF': 'Hoodie with thumb cuff - added warmth and hand coverage.',
			'LONG_SLEEVE_HOODIE': 'Long sleeve hoodie - relaxed fit with hood for cooler weather.',
			'SHORT_SLEEVE_HOODIE': 'Short sleeve hoodie - casual layer with hood.'
		};

		// Jackets variant selector - update description text
		var jacketDescriptions = {
			'JACKET LADIES & MEN SHEPARD SKIN': 'Mens/Women jackets',
			'JACKET LADIES & MEN POLAR FLEECE': 'Polar fleece jacket - lightweight and insulating for everyday use.',
			'JACKET JUNIOR POLAR FLEECE': 'Junior polar fleece - cosy fit for younger sizes.'
		};

		// Hoodie variant selector - update description text
		var hoodieDescriptions = {
			'HOODIE NO POCKET - TRIACETATE': 'Mens/Women hoodies',
			'HOODIE NO POCKET - SOFT SHELL': 'Mens/Women hoodies',
			'HOODIE NO POCKET - BRUSHED FLEECE': 'Mens/Women hoodies',
			'HOODIE WITH POCKET - TRIACETATE': 'Mens/Women hoodies',
			'HOODIE WITH POCKET - SOFT SHELL': 'Mens/Women hoodies',
			'HOODIE WITH POCKET - BRUSHED FLEECE': 'Mens/Women hoodies'
		};

		// T-shirt variant selector - descriptions
		var tshirtDescriptions = {
			'STANDARD ROUND & VNECK': 'Mens/Women T-shirts',
			'SLIMFIT ROUND & VNECK': 'Mens/Women T-shirts',
			'STANDARD ROUND & VNECK LONG SLEEVE': 'Mens/Women T-shirts',
			'SLIMFIT ROUND & VNECK LONG SLEEVE': 'Mens/Women T-shirts'
		};

		// Rugby variant selector - descriptions
		var rugbyDescriptions = {
			'INSERT COLLAR STANDARD SLEEVE': 'Men/women Rugby shirts',
			'V-, ROUND- or RAISED NECK RAGLAN SLEEVE': 'Men/women Rugby shirts',
			'SLIMFIT STANDARD SLEEVE': 'Men/women Rugby shirts'
		};

		// Golfer variant selector - descriptions
		var golferDescriptions = {
			'STANDARD OR CUP SLEEVE': 'Mens/Women Golfer shirts',
			'STANDARD LONG SLEEVE': 'Mens/Women Golfer shirts',
			'SLIMFIT': 'Mens/Women Golfer shirts',
			'SLIMFIT LONG SLEEVE': 'Mens/Women Golfer shirts',
			'SLEEVELESS GOLFER SLIMFIT': 'Mens/Women Golfer shirts',
			'CUP SLEEVE GOLFER SLIMFIT': 'Mens/Women Golfer shirts'
		};

		$('#fishing-variant').on('change', function() {
			var val = $(this).val();
			var desc = fishingDescriptions[val] || 'Mens/Women fishing shirt';
			$('#fishing-description').text(desc);
		});

		// Jackets description update
		$('#jacket-variant').on('change', function() {
			var val = $(this).val();
			var desc = jacketDescriptions[val] || 'Mens/Women jackets';
			// find a suitable element to place jacket description; card 2 uses a simple <p>
			$('.product-card[data-card="2"] .stats-container p').text(desc);
		});

		// Price and size data for each variant
		var fishingPricing = {
			'MANDARIN LONG SLEEVE 1/4 ZIP': [
				['2-5YR','R240'],['6-8YR','R270'],['9-13YR','R290'],['XS-XL','R340'],['2XL-3XL','R360'],['4XL-6XL','R390'],['7XL-11XL','R430']
			],
			'MANDARIN SHORT SLEEVE 1/4 ZIP': [
				['2-5YR','R210'],['6-8YR','R240'],['9-13YR','R270'],['XXS-XL','R310'],['2XL-3XL','R340'],['4XL-6XL','R360'],['5XL-7XL','R400']
			],
			'GOLFER COLLAR LONG SLEEVE BUTTONS': [
				['2-5YR','R240'],['6-8YR','R270'],['9-13YR','R290'],['XS-XL','R340'],['2XL-3XL','R360'],['4XL-6XL','R390'],['7XL-11XL','R430']
			],
			'GOLFER COLLAR SHORT SLEEVE BUTTONS': [
				['2-5YR','R210'],['6-8YR','R240'],['9-13YR','R270'],['XS-XL','R310'],['2XL-3XL','R340'],['4XL-6XL','R360'],['7XL-11XL','R400']
			],
			'HOODIE WITH THUMB CUFF & BUFF': [
				['2-5YR','R310'],['6-8YR','R340'],['9-13YR','R360'],['XS-XL','R410'],['2XL-3XL','R430'],['4XL-6XL','R460'],['7XL-11XL','R500']
			],
			'MANDARIN LONG SLEEVE HOODIE 1/4 ZIP': [
				['2-5YR','R270'],['6-8YR','R300'],['9-13YR','R320'],['XS-XL','R370'],['2XL-3XL','R390'],['4XL-6XL','R420'],['7XL-11XL','R460']
			],
			'MANDARIN SHORT SLEEVE HOODIE 1/4 ZIP': [
				['2-5YR','R240'],['6-8YR','R270'],['9-13YR','R290'],['XXS-XL','R340'],['2XL-3XL','R360'],['4XL-6XL','R390'],['5XL-7XL','R420']
			]
		};

		// Hoodie price and size data (from user-provided table)
		var hoodiePricing = {
			'HOODIE NO POCKET - TRIACETATE': [
				['2-5YR','R280'],['6-8YR','R300'],['8-13YR','R320'],['XXS-XL','R390'],['2XL-3XL','R410'],['4XL-7XL','R470']
			],
			'HOODIE NO POCKET - SOFT SHELL': [
				['2-5YR','R320'],['6-8YR','R360'],['8-13YR','R370'],['XXS-XL','R480'],['2XL-3XL','R520'],['4XL-7XL','R610']
			],
			'HOODIE NO POCKET - BRUSHED FLEECE': [
				['2-5YR','R290'],['6-8YR','R310'],['8-13YR','R330'],['XXS-XL','R400'],['2XL-3XL','R430'],['4XL-7XL','R490']
			],
			'HOODIE WITH POCKET - TRIACETATE': [
				['2-5YR','R290'],['6-8YR','R310'],['8-13YR','R330'],['XXS-XL','R410'],['2XL-3XL','R460'],['4XL-7XL','R490']
			],
			'HOODIE WITH POCKET - SOFT SHELL': [
				['2-5YR','R330'],['6-8YR','R360'],['8-13YR','R380'],['XXS-XL','R490'],['2XL-3XL','R530'],['4XL-7XL','R610']
			],
			'HOODIE WITH POCKET - BRUSHED FLEECE': [
				['2-5YR','R300'],['6-8YR','R320'],['8-13YR','R330'],['XXS-XL','R430'],['2XL-3XL','R470'],['4XL-7XL','R500']
			]
		};

		// T-shirt price and size data
		var tshirtPricing = {
			'STANDARD ROUND & VNECK': [
				['2-5YR','R210'],['6-8YR','R240'],['10-13YR','R270'],['TS / XS-XL','R290'],['2XL-3XL','R300'],['4XL-6XL','R320'],['7XL-11XL','R370']
			],
			'SLIMFIT ROUND & VNECK': [
				['XXS-XL','R280'],['2XL-3XL','R300']
			],
			'STANDARD ROUND & VNECK LONG SLEEVE': [
				['XS-XL','R320'],['2XL-3XL','R330']
			],
			'SLIMFIT ROUND & VNECK LONG SLEEVE': [
				['XXS-XL','R320'],['2XL-3XL','R330']
			]
		};

		// Rugby price and size data
		var rugbyPricing = {
			'INSERT COLLAR STANDARD SLEEVE': [
				['3-8YR','R220'],['9-12YR','R230'],['R S - XL','R290'],['R 2L - 3XL','R340']
			],
			'V-, ROUND- or RAISED NECK RAGLAN SLEEVE': [
				['3-8YR','R220'],['9-12YR','R230'],['XS - XL','R290'],['2XL - 4XL','R340']
			],
			'SLIMFIT STANDARD SLEEVE': [
				['3XS - S','R280'],['M - XL','R320']
			]
		};

		// Golfer price and size data
		var golferPricing = {
			'STANDARD OR CUP SLEEVE': [
				['2-5YR','R230'],['6-8YR','R260'],['10-13YR','R290'],['XXS-XL','R320'],['2XL-3XL','R350'],['4XL-6XL','R370'],['7XL-11XL','R420']
			],
			'STANDARD LONG SLEEVE': [
				['2-5YR','R260'],['6-8YR','R290'],['10-13YR','R300'],['XXS-XL','R340'],['2XL-3XL','R360'],['4XL-6XL','R390'],['7XL-11XL','R430']
			],
			'SLIMFIT': [
				['XXS-XL','R320'],['2XL-3XL','R350']
			],
			'SLIMFIT LONG SLEEVE': [
				['XXS-XL','R340'],['2XL-3XL','R360']
			],
			'SLEEVELESS GOLFER SLIMFIT': [
				['X XS-L','R280'],['XL-2XL','R300']
			],
			'CUP SLEEVE GOLFER SLIMFIT': [
				['XXS-XL','R320'],['2XL-4XL','R340'],['5XL-7XL','R370']
			]
		};

		// Jackets price and size data
		var jacketPricing = {
			'JACKET LADIES & MEN SHEPARD SKIN': [
				['12-14YR','R480'],['XS-L','R830'],['XL-2XL','R990'],['3XL-4XL','R1100']
			],
			'JACKET LADIES & MEN POLAR FLEECE': [
				['12-14YR','R470'],['XS-L','R730'],['XL-2XL','R900'],['3XL-4XL','R990']
			],
			'JACKET JUNIOR POLAR FLEECE': [
				['2-4YR','R400'],['5-7YR','R430'],['9-10YR','R450']
			]
		};

		function populateSizesForVariant(variant) {
			var sizes = fishingPricing[variant] || [];
			var $size = $('#fishing-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			// Update displayed sizes list (no separate visible list now)
			// select first size by default
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 1 when variant changes
				$('.product-card[data-card="1"] .product_price').text(sizes[0][1]);
			}
		}

		function populateJacketSizesForVariant(variant) {
			var sizes = jacketPricing[variant] || [];
			var $size = $('#jacket-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 2 when variant changes
				$('.product-card[data-card="2"] .product_price').text(sizes[0][1]);
			}
		}

		function populateHoodieSizesForVariant(variant) {
			var sizes = hoodiePricing[variant] || [];
			var $size = $('#hoodie-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 3 when variant changes
				$('.product-card[data-card="3"] .product_price').text(sizes[0][1]);
			}
		}

		function populateTshirtSizesForVariant(variant) {
			var sizes = tshirtPricing[variant] || [];
			var $size = $('#tshirt-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 4 when variant changes
				$('.product-card[data-card="4"] .product_price').text(sizes[0][1]);
			}
		}

		function populateRugbySizesForVariant(variant) {
			var sizes = rugbyPricing[variant] || [];
			var $size = $('#rugby-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 5 when variant changes
				$('.product-card[data-card="5"] .product_price').text(sizes[0][1]);
			}
		}

		function populateGolferSizesForVariant(variant) {
			var sizes = golferPricing[variant] || [];
			var $size = $('#golfer-size');
			$size.empty();
			sizes.forEach(function(pair){
				var sizeLabel = pair[0];
				var price = pair[1];
				var option = $('<option>')
					.val(price)
					.text(sizeLabel + ' / ' + price);
				$size.append(option);
			});
			if(sizes.length){
				$size.val(sizes[0][1]);
				// update top green price for card 6 when variant changes
				$('.product-card[data-card="6"] .product_price').text(sizes[0][1]);
			}
		}

		// Initialize sizes for the default selected variant on load
		populateSizesForVariant($('#fishing-variant').val());
		// Initialize jackets sizes for default selected jacket variant
		if($('#jacket-variant').length){
			populateJacketSizesForVariant($('#jacket-variant').val());
		}
		// Initialize hoodies sizes for default selected hoodie variant
		if($('#hoodie-variant').length){
			populateHoodieSizesForVariant($('#hoodie-variant').val());
		}
		// Initialize tshirt sizes for default selected tshirt variant
		if($('#tshirt-variant').length){
			populateTshirtSizesForVariant($('#tshirt-variant').val());
		}
		// Initialize rugby sizes for default selected rugby variant
		if($('#rugby-variant').length){
			populateRugbySizesForVariant($('#rugby-variant').val());
		}
		// Initialize golfer sizes for default selected golfer variant
		if($('#golfer-variant').length){
			populateGolferSizesForVariant($('#golfer-variant').val());
		}

		// When variant changes, repopulate sizes and set price
		$('#fishing-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateSizesForVariant(variant);
			// update description as well
			var desc = fishingDescriptions[variant] || 'Mens/Women fishing shirt';
			$('#fishing-description').text(desc);
		});

		// When jacket variant changes, repopulate jacket sizes and set price
		$('#jacket-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateJacketSizesForVariant(variant);
			var desc = jacketDescriptions[variant] || 'Mens/Women jackets';
			$('.product-card[data-card="2"] .stats-container p').text(desc);
		});

		// When hoodie variant changes, repopulate hoodie sizes and set price
		$('#hoodie-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateHoodieSizesForVariant(variant);
			var desc = hoodieDescriptions[variant] || 'Mens/Women hoodies';
			$('.product-card[data-card="3"] .stats-container p').text(desc);
		});

		// When tshirt variant changes, repopulate tshirt sizes and set price
		$('#tshirt-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateTshirtSizesForVariant(variant);
			var desc = tshirtDescriptions[variant] || 'Mens/Women T-shirts';
			$('.product-card[data-card="4"] .stats-container p').text(desc);
		});

		// When rugby variant changes, repopulate rugby sizes and set price
		$('#rugby-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateRugbySizesForVariant(variant);
			var desc = rugbyDescriptions[variant] || 'Men/women Rugby shirts';
			$('.product-card[data-card="5"] .stats-container p').text(desc);
		});

		// When golfer variant changes, repopulate golfer sizes and set price
		$('#golfer-variant').on('change.variant', function(){
			var variant = $(this).val();
			populateGolferSizesForVariant(variant);
			var desc = golferDescriptions[variant] || 'Mens/Women Golfer shirts';
			$('.product-card[data-card="6"] .stats-container p').text(desc);
		});

		// When size changes, update displayed price
		$('#fishing-size').on('change', function(){
		var price = $(this).val();
		// update the green price inside the card front for card 1
		$('.product-card[data-card="1"] .product_price').text(price);
		});

		// When jacket size changes, update displayed price for card 2
		$('#jacket-size').on('change', function(){
		var price = $(this).val();
		$('.product-card[data-card="2"] .product_price').text(price);
		});

		// When hoodie size changes, update displayed price for card 3
		$('#hoodie-size').on('change', function(){
		var price = $(this).val();
		$('.product-card[data-card="3"] .product_price').text(price);
		});

		// When tshirt size changes, update displayed price for card 4
		$('#tshirt-size').on('change', function(){
		var price = $(this).val();
		$('.product-card[data-card="4"] .product_price').text(price);
		});

		// When rugby size changes, update displayed price for card 5
		$('#rugby-size').on('change', function(){
		var price = $(this).val();
		$('.product-card[data-card="5"] .product_price').text(price);
		});

		// When golfer size changes, update displayed price for card 6
		$('#golfer-size').on('change', function(){
		var price = $(this).val();
		$('.product-card[data-card="6"] .product_price').text(price);
		});
		$carouselUl.css('width', carouselWidth);
		
		// Load Next Image
		$carousel.find('div.carouselNext').on('click', function(){
			var currentLeft = Math.abs(parseInt($carouselUl.css("left")));
			var newLeft = currentLeft + carouselSlideWidth;
			if(newLeft == carouselWidth || isAnimating === true){return;}
			$carouselUl.css({'left': "-" + newLeft + "px",
								   "transition": "300ms ease-out"
								 });
			isAnimating = true;
			setTimeout(function(){isAnimating = false;}, 300);			
		});
		
		// Load Previous Image
		$carousel.find('div.carouselPrev').on('click', function(){
			var currentLeft = Math.abs(parseInt($carouselUl.css("left")));
			var newLeft = currentLeft - carouselSlideWidth;
			if(newLeft < 0  || isAnimating === true){return;}
			$carouselUl.css({'left': "-" + newLeft + "px",
								   "transition": "300ms ease-out"
								 });
		    isAnimating = true;
			setTimeout(function(){isAnimating = false;}, 300);			
		});
	});
});