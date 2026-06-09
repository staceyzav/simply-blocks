import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, CheckboxControl, SelectControl, TextControl, TextareaControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';

const MUTED = { fontSize: '12px', color: '#757575', margin: '0 0 8px' };
const LABEL = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px', display: 'block' };

export default function Edit( { attributes, setAttributes } ) {
	const { source, category, limit, items } = attributes;

	// ── CPT categories ──────────────────────────────────────────────────────
	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'simply_faq_cat', {
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

	// ── Inline item helpers ─────────────────────────────────────────────────
	function addItem() {
		setAttributes( { items: [ ...items, { question: '', answer: '' } ] } );
	}

	function updateItem( index, key, value ) {
		setAttributes( { items: items.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		) } );
	}

	function removeItem( index ) {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	}

	const blockProps = useBlockProps( { className: 'sf-editor-wrap' } );

	return (
		<>
			<InspectorControls>

				<PanelBody title={ __( 'Source', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'FAQ source', 'simply-blocks' ) }
						value={ source }
						options={ [
							{ label: __( 'Add here',    'simply-blocks' ), value: 'custom' },
							{ label: __( 'FAQ Library', 'simply-blocks' ), value: 'cpt' },
						] }
						onChange={ ( v ) => setAttributes( { source: v } ) }
					/>
				</PanelBody>

				{ source === 'cpt' && (
					<PanelBody title={ __( 'Query', 'simply-blocks' ) }>
						<RangeControl
							label={ __( 'Number of FAQs (−1 = all)', 'simply-blocks' ) }
							value={ limit }
							onChange={ ( v ) => setAttributes( { limit: v } ) }
							min={ -1 } max={ 50 } step={ 1 }
							allowReset
							resetFallbackValue={ -1 }
						/>
						<span style={ LABEL }>{ __( 'Filter by category', 'simply-blocks' ) }</span>
						{ ! categories && <p style={ MUTED }>{ __( 'Loading…', 'simply-blocks' ) }</p> }
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
								style={ { fontSize: '11px', color: '#cc1818', background: 'none', border: 'none', padding: 0, cursor: 'pointer' } }
								onClick={ () => setAttributes( { category: '' } ) }
							>
								{ __( 'Clear all', 'simply-blocks' ) }
							</button>
						) }
					</PanelBody>
				) }

			</InspectorControls>

			<div { ...blockProps }>

				{ /* ── CPT mode ── */ }
				{ source === 'cpt' && (
					<ServerSideRender
						block="simply-blocks/faqs"
						attributes={ attributes }
						httpMethod="POST"
					/>
				) }

				{ /* ── Custom mode ── */ }
				{ source === 'custom' && (
					<>
						{ items.length === 0 && (
							<p className="sf-editor-empty">
								{ __( 'Enter FAQ content below, or change the source to FAQ Library.', 'simply-blocks' ) }
							</p>
						) }

						{ items.length > 0 && (
							<div className="sf-editor-items">
								{ items.map( ( item, i ) => (
									<div key={ i } className="sf-editor-item">
										<TextControl
											placeholder={ __( 'Question', 'simply-blocks' ) }
											value={ item.question }
											onChange={ ( v ) => updateItem( i, 'question', v ) }
										/>
										<TextareaControl
											placeholder={ __( 'Answer', 'simply-blocks' ) }
											value={ item.answer }
											onChange={ ( v ) => updateItem( i, 'answer', v ) }
											rows={ 3 }
										/>
										<Button
											variant="link"
											isDestructive
											onClick={ () => removeItem( i ) }
										>
											{ __( 'Remove', 'simply-blocks' ) }
										</Button>
									</div>
								) ) }
							</div>
						) }

						<Button
							variant={ items.length ? 'secondary' : 'primary' }
							onClick={ addItem }
							className="sf-editor-add"
						>
							{ __( '+ Add FAQ', 'simply-blocks' ) }
						</Button>
					</>
				) }

			</div>
		</>
	);
}
