import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, CheckboxControl, TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, category, showFuture, showPast, order, view, title, showFilter, ctaText, ctaUrl } = attributes;

	// Pull event categories from the simply_event_cat taxonomy
	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'simply_event_cat', {
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
						label={ __( 'Number of events', 'simply-blocks' ) }
						value={ limit }
						onChange={ ( v ) => setAttributes( { limit: v } ) }
						min={ 1 } max={ 24 } step={ 1 }
					/>
					<ToggleControl
						label={ __( 'Include upcoming events', 'simply-blocks' ) }
						checked={ showFuture }
						onChange={ ( v ) => setAttributes( { showFuture: v } ) }
					/>
					<ToggleControl
						label={ __( 'Include past events', 'simply-blocks' ) }
						checked={ showPast }
						onChange={ ( v ) => setAttributes( { showPast: v } ) }
					/>
					<SelectControl
						label={ __( 'Order', 'simply-blocks' ) }
						value={ order }
						options={ [
							{ label: __( 'Start date — oldest first', 'simply-blocks' ), value: 'ASC' },
							{ label: __( 'Start date — newest first', 'simply-blocks' ), value: 'DESC' },
						] }
						onChange={ ( v ) => setAttributes( { order: v } ) }
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
				</PanelBody>

				<PanelBody title={ __( 'Content', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'View', 'simply-blocks' ) }
						value={ view }
						options={ [
							{ label: __( 'Grid', 'simply-blocks' ), value: 'grid' },
							{ label: __( 'List', 'simply-blocks' ), value: 'list' },
						] }
						onChange={ ( v ) => setAttributes( { view: v } ) }
					/>
					<TextControl
						label={ __( 'Section heading', 'simply-blocks' ) }
						value={ title }
						onChange={ ( v ) => setAttributes( { title: v } ) }
						placeholder={ __( 'Upcoming Events', 'simply-blocks' ) }
					/>
					<ToggleControl
						label={ __( 'Show category filters', 'simply-blocks' ) }
						checked={ showFilter }
						onChange={ ( v ) => setAttributes( { showFilter: v } ) }
					/>
					<TextControl
						label={ __( 'CTA button text', 'simply-blocks' ) }
						value={ ctaText }
						onChange={ ( v ) => setAttributes( { ctaText: v } ) }
					/>
					<TextControl
						label={ __( 'CTA button URL', 'simply-blocks' ) }
						value={ ctaUrl }
						onChange={ ( v ) => setAttributes( { ctaUrl: v } ) }
					/>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="simply-blocks/events"
					attributes={ attributes }
					httpMethod="POST"
				/>
			</div>
		</>
	);
}
