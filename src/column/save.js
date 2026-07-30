import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { verticalAlign, horizontalAlign, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingUnit } = attributes;

	const blockProps = useBlockProps.save( {
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
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
