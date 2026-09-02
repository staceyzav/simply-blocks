import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, Button } from '@wordpress/components';

const EMPTY_ITEM = { title: '', description: '', faCode: '', photoUrl: '', photoId: 0 };

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;

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

	const blockProps = useBlockProps( { className: 'ss-hiw ss-hiw-editor' } );

	return (
		<div { ...blockProps }>
			{ items.length === 0 && (
				<p className="ss-hiw-empty">
					{ __( 'No steps yet — click Add Step to get started.', 'simply-blocks' ) }
				</p>
			) }

			{ items.map( ( item, i ) => (
				<div key={ i } className="ss-hiw-editor__step">
					<div className="ss-hiw-editor__num">{ String( i + 1 ).padStart( 2, '0' ) }</div>

					<div className="ss-hiw-editor__icon-section">
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
										<div className="ss-hiw-editor__photo-preview">
											<img src={ item.photoUrl } alt="" />
											<Button variant="secondary" isSmall onClick={ open }>
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
												{ __( 'Remove photo', 'simply-blocks' ) }
											</Button>
										</div>
									) : (
										<div className="ss-hiw-editor__icon-row">
											<Button variant="secondary" isSmall onClick={ open }>
												{ __( 'Upload photo', 'simply-blocks' ) }
											</Button>
											<span className="ss-hiw-editor__or">{ __( 'or FA class:', 'simply-blocks' ) }</span>
											<TextControl
												placeholder="fas fa-wrench"
												hideLabelFromVision
												label={ __( 'Font Awesome class', 'simply-blocks' ) }
												value={ item.faCode }
												onChange={ ( v ) => updateItem( i, 'faCode', v ) }
												className="ss-hiw-editor__fa-input"
											/>
										</div>
									)
								) }
							/>
						</MediaUploadCheck>
					</div>

					<TextControl
						placeholder={ __( 'Step title', 'simply-blocks' ) }
						value={ item.title }
						onChange={ ( v ) => updateItem( i, 'title', v ) }
						className="ss-hiw-editor__title-field"
					/>
					<TextareaControl
						placeholder={ __( 'Description', 'simply-blocks' ) }
						value={ item.description }
						onChange={ ( v ) => updateItem( i, 'description', v ) }
						rows={ 2 }
					/>
					<Button
						variant="link"
						isDestructive
						onClick={ () => removeItem( i ) }
						style={ { fontSize: '11px' } }
					>
						{ __( '✕ Remove step', 'simply-blocks' ) }
					</Button>
				</div>
			) ) }

			<div className="ss-hiw-add-wrap">
				<Button
					variant={ items.length ? 'secondary' : 'primary' }
					onClick={ addItem }
				>
					{ __( '+ Add Step', 'simply-blocks' ) }
				</Button>
			</div>
		</div>
	);
}
