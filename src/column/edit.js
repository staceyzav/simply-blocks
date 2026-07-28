import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { verticalAlign, horizontalAlign } = attributes;

	const blockProps = useBlockProps( {
		className: 'simply-column',
		style: {
			'--sc-col-v-align': verticalAlign   || undefined,
			'--sc-col-h-align': horizontalAlign || undefined,
		},
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Alignment', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Vertical alignment', 'simply-blocks' ) }
						value={ verticalAlign }
						options={ [
							{ label: __( 'Stretch (default)', 'simply-blocks' ), value: ''       },
							{ label: __( 'Top',               'simply-blocks' ), value: 'start'  },
							{ label: __( 'Middle',            'simply-blocks' ), value: 'center' },
							{ label: __( 'Bottom',            'simply-blocks' ), value: 'end'    },
						] }
						onChange={ ( v ) => setAttributes( { verticalAlign: v } ) }
					/>
					<SelectControl
						label={ __( 'Horizontal alignment', 'simply-blocks' ) }
						value={ horizontalAlign }
						options={ [
							{ label: __( 'Stretch (default)', 'simply-blocks' ), value: ''       },
							{ label: __( 'Left',              'simply-blocks' ), value: 'start'  },
							{ label: __( 'Center',            'simply-blocks' ), value: 'center' },
							{ label: __( 'Right',             'simply-blocks' ), value: 'end'    },
						] }
						onChange={ ( v ) => setAttributes( { horizontalAlign: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<InnerBlocks layout={ { type: 'default' } } />
			</div>
		</>
	);
}
