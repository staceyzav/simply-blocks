import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

const SECTION_COLORS = [
	{ label: __( 'None', 'simply-blocks' ),    value: '' },
	{ label: __( 'Dark', 'simply-blocks' ),    value: 'is-dark' },
	{ label: __( 'Light', 'simply-blocks' ),   value: 'is-light' },
	{ label: __( 'Brand 1', 'simply-blocks' ), value: 'is-brand-1' },
	{ label: __( 'Brand 2', 'simply-blocks' ), value: 'is-brand-2' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { sectionColor, innerWidth, paddingTop, paddingBottom, paddingLeft, paddingRight } = attributes;

	const blockProps = useBlockProps( {
		className: [ 'simply-section', sectionColor ].filter( Boolean ).join( ' ' ),
		style: {
			paddingTop:    `${ paddingTop }px`,
			paddingBottom: `${ paddingBottom }px`,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section Color', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Color scheme', 'simply-blocks' ) }
						value={ sectionColor }
						options={ SECTION_COLORS }
						onChange={ ( value ) => setAttributes( { sectionColor: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Inner width (px)', 'simply-blocks' ) }
						value={ innerWidth }
						onChange={ ( value ) => setAttributes( { innerWidth: value } ) }
						min={ 400 }
						max={ 2400 }
						step={ 10 }
					/>
					<RangeControl
						label={ __( 'Padding top (px)', 'simply-blocks' ) }
						value={ paddingTop }
						onChange={ ( value ) => setAttributes( { paddingTop: value } ) }
						min={ 0 }
						max={ 300 }
						step={ 4 }
					/>
					<RangeControl
						label={ __( 'Padding bottom (px)', 'simply-blocks' ) }
						value={ paddingBottom }
						onChange={ ( value ) => setAttributes( { paddingBottom: value } ) }
						min={ 0 }
						max={ 300 }
						step={ 4 }
					/>
					<RangeControl
						label={ __( 'Side padding (px)', 'simply-blocks' ) }
						value={ paddingLeft }
						onChange={ ( value ) => setAttributes( { paddingLeft: value, paddingRight: value } ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className="simply-section__inner"
					style={ {
						maxWidth:     `${ innerWidth }px`,
						paddingLeft:  `${ paddingLeft }px`,
						paddingRight: `${ paddingRight }px`,
					} }
				>
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
