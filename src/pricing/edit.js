import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, TextareaControl, Button } from '@wordpress/components';

const EMPTY_ITEM = {
	photoUrl: '', photoId: 0, target: '', title: '', category: '',
	regularLabel: '', regularPrice: '', onlinePrice: '', priceLabel: '',
	includes: '', description: '', finePrint: '',
};

function getUniqueCategories( items ) {
	const seen = new Set();
	const cats = [];
	items.forEach( ( item ) => {
		if ( ! item.category ) return;
		item.category.split( ',' ).forEach( ( c ) => {
			const label = c.trim();
			const slug  = label.toLowerCase().replace( /\s+/g, '-' );
			if ( slug && ! seen.has( slug ) ) {
				seen.add( slug );
				cats.push( { label, slug } );
			}
		} );
	} );
	return cats;
}

export default function Edit( { attributes, setAttributes } ) {
	const { items, columns, defaultCategory } = attributes;
	const categories = getUniqueCategories( items );
	const hasFilters = categories.length > 1;

	function addItem() {
		setAttributes( { items: [ ...items, { ...EMPTY_ITEM } ] } );
	}

	function updateItem( index, key, value ) {
		setAttributes( { items: items.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		) } );
	}

	function removeItem( index ) {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	}

	const blockProps = useBlockProps( { className: `sp-pricing sp-pricing--cols-${ columns } sp-pricing-editor` } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Columns', 'simply-blocks' ) }
						value={ columns }
						onChange={ ( v ) => setAttributes( { columns: v } ) }
						min={ 1 }
						max={ 4 }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Filters', 'simply-blocks' ) }>
					<TextControl
						label={ __( 'Default category', 'simply-blocks' ) }
						help={ __( 'Must match a category exactly (e.g. "Skis"). Leave blank for All.', 'simply-blocks' ) }
						value={ defaultCategory }
						onChange={ ( v ) => setAttributes( { defaultCategory: v } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ hasFilters && (
					<div className="sp-pricing-filters sp-pricing-filters--preview">
						<button className="sp-filter-btn is-active" disabled>All</button>
						{ categories.map( ( cat ) => (
							<button key={ cat.slug } className="sp-filter-btn" disabled>
								{ cat.label }
							</button>
						) ) }
					</div>
				) }

				{ items.length === 0 && (
					<p className="sp-pricing-empty">
						{ __( 'No pricing items yet — click Add Item to get started.', 'simply-blocks' ) }
					</p>
				) }

				{ items.map( ( item, i ) => (
					<div key={ i } className="sp-pricing-card sp-pricing-card--editing ss-card">
						<div className="sp-pricing-card__photo-wrap">
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => {
										setAttributes( {
											items: items.map( ( item, idx ) =>
												idx === i ? { ...item, photoUrl: media.url, photoId: media.id } : item
											),
										} );
									} }
									allowedTypes={ [ 'image' ] }
									value={ item.photoId }
									render={ ( { open } ) => (
										item.photoUrl ? (
											<div className="sp-pricing-card__photo-preview">
												<img src={ item.photoUrl } alt="" />
												<Button
													variant="secondary"
													isSmall
													onClick={ open }
													className="sp-pricing-card__photo-change"
												>
													{ __( 'Change', 'simply-blocks' ) }
												</Button>
												<Button
													variant="link"
													isDestructive
													isSmall
													onClick={ () => {
														updateItem( i, 'photoUrl', '' );
														updateItem( i, 'photoId', 0 );
													} }
												>
													{ __( 'Remove', 'simply-blocks' ) }
												</Button>
											</div>
										) : (
											<Button
												variant="secondary"
												onClick={ open }
												className="sp-pricing-card__photo-add"
											>
												{ __( '+ Add Photo', 'simply-blocks' ) }
											</Button>
										)
									) }
								/>
							</MediaUploadCheck>
						</div>

						<div className="sp-pricing-card__body ss-card-body">
							<TextControl
								placeholder={ __( 'Target Customer (eyebrow)', 'simply-blocks' ) }
								value={ item.target }
								onChange={ ( v ) => updateItem( i, 'target', v ) }
								className="sp-field-target"
							/>
							<TextControl
								placeholder={ __( 'Title', 'simply-blocks' ) }
								value={ item.title }
								onChange={ ( v ) => updateItem( i, 'title', v ) }
								className="sp-field-title"
							/>
							<TextControl
								placeholder={ __( 'Category (comma-separated, e.g. Skis, Demo)', 'simply-blocks' ) }
								value={ item.category }
								onChange={ ( v ) => updateItem( i, 'category', v ) }
								className="sp-field-category"
							/>
							<div className="sp-field-row">
								<TextControl
									placeholder={ __( 'Regular Price (e.g. $120)', 'simply-blocks' ) }
									value={ item.regularPrice }
									onChange={ ( v ) => updateItem( i, 'regularPrice', v ) }
								/>
								<TextControl
									placeholder={ __( 'Label (e.g. In-Store)', 'simply-blocks' ) }
									value={ item.regularLabel }
									onChange={ ( v ) => updateItem( i, 'regularLabel', v ) }
								/>
							</div>
							<div className="sp-field-row">
								<TextControl
									placeholder={ __( 'Online Price (e.g. $84)', 'simply-blocks' ) }
									value={ item.onlinePrice }
									onChange={ ( v ) => updateItem( i, 'onlinePrice', v ) }
								/>
								<TextControl
									placeholder={ __( 'Price Label (e.g. / day)', 'simply-blocks' ) }
									value={ item.priceLabel }
									onChange={ ( v ) => updateItem( i, 'priceLabel', v ) }
								/>
							</div>
							<TextControl
								placeholder={ __( 'Includes', 'simply-blocks' ) }
								value={ item.includes }
								onChange={ ( v ) => updateItem( i, 'includes', v ) }
							/>
							<TextareaControl
								placeholder={ __( 'Description', 'simply-blocks' ) }
								value={ item.description }
								onChange={ ( v ) => updateItem( i, 'description', v ) }
								rows={ 2 }
							/>
							<TextControl
								placeholder={ __( 'Fine Print', 'simply-blocks' ) }
								value={ item.finePrint }
								onChange={ ( v ) => updateItem( i, 'finePrint', v ) }
							/>
						</div>

						<Button
							variant="link"
							isDestructive
							onClick={ () => removeItem( i ) }
							className="sp-pricing-card__remove"
						>
							{ __( '✕ Remove item', 'simply-blocks' ) }
						</Button>
					</div>
				) ) }

				<div className="sp-pricing-add-wrap">
					<Button
						variant={ items.length ? 'secondary' : 'primary' }
						onClick={ addItem }
					>
						{ __( '+ Add Item', 'simply-blocks' ) }
					</Button>
				</div>
			</div>
		</>
	);
}
