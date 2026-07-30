import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

const deprecated = [
	// v1 — no reverseOnMobile attribute
	{
		attributes: {
			columns:         { type: 'number', default: 3 },
			gap:             { type: 'number', default: 24 },
			gapUnit:         { type: 'string', default: 'px' },
			gridTemplate:    { type: 'string', default: '' },
			stackBreakpoint: { type: 'string', default: '640' },
		},
		save( { attributes } ) {
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
		},
		migrate( attributes ) {
			return { ...attributes, reverseOnMobile: false };
		},
	},
];

registerBlockType( metadata.name, { edit: Edit, save, deprecated } );
