(function () {
	var stats = document.querySelectorAll( '.ss-stat[data-target]' );
	if ( ! stats.length ) return;

	// Parse a number string like "150+", "$5M", "1,200", "99%" into parts.
	function parse( str ) {
		var m = str.match( /^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)([^0-9]*)$/ );
		if ( ! m ) return null;
		var raw = m[2].replace( /,/g, '' );
		return {
			prefix:   m[1],
			value:    parseFloat( raw ),
			suffix:   m[3],
			decimals: ( m[2].split( '.' )[1] || '' ).length,
			commas:   m[2].includes( ',' ),
		};
	}

	function format( parsed, current ) {
		var n = parsed.decimals
			? current.toFixed( parsed.decimals )
			: String( Math.round( current ) );
		if ( parsed.commas ) {
			n = parseFloat( n ).toLocaleString( undefined, {
				minimumFractionDigits: parsed.decimals,
				maximumFractionDigits: parsed.decimals,
			} );
		}
		return parsed.prefix + n + parsed.suffix;
	}

	function animate( el ) {
		var parsed = parse( el.dataset.target );
		var numEl  = el.querySelector( '.ss-stat__number' );
		if ( ! parsed || ! numEl ) return;

		var duration = 1600;
		var start    = null;

		function step( ts ) {
			if ( ! start ) start = ts;
			var progress = Math.min( ( ts - start ) / duration, 1 );
			// ease-out cubic
			var ease    = 1 - Math.pow( 1 - progress, 3 );
			numEl.textContent = format( parsed, ease * parsed.value );
			if ( progress < 1 ) requestAnimationFrame( step );
		}

		requestAnimationFrame( step );
	}

	var observer = new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( entry ) {
			if ( entry.isIntersecting ) {
				animate( entry.target );
				observer.unobserve( entry.target );
			}
		} );
	}, { threshold: 0.3 } );

	stats.forEach( function ( stat ) { observer.observe( stat ); } );
} )();
