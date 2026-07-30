import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

const deprecated = [
	// v2 — had padding controls but no mobile padding override
	{
		attributes: {
			verticalAlign:   { type: 'string', default: '' },
			horizontalAlign: { type: 'string', default: '' },
			paddingTop:      { type: 'number', default: 0 },
			paddingBottom:   { type: 'number', default: 0 },
			paddingLeft:     { type: 'number', default: 0 },
			paddingRight:    { type: 'number', default: 0 },
			paddingUnit:     { type: 'string', default: 'px' },
		},
		save( { attributes } ) {
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
		},
		migrate( attributes ) {
			return {
				...attributes,
				mobilePaddingEnabled: false,
				mobilePaddingTop:     0,
				mobilePaddingBottom:  0,
			};
		},
	},
	// v1 — alignment only, no padding controls
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
				paddingTop:           0,
				paddingBottom:        0,
				paddingLeft:          0,
				paddingRight:         0,
				paddingUnit:          'px',
				mobilePaddingEnabled: false,
				mobilePaddingTop:     0,
				mobilePaddingBottom:  0,
			};
		},
	},
];

registerBlockType( metadata.name, { edit: Edit, save, deprecated } );
