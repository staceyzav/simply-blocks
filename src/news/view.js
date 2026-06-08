// Simply News — front-end category filter
// AJAX-powered, no page reload. Reads block settings from data attributes.

( function() {
	'use strict';

	function initNewsBlock( block ) {
		var filters = Array.prototype.slice.call( block.querySelectorAll( '.sn-filter-btn' ) );
		if ( ! filters.length ) return;

		var grid = block.querySelector( '.sn-grid' );
		if ( ! grid ) return;

		filters.forEach( function( btn ) {
			btn.addEventListener( 'click', function() {
				if ( btn.classList.contains( 'is-active' ) ) return;

				filters.forEach( function( b ) { b.classList.remove( 'is-active' ); } );
				btn.classList.add( 'is-active' );

				grid.classList.add( 'sn-grid--loading' );

				var params = new URLSearchParams( {
					action:       'sn_filter',
					nonce:        block.dataset.nonce,
					category:     btn.dataset.category,
					baseCategory: block.dataset.baseCategory || '',
					limit:        block.dataset.limit,
					columns:      block.dataset.columns,
					readMore:     block.dataset.readMore,
					showDate:     block.dataset.showDate,
					showCat:      block.dataset.showCat,
					showMore:     block.dataset.showMore,
					orderBy:      block.dataset.orderBy,
				} );

				fetch( block.dataset.ajax, {
					method:  'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body:    params.toString(),
				} )
				.then( function( r ) { return r.json(); } )
				.then( function( res ) {
					if ( res.success ) {
						grid.innerHTML = res.data.html;
					}
					grid.classList.remove( 'sn-grid--loading' );
				} )
				.catch( function() {
					grid.classList.remove( 'sn-grid--loading' );
				} );
			} );
		} );
	}

	document.addEventListener( 'DOMContentLoaded', function() {
		document.querySelectorAll( '.wp-block-simply-blocks-news' ).forEach( initNewsBlock );
	} );

} )();
