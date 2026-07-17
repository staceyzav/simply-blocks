import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl, TextareaControl, Button } from '@wordpress/components';

const EMPTY_ITEM = {
	photoUrl: '', photoId: 0, title: '',
	price: '', priceLabel: '', description: '', finePrint: '',
};

export default function Edit( { attributes, setAttributes } ) {
	const { items, columns } = attributes;

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
			</InspectorControls>

			<div { ...blockProps }>
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
											items: items.map( ( it, idx ) =>
												idx === i ? { ...it, photoUrl: media.url, photoId: media.id } : it
											),
										} );
									} }
									allowedTypes={ [ 'image' ] }
									value={ item.photoId }
									render={ ( { open } ) => (
										item.photoUrl ? (
											<div className="sp-pricing-card__photo-preview">
												<img src={ item.photoUrl } alt="" />
												<Button variant="secondary" isSmall onClick={ open } className="sp-pricing-card__photo-change">
													{ __( 'Change', 'simply-blocks' ) }
												</Button>
												<Button
													variant="link" isDestructive isSmall
													onClick={ () => {
														setAttributes( {
															items: items.map( ( it, idx ) =>
																idx === i ? { ...it, photoUrl: '', photoId: 0 } : it
															),
														} );
													} }
												>
													{ __( 'Remove', 'simply-blocks' ) }
												</Button>
											</div>
										) : (
											<Button variant="secondary" onClick={ open } className="sp-pricing-card__photo-add">
												{ __( '+ Add Photo', 'simply-blocks' ) }
											</Button>
										)
									) }
								/>
							</MediaUploadCheck>
						</div>

						<div className="sp-pricing-card__body ss-card-body">
							<TextControl
								placeholder={ __( 'Title', 'simply-blocks' ) }
								value={ item.title }
								onChange={ ( v ) => updateItem( i, 'title', v ) }
								className="sp-field-title"
							/>
							<div className="sp-field-row">
								<TextControl
									placeholder={ __( 'Price (e.g. $84)', 'simply-blocks' ) }
									value={ item.price }
									onChange={ ( v ) => updateItem( i, 'price', v ) }
								/>
								<TextControl
									placeholder={ __( 'Label (e.g. / day)', 'simply-blocks' ) }
									value={ item.priceLabel }
									onChange={ ( v ) => updateItem( i, 'priceLabel', v ) }
								/>
							</div>
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
							variant="link" isDestructive
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
