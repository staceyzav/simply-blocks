import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { columns, gap, gapUnit, gridTemplate } = attributes;
	const isFirstRender = useRef( true );

	const { insertBlock, removeBlock } = useDispatch( 'core/block-editor' );

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks || [],
		[ clientId ]
	);

	// On first render the template handles creation.
	// After that, sync column blocks when the count changes.
	useEffect( () => {
		if ( isFirstRender.current ) {
			isFirstRender.current = false;
			return;
		}

		const current = innerBlocks.length;

		if ( columns > current ) {
			for ( let i = current; i < columns; i++ ) {
				insertBlock( createBlock( 'simply-blocks/column', {} ), undefined, clientId, false );
			}
		} else if ( columns < current ) {
			for ( let i = current - 1; i >= columns; i-- ) {
				removeBlock( innerBlocks[ i ].clientId, false );
			}
		}
	}, [ columns ] );

	const style = { '--sc-gap': `${ gap }${ gapUnit }` };
	if ( gridTemplate ) style[ '--sc-template' ] = gridTemplate;

	const blockProps = useBlockProps( {
		className: `simply-columns simply-columns--${ columns }`,
		style,
	} );

	const template = Array.from( { length: columns }, () => [ 'simply-blocks/column', {} ] );
	const equalPlaceholder = Array.from( { length: columns }, () => '1fr' ).join( ' ' );

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
					<SelectControl
						label={ __( 'Gap unit', 'simply-blocks' ) }
						value={ gapUnit }
						options={ [
							{ label: 'px', value: 'px' },
							{ label: '%',  value: '%'  },
						] }
						onChange={ ( unit ) => setAttributes( {
							gapUnit: unit,
							gap: unit === '%' ? 2 : 24,
						} ) }
					/>
					<RangeControl
						label={ __( `Gap (${ gapUnit })`, 'simply-blocks' ) }
						value={ gap }
						onChange={ ( value ) => setAttributes( { gap: value } ) }
						min={ 0 }
						max={ gapUnit === '%' ? 10 : 80 }
						step={ gapUnit === '%' ? 0.5 : 4 }
					/>
					<TextControl
						label={ __( 'Custom column widths', 'simply-blocks' ) }
						value={ gridTemplate }
						placeholder={ equalPlaceholder }
						help={ __( 'CSS grid-template-columns value, e.g. 30% 70% or 200px 1fr. Leave blank for equal columns.', 'simply-blocks' ) }
						onChange={ ( value ) => setAttributes( { gridTemplate: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ [ 'simply-blocks/column' ] }
					template={ template }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
