import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { columns, gap, gapUnit, gridTemplate, stackBreakpoint, reverseOnMobile } = attributes;

	const style = { '--sc-gap': `${ gap }${ gapUnit }` };
	if ( gridTemplate ) style[ '--sc-template' ] = gridTemplate;

	const stackClass   = stackBreakpoint && stackBreakpoint !== '640' ? ` simply-columns--stack-${ stackBreakpoint }` : '';
	const reverseClass = reverseOnMobile ? ' simply-columns--reverse-mobile' : '';

	const blockProps = useBlockProps.save( {
		className: `simply-columns simply-columns--${ columns }${ stackClass }${ reverseClass }`,
		style,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
