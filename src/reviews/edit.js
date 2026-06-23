import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, CheckboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { attributes, setAttributes } ) {
	const { limit, showName, showSource, showDate, minStars, source, category, autoplay } = attributes;

	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'sr_category', {
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

				<PanelBody title={ __( 'Query', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Number of reviews', 'simply-blocks' ) }
						value={ limit === -1 ? 0 : limit }
						onChange={ ( v ) => setAttributes( { limit: v === 0 ? -1 : v } ) }
						min={ 0 } max={ 20 } step={ 1 }
						help={ __( '0 = show all', 'simply-blocks' ) }
					/>
					<RangeControl
						label={ __( 'Minimum star rating', 'simply-blocks' ) }
						value={ minStars }
						onChange={ ( v ) => setAttributes( { minStars: v } ) }
						min={ 1 } max={ 5 } step={ 1 }
					/>
					<SelectControl
						label={ __( 'Filter by source', 'simply-blocks' ) }
						value={ source }
						options={ [
							{ label: __( 'All sources', 'simply-blocks' ), value: '' },
							{ label: 'Google',      value: 'Google' },
							{ label: 'Yelp',        value: 'Yelp' },
							{ label: 'TripAdvisor', value: 'TripAdvisor' },
							{ label: 'Facebook',    value: 'Facebook' },
							{ label: 'Direct',      value: 'Direct' },
						] }
						onChange={ ( v ) => setAttributes( { source: v } ) }
					/>
					{ categories && categories.length > 0 && (
						<>
							<p style={ { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 8px' } }>
								{ __( 'Filter by category', 'simply-blocks' ) }
							</p>
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
									style={ { fontSize: '11px', color: '#cc1818', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '8px' } }
									onClick={ () => setAttributes( { category: '' } ) }
								>
									{ __( 'Clear all', 'simply-blocks' ) }
								</button>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Display', 'simply-blocks' ) }>
					<ToggleControl
						label={ __( 'Show reviewer name', 'simply-blocks' ) }
						checked={ showName }
						onChange={ ( v ) => setAttributes( { showName: v } ) }
					/>
					<ToggleControl
						label={ __( 'Show source', 'simply-blocks' ) }
						checked={ showSource }
						onChange={ ( v ) => setAttributes( { showSource: v } ) }
					/>
					<ToggleControl
						label={ __( 'Show date', 'simply-blocks' ) }
						checked={ showDate }
						onChange={ ( v ) => setAttributes( { showDate: v } ) }
					/>
					<RangeControl
						label={ __( 'Autoplay (seconds)', 'simply-blocks' ) }
						value={ autoplay }
						onChange={ ( v ) => setAttributes( { autoplay: v } ) }
						min={ 0 } max={ 10 } step={ 1 }
						help={ __( '0 = off', 'simply-blocks' ) }
					/>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender
					block="simply-blocks/reviews"
					attributes={ attributes }
					httpMethod="POST"
				/>
			</div>
		</>
	);
}
