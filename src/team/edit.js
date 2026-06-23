import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, CheckboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, columns, category } = attributes;

	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'st_category', {
			per_page: 100,
			hide_empty: false,
		} );
	}, [] );

	const selectedSlugs = category ? category.split( ',' ).filter( Boolean ) : [];

	function toggleCategory( slug, checked ) {
		const next = checked
			? [ ...selectedSlugs, slug ]
			: selectedSlugs.filter( ( s ) => s !== slug );
		setAttributes( { category: next.join( ',' ) } );
	}

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

				{ categories && categories.length > 0 && (
					<PanelBody title={ __( 'Filter by category', 'simply-blocks' ) } initialOpen={ false }>
						{ categories.map( ( cat ) => (
							<CheckboxControl
								key={ cat.id }
								label={ cat.name }
								checked={ selectedSlugs.includes( cat.slug ) }
								onChange={ ( checked ) => toggleCategory( cat.slug, checked ) }
							/>
						) ) }
						{ selectedSlugs.length > 0 && (
							<button
								style={ { fontSize: '11px', color: '#cc1818', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '4px' } }
								onClick={ () => setAttributes( { category: '' } ) }
							>
								{ __( 'Clear all', 'simply-blocks' ) }
							</button>
						) }
					</PanelBody>
				) }
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
