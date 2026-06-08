import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Button, TextControl, SelectControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { source, logos, limit, height, speed, gap, grayscale } = attributes;

	const blockProps = useBlockProps( { className: 'sls-editor-wrap' } );

	function addLogos( media ) {
		const incoming = Array.isArray( media ) ? media : [ media ];
		const newLogos = incoming.map( ( m ) => ( {
			id:    m.id,
			url:   m.url,
			alt:   m.alt || m.title || '',
			link:  '',
			boost: false,
		} ) );
		setAttributes( { logos: [ ...logos, ...newLogos ] } );
	}

	function updateLink( index, value ) {
		setAttributes( { logos: logos.map( ( l, i ) => i === index ? { ...l, link: value } : l ) } );
	}

	function updateBoost( index, value ) {
		setAttributes( { logos: logos.map( ( l, i ) => i === index ? { ...l, boost: value } : l ) } );
	}

	function removeLogo( index ) {
		setAttributes( { logos: logos.filter( ( _, i ) => i !== index ) } );
	}

	return (
		<>
			<InspectorControls>

				<PanelBody title={ __( 'Source', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Logo source', 'simply-blocks' ) }
						value={ source }
						options={ [
							{ label: __( 'Custom — manage logos here', 'simply-blocks' ),      value: 'custom' },
							{ label: __( 'Global — pull from Logo Library (CPT)', 'simply-blocks' ), value: 'global' },
						] }
						onChange={ ( v ) => setAttributes( { source: v } ) }
					/>
					{ source === 'global' && (
						<RangeControl
							label={ __( 'Limit (−1 = show all)', 'simply-blocks' ) }
							value={ limit }
							onChange={ ( v ) => setAttributes( { limit: v } ) }
							min={ -1 } max={ 50 } step={ 1 }
						/>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Slider Settings', 'simply-blocks' ) }>
					<RangeControl
						label={ __( 'Logo height (px)', 'simply-blocks' ) }
						value={ height }
						onChange={ ( v ) => setAttributes( { height: v } ) }
						min={ 20 } max={ 200 } step={ 2 }
					/>
					<RangeControl
						label={ __( 'Speed (seconds — lower = faster)', 'simply-blocks' ) }
						value={ speed }
						onChange={ ( v ) => setAttributes( { speed: v } ) }
						min={ 5 } max={ 120 } step={ 1 }
					/>
					<RangeControl
						label={ __( 'Gap between logos (px)', 'simply-blocks' ) }
						value={ gap }
						onChange={ ( v ) => setAttributes( { gap: v } ) }
						min={ 10 } max={ 200 } step={ 4 }
					/>
					<ToggleControl
						label={ __( 'Grayscale (color on hover)', 'simply-blocks' ) }
						checked={ grayscale }
						onChange={ ( v ) => setAttributes( { grayscale: v } ) }
					/>
				</PanelBody>

			</InspectorControls>

			<div { ...blockProps }>

				{ /* ── GLOBAL mode ── */ }
				{ source === 'global' && (
					<div className="sls-editor-global-notice">
						<span>{ __( 'Displaying logos from the Logo Library', 'simply-blocks' ) }</span>
						<a
							href="/wp-admin/edit.php?post_type=simply_logo"
							target="_blank"
							rel="noreferrer"
						>
							{ __( 'Manage Logo Library →', 'simply-blocks' ) }
						</a>
						<p className="sls-editor-hint">{ __( 'Animation plays on front end', 'simply-blocks' ) }</p>
					</div>
				) }

				{ /* ── CUSTOM mode ── */ }
				{ source === 'custom' && (
					<>
						{ logos.length > 0 && (
							<div className="sls-editor-logos">
								{ logos.map( ( logo, index ) => (
									<div key={ logo.id || index } className="sls-editor-logo-row">
										<img src={ logo.url } alt={ logo.alt } style={ { height: `${ Math.min( height, 60 ) }px` } } />
										<TextControl
											placeholder={ __( 'Link URL (optional)', 'simply-blocks' ) }
											value={ logo.link }
											onChange={ ( v ) => updateLink( index, v ) }
										/>
										<label style={ { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' } }>
											<input
												type="checkbox"
												checked={ !! logo.boost }
												onChange={ ( e ) => updateBoost( index, e.target.checked ) }
											/>
											{ __( 'Boost size', 'simply-blocks' ) }
										</label>
										<Button onClick={ () => removeLogo( index ) } variant="link" isDestructive>
											{ __( 'Remove', 'simply-blocks' ) }
										</Button>
									</div>
								) ) }
							</div>
						) }

						<MediaUploadCheck>
							<MediaUpload
								onSelect={ addLogos }
								allowedTypes={ [ 'image' ] }
								multiple
								value={ logos.map( ( l ) => l.id ) }
								render={ ( { open } ) => (
									<Button onClick={ open } variant={ logos.length ? 'secondary' : 'primary' }>
										{ logos.length
											? __( '+ Add more logos', 'simply-blocks' )
											: __( 'Add logos', 'simply-blocks' )
										}
									</Button>
								) }
							/>
						</MediaUploadCheck>

						{ logos.length > 0 && (
							<div className="sls-editor-preview">
								<p className="sls-editor-hint">{ __( '↓ Preview (animation plays on front end)', 'simply-blocks' ) }</p>
							<p className="sls-editor-hint">{ __( 'Tip: crop logo files tight — remove all padding and whitespace before uploading. Logos are sized by height, so dead space makes a logo look smaller than the rest.', 'simply-blocks' ) }</p>
							<p className="sls-editor-hint">{ __( 'If a logo still looks small after cropping, check "Boost size" next to that logo above.', 'simply-blocks' ) }</p>
								<div
									className={ `sls-slider${ grayscale ? '' : ' sls-slider--no-grayscale' }` }
									style={ {
										'--sls-height': `${ height }px`,
										'--sls-gap':    `${ gap }px`,
										'--sls-speed':  `${ speed }s`,
									} }
								>
									<div className="sls-track">
										{ logos.map( ( logo, index ) => {
											const img = <img src={ logo.url } alt={ logo.alt } loading="lazy" />;
											const cls = `sls-logo${ logo.boost ? ' sls-logo--boost' : '' }`;
											return logo.link
												? <a key={ index } className={ cls } href={ logo.link }>{ img }</a>
												: <span key={ index } className={ cls }>{ img }</span>;
										} ) }
									</div>
								</div>
							</div>
						) }
					</>
				) }

			</div>
		</>
	);
}
