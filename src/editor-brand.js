/**
 * Simply Blocks — branded icon color in the block inserter.
 * All simply-blocks/* blocks get the Simply blue background on their icon.
 */
( function() {
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'simply-blocks/brand-icon',
		function( settings, name ) {
			if ( name.indexOf( 'simply-blocks/' ) !== 0 ) return settings;
			return Object.assign( {}, settings, {
				icon: {
					src:        settings.icon && settings.icon.src ? settings.icon.src : settings.icon,
					background: '#2563eb',
					foreground: '#ffffff',
				},
			} );
		}
	);
} )();
