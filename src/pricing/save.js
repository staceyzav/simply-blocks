import { useBlockProps } from '@wordpress/block-editor';

function normalizeCategory( cat ) {
	return cat.trim().toLowerCase().replace( /\s+/g, '-' );
}

function getUniqueCategories( items ) {
	const seen = new Set();
	const cats = [];
	items.forEach( ( item ) => {
		if ( ! item.category ) return;
		item.category.split( ',' ).forEach( ( c ) => {
			const norm = normalizeCategory( c );
			if ( norm && ! seen.has( norm ) ) {
				seen.add( norm );
				cats.push( { label: c.trim(), slug: norm } );
			}
		} );
	} );
	return cats;
}

export default function Save( { attributes } ) {
	const { items, columns, defaultCategory } = attributes;
	if ( ! items.length ) return null;

	const categories = getUniqueCategories( items );
	const hasFilters = categories.length > 1;
	const defaultSlug = defaultCategory ? normalizeCategory( defaultCategory ) : 'all';

	const blockProps = useBlockProps.save( {
		className: `sp-pricing sp-pricing--cols-${ columns }`,
	} );

	return (
		<div { ...blockProps }>
			{ hasFilters && (
				<div className="sp-pricing-filters">
					<button
						className={ `sp-filter-btn${ defaultSlug === 'all' ? ' is-active is-default' : '' }` }
						data-filter="all"
					>
						All
					</button>
					{ categories.map( ( cat ) => (
						<button
							key={ cat.slug }
							className={ `sp-filter-btn${ defaultSlug === cat.slug ? ' is-active is-default' : '' }` }
							data-filter={ cat.slug }
						>
							{ cat.label }
						</button>
					) ) }
				</div>
			) }

			<div className="sp-pricing-grid">
				{ items.map( ( item, i ) => {
					const cardCats = item.category
						? item.category.split( ',' ).map( normalizeCategory ).join( ' ' )
						: '';

					return (
						<div
							key={ i }
							className="sp-pricing-card ss-card"
							data-categories={ cardCats || undefined }
						>
							{ item.photoUrl && (
								<img
									className="sp-pricing-card__photo"
									src={ item.photoUrl }
									alt={ item.title || '' }
									loading="lazy"
								/>
							) }
							<div className="sp-pricing-card__body ss-card-body">
								{ item.title && (
									<h3 className="sp-pricing-card__title">{ item.title }</h3>
								) }
								{ item.price && (
									<p className="sp-pricing-card__online">
										<span className="sp-pricing-card__price">{ item.price }</span>
										{ item.priceLabel && (
											<span className="sp-pricing-card__price-label"> { item.priceLabel }</span>
										) }
									</p>
								) }
								{ item.description && (
									<p className="sp-pricing-card__desc">{ item.description }</p>
								) }
								{ item.finePrint && (
									<p className="sp-pricing-card__fine">{ item.finePrint }</p>
								) }
							</div>
						</div>
					);
				} ) }
			</div>
		</div>
	);
}
