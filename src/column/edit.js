import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { verticalAlign, horizontalAlign } = attributes;

	// Force the column's own block list to display:block so nested simply-columns
	// blocks stack vertically instead of inheriting a grid/flex layout from the
	// parent columns block. Uses inline !important via style.setProperty which has
	// the highest CSS priority and cannot be overridden by any stylesheet.
	useEffect( () => {
		const el = document.querySelector( `[data-block="${ clientId }"]` );
		if ( ! el ) return;

		function fixLayout() {
			const innerBlocks = el.querySelector( ':scope > .block-editor-inner-blocks' );
			if ( ! innerBlocks ) return;
			const layout = innerBlocks.querySelector( ':scope > .block-editor-block-list__layout' );
			if ( layout ) {
				layout.style.setProperty( 'display', 'block', 'important' );
			}
		}

		fixLayout();
		const observer = new MutationObserver( fixLayout );
		observer.observe( el, { subtree: true, childList: true } );
		return () => observer.disconnect();
	}, [ clientId ] );

	const blockProps = useBlockProps( {
		className: 'simply-column',
		style: {
			'--sc-col-v-align': verticalAlign   || undefined,
			'--sc-col-h-align': horizontalAlign || undefined,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Alignment', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Vertical alignment', 'simply-blocks' ) }
						value={ verticalAlign }
						options={ [
							{ label: __( 'Stretch (default)', 'simply-blocks' ), value: ''       },
							{ label: __( 'Top',               'simply-blocks' ), value: 'start'  },
							{ label: __( 'Middle',            'simply-blocks' ), value: 'center' },
							{ label: __( 'Bottom',            'simply-blocks' ), value: 'end'    },
						] }
						onChange={ ( v ) => setAttributes( { verticalAlign: v } ) }
					/>
					<SelectControl
						label={ __( 'Horizontal alignment', 'simply-blocks' ) }
						value={ horizontalAlign }
						options={ [
							{ label: __( 'Stretch (default)', 'simply-blocks' ), value: ''       },
							{ label: __( 'Left',              'simply-blocks' ), value: 'start'  },
							{ label: __( 'Center',            'simply-blocks' ), value: 'center' },
							{ label: __( 'Right',             'simply-blocks' ), value: 'end'    },
						] }
						onChange={ ( v ) => setAttributes( { horizontalAlign: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks />
			</div>
		</>
	);
}
