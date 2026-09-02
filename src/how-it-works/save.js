import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { items } = attributes;
	if ( ! items.length ) return null;

	const blockProps = useBlockProps.save( {
		className: `ss-hiw ss-hiw--${ items.length }`,
	} );

	return (
		<div { ...blockProps }>
			{ items.map( ( item, i ) => (
				<div key={ i } className="ss-hiw__step">
					<div className="ss-hiw__num">{ String( i + 1 ).padStart( 2, '0' ) }</div>
					<div className="ss-hiw__icon-wrap">
						{ item.photoUrl ? (
							<img
								className="ss-hiw__photo"
								src={ item.photoUrl }
								alt={ item.title || '' }
								loading="lazy"
							/>
						) : item.faCode ? (
							<i className={ `${ item.faCode } ss-hiw__fa` } aria-hidden="true"></i>
						) : null }
					</div>
					{ item.title && (
						<h3 className="ss-hiw__title">{ item.title }</h3>
					) }
					{ item.description && (
						<p className="ss-hiw__desc">{ item.description }</p>
					) }
				</div>
			) ) }
		</div>
	);
}
