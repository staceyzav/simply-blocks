// Simply Logo Slider — front-end animation
// Transform-based: JS position variable drives translateX on the track.
// Auto-scroll and drag share one variable — no scrollLeft conflicts.

( function() {
	'use strict';

	function initSlider( slider ) {
		if ( slider.dataset.slsInit ) return;
		slider.dataset.slsInit = 'true';

		var track = slider.querySelector( '.sls-track' );
		if ( ! track ) return;

		var logos = Array.prototype.slice.call( track.querySelectorAll( '.sls-logo' ) );
		if ( ! logos.length ) return;

		var setWidth = track.scrollWidth;
		if ( setWidth <= 0 ) return;

		// Clone enough sets to exceed the container width
		var sets = Math.max( 2, Math.ceil( ( slider.offsetWidth * 2 ) / setWidth ) + 1 );
		for ( var s = 0; s < sets; s++ ) {
			logos.forEach( function( logo ) {
				var clone = logo.cloneNode( true );
				clone.setAttribute( 'aria-hidden', 'true' );
				if ( clone.tagName === 'A' ) clone.setAttribute( 'tabindex', '-1' );
				track.appendChild( clone );
			} );
		}

		var speedRaw = getComputedStyle( slider ).getPropertyValue( '--sls-speed' ).trim();
		var speed    = parseFloat( speedRaw ) || 30;
		var pxPerMs  = setWidth / ( speed * 1000 );

		var position   = 0;
		var isHovered  = false;
		var isDragging = false;
		var startX     = 0;
		var posStart   = 0;
		var dragDist   = 0;
		var lastTs     = null;

		slider.classList.add( 'sls-slider--active' );

		function setPos( px ) {
			position = ( ( px % setWidth ) + setWidth ) % setWidth;
			track.style.transform = 'translateX(' + ( -position ) + 'px)';
		}

		function step( ts ) {
			if ( lastTs !== null && ! isHovered && ! isDragging ) {
				setPos( position + pxPerMs * ( ts - lastTs ) );
			}
			lastTs = ts;
			requestAnimationFrame( step );
		}

		requestAnimationFrame( step );

		slider.addEventListener( 'mouseenter', function() { isHovered = true; } );
		slider.addEventListener( 'mouseleave', function() {
			if ( ! isDragging ) isHovered = false;
		} );

		function dragStart( x ) {
			isDragging = true;
			isHovered  = true;
			startX     = x;
			posStart   = position;
			dragDist   = 0;
			slider.classList.add( 'is-dragging' );
		}
		function dragMove( x ) {
			if ( ! isDragging ) return;
			dragDist = Math.abs( x - startX );
			setPos( posStart + ( startX - x ) );
		}
		function dragEnd() {
			if ( ! isDragging ) return;
			isDragging = false;
			slider.classList.remove( 'is-dragging' );
			if ( ! slider.matches( ':hover' ) ) isHovered = false;
		}

		slider.addEventListener( 'mousedown',  function( e ) { dragStart( e.pageX ); } );
		window.addEventListener( 'mousemove',  function( e ) { dragMove( e.pageX ); } );
		window.addEventListener( 'mouseup',    dragEnd );
		slider.addEventListener( 'touchstart', function( e ) { dragStart( e.touches[0].pageX ); }, { passive: true } );
		slider.addEventListener( 'touchmove',  function( e ) { dragMove( e.touches[0].pageX ); }, { passive: true } );
		slider.addEventListener( 'touchend',   dragEnd );
		slider.addEventListener( 'click',      function( e ) { if ( dragDist > 5 ) e.preventDefault(); } );
	}

	window.addEventListener( 'load', function() {
		document.querySelectorAll( '[data-sls]' ).forEach( function( slider ) {
			initSlider( slider );
		} );
	} );

} )();
