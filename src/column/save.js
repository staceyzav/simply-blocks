import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { verticalAlign, horizontalAlign, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingUnit, mobilePaddingEnabled, mobilePaddingTop, mobilePaddingBottom, columnUrl, columnNewTab } = attributes;

	const blockProps = useBlockProps.save( {
		className: [ 'simply-column', mobilePaddingEnabled ? 'sc-col-mob' : '', columnUrl ? 'has-column-link' : '' ].filter( Boolean ).join( ' ' ),
		style: {
			'--sc-col-v-align': verticalAlign   || undefined,
			'--sc-col-h-align': horizontalAlign || undefined,
			paddingTop:    paddingTop    > 0 ? `${ paddingTop }${ paddingUnit }`    : undefined,
			paddingBottom: paddingBottom > 0 ? `${ paddingBottom }${ paddingUnit }` : undefined,
			paddingLeft:   paddingLeft   > 0 ? `${ paddingLeft }${ paddingUnit }`   : undefined,
			paddingRight:  paddingRight  > 0 ? `${ paddingRight }${ paddingUnit }`  : undefined,
			'--sc-col-mpt': mobilePaddingEnabled ? `${ mobilePaddingTop }px`    : undefined,
			'--sc-col-mpb': mobilePaddingEnabled ? `${ mobilePaddingBottom }px` : undefined,
		},
	} );

	return (
		<div { ...blockProps }>
			{ columnUrl && (
				<a
					className="sc-col-link"
					href={ columnUrl }
					target={ columnNewTab ? '_blank' : undefined }
					rel={ columnNewTab ? 'noreferrer' : undefined }
					tabIndex="-1"
					aria-hidden="true"
				/>
			) }
			<InnerBlocks.Content />
		</div>
	);
}
