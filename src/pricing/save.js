import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { items, columns } = attributes;
	if ( ! items.length ) return null;

	const blockProps = useBlockProps.save( {
		className: `sp-pricing sp-pricing--cols-${ columns }`,
	} );

	return (
		<div { ...blockProps }>
			<div className="sp-pricing-grid">
				{ items.map( ( item, i ) => (
					<div key={ i } className="sp-pricing-card ss-card">
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
				) ) }
			</div>
		</div>
	);
}
