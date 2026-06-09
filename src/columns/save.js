import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { columns, gap } = attributes;

	const blockProps = useBlockProps.save( {
		className: `simply-columns simply-columns--${ columns }`,
		style: { '--sc-gap': `${ gap }px` },
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
