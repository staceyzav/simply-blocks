import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;

	function addItem() {
		setAttributes( { items: [ ...items, { number: '', label: '' } ] } );
	}

	function updateItem( index, key, value ) {
		setAttributes( { items: items.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		) } );
	}

	function removeItem( index ) {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	}

	const cols = Math.min( Math.max( items.length, 1 ), 5 );
	const blockProps = useBlockProps( { className: `ss-stats ss-stats--${ cols } ss-stats-editor` } );

	return (
		<div { ...blockProps }>
			{ items.map( ( item, i ) => (
				<div key={ i } className="ss-stat ss-stat--editing">
					<TextControl
						placeholder="150+"
						value={ item.number }
						onChange={ ( v ) => updateItem( i, 'number', v ) }
					/>
					<TextControl
						placeholder={ __( 'Label', 'simply-blocks' ) }
						value={ item.label }
						onChange={ ( v ) => updateItem( i, 'label', v ) }
					/>
					<Button
						variant="link"
						isDestructive
						onClick={ () => removeItem( i ) }
						style={ { fontSize: '11px' } }
					>
						{ __( 'Remove', 'simply-blocks' ) }
					</Button>
				</div>
			) ) }

			{ items.length === 0 && (
				<p className="ss-stats-empty">
					{ __( 'No stats yet — click Add Stat to get started.', 'simply-blocks' ) }
				</p>
			) }

			<div className="ss-stats-add-wrap">
				<Button
					variant={ items.length ? 'secondary' : 'primary' }
					onClick={ addItem }
				>
					{ __( '+ Add Stat', 'simply-blocks' ) }
				</Button>
			</div>
		</div>
	);
}
