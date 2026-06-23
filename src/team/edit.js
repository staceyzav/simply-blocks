import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, columns } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Columns', 'simply-blocks' ) }
						value={ columns }
						onChange={ ( v ) => setAttributes( { columns: v } ) }
						min={ 1 } max={ 5 } step={ 1 }
					/>
					<RangeControl
						label={ __( 'Number of members', 'simply-blocks' ) }
						value={ limit === -1 ? 0 : limit }
						onChange={ ( v ) => setAttributes( { limit: v === 0 ? -1 : v } ) }
						min={ 0 } max={ 20 } step={ 1 }
						help={ __( '0 = show all', 'simply-blocks' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="simply-blocks/team"
					attributes={ attributes }
					httpMethod="POST"
				/>
			</div>
		</>
	);
}
