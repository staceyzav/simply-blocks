import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl, CheckboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, columns, category, readMore, heading, showDate, showCategory, showReadMore, showFilters, orderBy } = attributes;

	// Pull real categories from the WP REST API for the dropdown
	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'category', {
			per_page: 100,
			hide_empty: true,
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

				<PanelBody title={ __( 'Query', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Number of posts', 'simply-blocks' ) }
						value={ limit }
						onChange={ ( v ) => setAttributes( { limit: v } ) }
						min={ 1 } max={ 24 } step={ 1 }
					/>
					<p style={ { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' } }>
						{ __( 'Filter by category', 'simply-blocks' ) }
					</p>
					{ ! categories && <p style={ { fontSize: '12px', color: '#757575' } }>{ __( 'Loading…', 'simply-blocks' ) }</p> }
					{ ( categories || [] ).map( ( cat ) => (
						<CheckboxControl
							key={ cat.id }
							label={ cat.name }
							checked={ selectedSlugs.includes( cat.slug ) }
							onChange={ ( checked ) => toggleCategory( cat.slug, checked ) }
						/>
					) ) }
					{ selectedSlugs.length > 0 && (
						<button
							style={ { fontSize: '11px', color: '#cc1818', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '8px' } }
							onClick={ () => setAttributes( { category: '' } ) }
						>
							{ __( 'Clear all', 'simply-blocks' ) }
						</button>
					) }
					<SelectControl
						label={ __( 'Order by', 'simply-blocks' ) }
						value={ orderBy }
						options={ [
							{ label: __( 'Date (newest first)', 'simply-blocks' ), value: 'date' },
							{ label: __( 'Title (A–Z)', 'simply-blocks' ),         value: 'title' },
							{ label: __( 'Modified date', 'simply-blocks' ),       value: 'modified' },
							{ label: __( 'Random', 'simply-blocks' ),              value: 'rand' },
						] }
						onChange={ ( v ) => setAttributes( { orderBy: v } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Columns', 'simply-blocks' ) }
						value={ columns }
						onChange={ ( v ) => setAttributes( { columns: v } ) }
						min={ 1 } max={ 4 } step={ 1 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Content', 'simply-blocks' ) }>
					<TextControl
						label={ __( 'Section heading (optional)', 'simply-blocks' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
						placeholder={ __( 'Latest News', 'simply-blocks' ) }
					/>
					<TextControl
						label={ __( 'Read more text', 'simply-blocks' ) }
						value={ readMore }
						onChange={ ( v ) => setAttributes( { readMore: v } ) }
					/>
					{ ! category ? (
						<ToggleControl
							label={ __( 'Show category filters', 'simply-blocks' ) }
							checked={ showFilters }
							onChange={ ( v ) => setAttributes( { showFilters: v } ) }
						/>
					) : (
						<p style={ { fontSize: '12px', color: '#757575', margin: '0 0 16px' } }>
							{ __( 'Category filters hidden — pre-filtered to one category.', 'simply-blocks' ) }
						</p>
					) }
					<ToggleControl
						label={ __( 'Show category badge on card', 'simply-blocks' ) }
						checked={ showCategory }
						onChange={ ( v ) => setAttributes( { showCategory: v } ) }
					/>
					<ToggleControl
						label={ __( 'Show date', 'simply-blocks' ) }
						checked={ showDate }
						onChange={ ( v ) => setAttributes( { showDate: v } ) }
					/>
					<ToggleControl
						label={ __( 'Show read more link', 'simply-blocks' ) }
						checked={ showReadMore }
						onChange={ ( v ) => setAttributes( { showReadMore: v } ) }
					/>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="simply-blocks/news"
					attributes={ attributes }
					httpMethod="POST"
				/>
			</div>
		</>
	);
}
