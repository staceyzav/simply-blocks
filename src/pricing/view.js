( function () {
	document.querySelectorAll( '.sp-pricing' ).forEach( function ( container ) {
		var filters = container.querySelector( '.sp-pricing-filters' );
		var cards   = container.querySelectorAll( '.sp-pricing-card' );
		if ( ! filters ) return;

		var btns = filters.querySelectorAll( '.sp-filter-btn' );

		function activate( btn ) {
			var filter = btn.dataset.filter;
			btns.forEach( function ( b ) { b.classList.remove( 'is-active' ); } );
			btn.classList.add( 'is-active' );
			cards.forEach( function ( card ) {
				if ( filter === 'all' ) {
					card.classList.remove( 'is-hidden' );
				} else {
					var cats = ( card.dataset.categories || '' ).split( ' ' );
					card.classList.toggle( 'is-hidden', ! cats.includes( filter ) );
				}
			} );
		}

		btns.forEach( function ( btn ) {
			btn.addEventListener( 'click', function () { activate( this ); } );
		} );

		// Auto-activate the default category on load
		var defaultBtn = filters.querySelector( '.sp-filter-btn.is-default' );
		if ( defaultBtn ) activate( defaultBtn );
	} );
} )();
