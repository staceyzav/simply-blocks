import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { verticalAlign, horizontalAlign } = attributes;

	// Use a ref on the wrapper element so we can target the DOM directly
	// inside the editor iframe (document.querySelector targets the parent frame,
	// which fails when the editor is iframed on WP Engine / production hosts).
	const ref = useRef( null );

	useEffect( () => {
		const el = ref.current;
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
	}, [] );

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

			<div { ...blockProps } ref={ ref }>
				<InnerBlocks />
			</div>
		</>
	);
}
