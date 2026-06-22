import { useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const { items } = attributes;
	if ( ! items.length ) return null;

	const cols = Math.min( items.length, 5 );
	const blockProps = useBlockProps.save( { className: `ss-stats ss-stats--${ cols }` } );

	return (
		<div { ...blockProps }>
			{ items.map( ( item, i ) => (
				<div key={ i } className="ss-stat" data-target={ item.number }>
					<span className="ss-stat__number">{ item.number }</span>
					<span className="ss-stat__label">{ item.label }</span>
				</div>
			) ) }
		</div>
	);
}
