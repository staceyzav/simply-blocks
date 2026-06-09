import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { verticalAlign, horizontalAlign } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'simply-column',
		style: {
			'--sc-col-v-align': verticalAlign   || undefined,
			'--sc-col-h-align': horizontalAlign || undefined,
		},
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
