import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { sectionColor, innerWidth, paddingTop, paddingBottom } = attributes;

	const blockProps = useBlockProps.save( {
		className: [ 'simply-section', sectionColor ].filter( Boolean ).join( ' ' ),
		style: {
			paddingTop:    `${ paddingTop }px`,
			paddingBottom: `${ paddingBottom }px`,
		},
	} );

	return (
		<div { ...blockProps }>
			<div
				className="simply-section__inner"
				style={ {
					maxWidth:     `${ innerWidth }px`,
					paddingLeft:  `${ attributes.paddingLeft }px`,
					paddingRight: `${ attributes.paddingRight }px`,
				} }
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
