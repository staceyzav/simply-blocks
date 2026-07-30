import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { verticalAlign, horizontalAlign, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingUnit } = attributes;

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
			paddingTop:    paddingTop    > 0 ? `${ paddingTop }${ paddingUnit }`    : undefined,
			paddingBottom: paddingBottom > 0 ? `${ paddingBottom }${ paddingUnit }` : undefined,
			paddingLeft:   paddingLeft   > 0 ? `${ paddingLeft }${ paddingUnit }`   : undefined,
			paddingRight:  paddingRight  > 0 ? `${ paddingRight }${ paddingUnit }`  : undefined,
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

				<PanelBody title={ __( 'Padding', 'simply-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Unit', 'simply-blocks' ) }
						value={ paddingUnit }
						options={ [
							{ label: 'px', value: 'px' },
							{ label: '%',  value: '%'  },
						] }
						onChange={ ( unit ) => setAttributes( {
							paddingUnit:   unit,
							paddingTop:    0,
							paddingBottom: 0,
							paddingLeft:   0,
							paddingRight:  0,
						} ) }
					/>
					<RangeControl
						label={ __( `Padding top (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingTop }
						onChange={ ( value ) => setAttributes( { paddingTop: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 30 : 300 }
						step={ paddingUnit === '%' ? 1 : 4 }
					/>
					<RangeControl
						label={ __( `Padding bottom (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingBottom }
						onChange={ ( value ) => setAttributes( { paddingBottom: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 30 : 300 }
						step={ paddingUnit === '%' ? 1 : 4 }
					/>
					<RangeControl
						label={ __( `Padding left (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingLeft }
						onChange={ ( value ) => setAttributes( { paddingLeft: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 20 : 200 }
						step={ 1 }
					/>
					<RangeControl
						label={ __( `Padding right (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingRight }
						onChange={ ( value ) => setAttributes( { paddingRight: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 20 : 200 }
						step={ 1 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } ref={ ref }>
				<InnerBlocks />
			</div>
		</>
	);
}
