import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { columns, gap } = attributes;

	const blockProps = useBlockProps( {
		className: `simply-columns simply-columns--${ columns }`,
		style: {
			'--sc-gap':         `${ gap }px`,
			'--sc-editor-cols': `repeat( ${ columns }, 1fr )`,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Columns', 'simply-blocks' ) }
						value={ columns }
						onChange={ ( value ) => setAttributes( { columns: value } ) }
						min={ 1 }
						max={ 5 }
						step={ 1 }
					/>
					<RangeControl
						label={ __( 'Gap (px)', 'simply-blocks' ) }
						value={ gap }
						onChange={ ( value ) => setAttributes( { gap: value } ) }
						min={ 0 }
						max={ 80 }
						step={ 4 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks />
			</div>
		</>
	);
}
