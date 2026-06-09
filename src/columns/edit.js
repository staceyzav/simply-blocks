import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { columns, gap } = attributes;
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

	const blockProps = useBlockProps( {
		className: `simply-columns simply-columns--${ columns }`,
		style: { '--sc-gap': `${ gap }px` },
	} );

	const template = Array.from( { length: columns }, () => [ 'simply-blocks/column', {} ] );

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
				<InnerBlocks
					allowedBlocks={ [ 'simply-blocks/column' ] }
					template={ template }
					templateLock={ false }
				/>
			</div>
		</>
	);
}
