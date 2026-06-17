import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { columns, gap, gapUnit, gridTemplate } = attributes;

	const style = { '--sc-gap': `${ gap }${ gapUnit }` };
	if ( gridTemplate ) style[ '--sc-template' ] = gridTemplate;

	const blockProps = useBlockProps.save( {
		className: `simply-columns simply-columns--${ columns }`,
		style,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
