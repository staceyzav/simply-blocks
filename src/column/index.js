import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

const deprecated = [
	{
		attributes: {
			verticalAlign:   { type: 'string', default: '' },
			horizontalAlign: { type: 'string', default: '' },
		},
		save( { attributes } ) {
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
		},
		migrate( attributes ) {
			return {
				...attributes,
				paddingTop:    0,
				paddingBottom: 0,
				paddingLeft:   0,
				paddingRight:  0,
				paddingUnit:   'px',
			};
		},
	},
];

registerBlockType( metadata.name, { edit: Edit, save, deprecated } );
