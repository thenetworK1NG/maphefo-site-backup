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
			$(this).removeClass('animate');			
			$(this).find('div.carouselNext, div.carouselPrev').removeClass('visible');
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