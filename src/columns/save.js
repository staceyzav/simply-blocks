import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { columns, gap, gapUnit, gridTemplate, stackBreakpoint } = attributes;

	const style = { '--sc-gap': `${ gap }${ gapUnit }` };
	if ( gridTemplate ) style[ '--sc-template' ] = gridTemplate;

	const stackClass = stackBreakpoint && stackBreakpoint !== '640' ? ` simply-columns--stack-${ stackBreakpoint }` : '';

	const blockProps = useBlockProps.save( {
		className: `simply-columns simply-columns--${ columns }${ stackClass }`,
		style,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
