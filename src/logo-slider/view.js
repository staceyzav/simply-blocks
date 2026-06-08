// Simply Logo Slider — front-end animation
// Runs only on the front end (viewScript), not in the editor.

( function() {
	'use strict';

	function initSlider( slider ) {
		var track = slider.querySelector( '.sls-track' );
		if ( ! track ) return;

		var logos = Array.prototype.slice.call( track.querySelectorAll( '.sls-logo' ) );
		if ( ! logos.length ) return;

		// Only animate if logos overflow the container
		if ( track.scrollWidth <= slider.offsetWidth ) return;

		// Clone all logos to create a seamless loop
		logos.forEach( function( logo ) {
			var clone = logo.cloneNode( true );
			clone.setAttribute( 'aria-hidden', 'true' );
			if ( clone.tagName === 'A' ) clone.setAttribute( 'tabindex', '-1' );
			track.appendChild( clone );
		} );

		slider.classList.add( 'sls-slider--active' );

		// Pause on hover
		slider.addEventListener( 'mouseenter', function() {
			slider.classList.add( 'sls-slider--paused' );
		} );
		slider.addEventListener( 'mouseleave', function() {
			if ( ! isDragging ) slider.classList.remove( 'sls-slider--paused' );
		} );

		// Drag-to-scroll (mouse + touch)
		var isDragging  = false;
		var startX      = 0;
		var scrollStart = 0;

		function dragStart( x ) {
			isDragging  = true;
			startX      = x;
			scrollStart = slider.scrollLeft;
			slider.classList.add( 'sls-slider--paused', 'is-dragging' );
		}
		function dragMove( x ) {
			if ( ! isDragging ) return;
			slider.scrollLeft = scrollStart - ( x - startX );
		}
		function dragEnd() {
			if ( ! isDragging ) return;
			isDragging = false;
			slider.classList.remove( 'is-dragging' );
			if ( ! slider.matches( ':hover' ) ) slider.classList.remove( 'sls-slider--paused' );
		}

		slider.addEventListener( 'mousedown',  function( e ) { dragStart( e.pageX ); } );
		window.addEventListener( 'mousemove',  function( e ) { dragMove( e.pageX ); } );
		window.addEventListener( 'mouseup',    dragEnd );
		slider.addEventListener( 'touchstart', function( e ) { dragStart( e.touches[0].pageX ); }, { passive: true } );
		slider.addEventListener( 'touchmove',  function( e ) { dragMove( e.touches[0].pageX ); }, { passive: true } );
		slider.addEventListener( 'touchend',   dragEnd );
		slider.addEventListener( 'click',      function( e ) {
			if ( Math.abs( slider.scrollLeft - scrollStart ) > 5 ) e.preventDefault();
		} );
	}

	// Wait for images to load so dimensions are accurate
	window.addEventListener( 'load', function() {
		document.querySelectorAll( '[data-sls]' ).forEach( function( slider ) {
			initSlider( slider );
		} );
	} );

} )();
