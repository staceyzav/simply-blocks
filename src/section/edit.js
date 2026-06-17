import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, ColorPicker, TextControl, ToggleControl, Button, BaseControl } from '@wordpress/components';

const SECTION_COLORS = [
	{ label: __( 'None',      'simply-blocks' ), value: '' },
	{ label: __( 'Dark',      'simply-blocks' ), value: 'is-dark' },
	{ label: __( 'Light',     'simply-blocks' ), value: 'is-light' },
	{ label: __( 'Brand 1',   'simply-blocks' ), value: 'is-brand-1' },
	{ label: __( 'Brand 2',   'simply-blocks' ), value: 'is-brand-2' },
	{ label: __( 'Home Hero', 'simply-blocks' ), value: 'is-home-hero' },
	{ label: __( 'Page Hero', 'simply-blocks' ), value: 'is-page-hero' },
];

const HERO_TYPES = [ 'is-home-hero', 'is-page-hero' ];

const BG_TYPES = [
	{ label: __( 'None',  'simply-blocks' ), value: 'none' },
	{ label: __( 'Color', 'simply-blocks' ), value: 'color' },
	{ label: __( 'Image', 'simply-blocks' ), value: 'image' },
	{ label: __( 'Video', 'simply-blocks' ), value: 'video' },
];

const VALIGN_OPTIONS = [
	{ label: __( 'Top',    'simply-blocks' ), value: 'flex-start' },
	{ label: __( 'Middle', 'simply-blocks' ), value: 'center' },
	{ label: __( 'Bottom', 'simply-blocks' ), value: 'flex-end' },
];

const BG_POS_X = [
	{ label: __( 'Left',   'simply-blocks' ), value: 'left' },
	{ label: __( 'Center', 'simply-blocks' ), value: 'center' },
	{ label: __( 'Right',  'simply-blocks' ), value: 'right' },
];

const BG_POS_Y = [
	{ label: __( 'Top',    'simply-blocks' ), value: 'top' },
	{ label: __( 'Center', 'simply-blocks' ), value: 'center' },
	{ label: __( 'Bottom', 'simply-blocks' ), value: 'bottom' },
];

const BG_POSITIONS = [
	{ label: 'Center center', value: 'center center' },
	{ label: 'Top center',    value: 'top center' },
	{ label: 'Bottom center', value: 'bottom center' },
	{ label: 'Left center',   value: 'left center' },
	{ label: 'Right center',  value: 'right center' },
];

const BLEND_MODES = [
	{ label: 'Normal',      value: 'normal' },
	{ label: 'Multiply',    value: 'multiply' },
	{ label: 'Screen',      value: 'screen' },
	{ label: 'Overlay',     value: 'overlay' },
	{ label: 'Darken',      value: 'darken' },
	{ label: 'Lighten',     value: 'lighten' },
	{ label: 'Color Dodge', value: 'color-dodge' },
	{ label: 'Color Burn',  value: 'color-burn' },
];

function getYouTubeId( url ) {
	const match = url.match( /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/ );
	return match ? match[ 1 ] : null;
}

function hexToRgba( hex, opacity ) {
	const clean = hex.replace( '#', '' );
	const r = parseInt( clean.substring( 0, 2 ), 16 );
	const g = parseInt( clean.substring( 2, 4 ), 16 );
	const b = parseInt( clean.substring( 4, 6 ), 16 );
	return `rgba(${ r },${ g },${ b },${ opacity / 100 })`;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		sectionColor, innerWidth, innerWidthUnit, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingUnit,
		marginTop, marginBottom, minHeight, minHeightUnit, verticalAlign,
		bgType, bgColor, bgColorOpacity, bgImageUrl, bgImageId, bgPositionX, bgPositionY, bgImageSize, bgImageFixed,
		bgVideoUrl, bgVideoId, bgVideoWebmUrl, bgVideoWebmId, bgVideoPosterUrl,
		overlayColor, overlayOpacity, overlayBlendMode,
		mobilePaddingEnabled, mobilePaddingTop, mobilePaddingBottom,
	} = attributes;

	// Outer section styles
	const outerStyle = {
		paddingTop:    `${ paddingTop }${ paddingUnit }`,
		paddingBottom: `${ paddingBottom }${ paddingUnit }`,
		...(marginTop    !== 0 && { marginTop:    `${ marginTop }px` }),
		...(marginBottom !== 0 && { marginBottom: `${ marginBottom }px` }),
		...(minHeight > 0 && { minHeight: `${ minHeight }${ minHeightUnit }` }),
		...(minHeight > 0 && { display: 'flex', flexDirection: 'column', justifyContent: verticalAlign }),
		...(bgType === 'color' && { backgroundColor: hexToRgba( bgColor, bgColorOpacity ) }),
	};

	// Bg image inline styles
	const bgImageStyle = bgType === 'image' && bgImageUrl ? {
		backgroundImage:      `url(${ bgImageUrl })`,
		backgroundPosition:   `${ bgPositionX } ${ bgPositionY }`,
		backgroundSize:       bgImageSize,
		backgroundAttachment: bgImageFixed ? 'fixed' : 'scroll',
	} : null;

	const isHero = HERO_TYPES.includes( sectionColor );

	const blockProps = useBlockProps( {
		className: [ 'simply-section', sectionColor, isHero ? 'hero' : '' ].filter( Boolean ).join( ' ' ),
		style: outerStyle,
	} );

	return (
		<>
			<InspectorControls>

				{ /* ── COLOR SCHEME ── */ }
				<PanelBody title={ __( 'Color Scheme', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Section color', 'simply-blocks' ) }
						value={ sectionColor }
						options={ SECTION_COLORS }
						onChange={ ( value ) => setAttributes( { sectionColor: value } ) }
					/>
				</PanelBody>

				{ /* ── LAYOUT ── */ }
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Inner width unit', 'simply-blocks' ) }
						value={ innerWidthUnit }
						options={ [
							{ label: 'px', value: 'px' },
							{ label: '%',  value: '%'  },
						] }
						onChange={ ( unit ) => setAttributes( {
							innerWidthUnit: unit,
							innerWidth: unit === '%' ? 90 : 1200,
						} ) }
					/>
					<RangeControl
						label={ __( `Inner width (${ innerWidthUnit })`, 'simply-blocks' ) }
						value={ innerWidth }
						onChange={ ( value ) => setAttributes( { innerWidth: value } ) }
						min={ innerWidthUnit === '%' ? 10 : 400 }
						max={ innerWidthUnit === '%' ? 100 : 2400 }
						step={ innerWidthUnit === '%' ? 5 : 10 }
					/>
					<SelectControl
						label={ __( 'Min height unit', 'simply-blocks' ) }
						value={ minHeightUnit }
						options={ [
							{ label: 'px', value: 'px' },
							{ label: 'vh', value: 'vh' },
						] }
						onChange={ ( unit ) => setAttributes( {
							minHeightUnit: unit,
							minHeight: unit === 'vh' ? Math.min( minHeight, 200 ) : minHeight,
						} ) }
					/>
					<RangeControl
						label={ __( `Min height (${ minHeightUnit }) — 0 = auto`, 'simply-blocks' ) }
						value={ minHeight }
						onChange={ ( value ) => setAttributes( { minHeight: value } ) }
						min={ 0 }
						max={ minHeightUnit === 'vh' ? 200 : 1200 }
						step={ minHeightUnit === 'vh' ? 5 : 10 }
					/>
					{ minHeight > 0 && (
						<SelectControl
							label={ __( 'Content vertical align', 'simply-blocks' ) }
							value={ verticalAlign }
							options={ VALIGN_OPTIONS }
							onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
						/>
					) }
					<SelectControl
						label={ __( 'Padding unit', 'simply-blocks' ) }
						value={ paddingUnit }
						options={ [
							{ label: 'px', value: 'px' },
							{ label: '%',  value: '%'  },
						] }
						onChange={ ( unit ) => setAttributes( {
							paddingUnit:   unit,
							paddingTop:    unit === '%' ? 5 : 80,
							paddingBottom: unit === '%' ? 5 : 80,
							paddingLeft:   unit === '%' ? 5 : 5,
							paddingRight:  unit === '%' ? 5 : 5,
						} ) }
					/>
					<RangeControl
						label={ __( `Padding top (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingTop }
						onChange={ ( value ) => setAttributes( { paddingTop: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 30 : 300 }
						step={ paddingUnit === '%' ? 1 : 4 }
					/>
					<RangeControl
						label={ __( `Padding bottom (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingBottom }
						onChange={ ( value ) => setAttributes( { paddingBottom: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 30 : 300 }
						step={ paddingUnit === '%' ? 1 : 4 }
					/>
					<RangeControl
						label={ __( `Padding left (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingLeft }
						onChange={ ( value ) => setAttributes( { paddingLeft: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 20 : 100 }
						step={ 1 }
					/>
					<RangeControl
						label={ __( `Padding right (${ paddingUnit })`, 'simply-blocks' ) }
						value={ paddingRight }
						onChange={ ( value ) => setAttributes( { paddingRight: value } ) }
						min={ 0 }
						max={ paddingUnit === '%' ? 20 : 100 }
						step={ 1 }
					/>
					<RangeControl
						label={ __( 'Margin top (px)', 'simply-blocks' ) }
						value={ marginTop }
						onChange={ ( value ) => setAttributes( { marginTop: value } ) }
						min={ 0 } max={ 200 } step={ 4 }
					/>
					<RangeControl
						label={ __( 'Margin bottom (px)', 'simply-blocks' ) }
						value={ marginBottom }
						onChange={ ( value ) => setAttributes( { marginBottom: value } ) }
						min={ 0 } max={ 200 } step={ 4 }
					/>
					<ToggleControl
						label={ __( 'Override padding on mobile', 'simply-blocks' ) }
						checked={ mobilePaddingEnabled }
						onChange={ ( value ) => setAttributes( { mobilePaddingEnabled: value } ) }
					/>
					{ mobilePaddingEnabled && (
						<>
							<RangeControl
								label={ __( 'Mobile padding top (px)', 'simply-blocks' ) }
								value={ mobilePaddingTop }
								onChange={ ( value ) => setAttributes( { mobilePaddingTop: value } ) }
								min={ 0 } max={ 300 } step={ 4 }
							/>
							<RangeControl
								label={ __( 'Mobile padding bottom (px)', 'simply-blocks' ) }
								value={ mobilePaddingBottom }
								onChange={ ( value ) => setAttributes( { mobilePaddingBottom: value } ) }
								min={ 0 } max={ 300 } step={ 4 }
							/>
						</>
					) }
				</PanelBody>

				{ /* ── BACKGROUND ── */ }
				<PanelBody title={ __( 'Background', 'simply-blocks' ) }>
					<SelectControl
						label={ __( 'Background type', 'simply-blocks' ) }
						value={ bgType }
						options={ BG_TYPES }
						onChange={ ( value ) => setAttributes( { bgType: value } ) }
					/>

					{ bgType === 'color' && (
						<>
							<BaseControl label={ __( 'Background color', 'simply-blocks' ) }>
								<ColorPicker
									color={ bgColor }
									onChange={ ( value ) => setAttributes( { bgColor: value } ) }
									enableAlpha={ false }
								/>
							</BaseControl>
							<RangeControl
								label={ __( 'Opacity (%)', 'simply-blocks' ) }
								value={ bgColorOpacity }
								onChange={ ( value ) => setAttributes( { bgColorOpacity: value } ) }
								min={ 0 } max={ 100 } step={ 1 }
							/>
						</>
					) }

					{ bgType === 'image' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => setAttributes( { bgImageUrl: media.url, bgImageId: media.id } ) }
									allowedTypes={ [ 'image' ] }
									value={ bgImageId }
									render={ ( { open } ) => (
										<>
											{ bgImageUrl && (
												<img
													src={ bgImageUrl }
													alt=""
													style={ { width: '100%', marginBottom: '8px', borderRadius: '4px' } }
												/>
											) }
											<Button onClick={ open } variant={ bgImageUrl ? 'secondary' : 'primary' } style={ { marginBottom: '12px' } }>
												{ bgImageUrl ? __( 'Replace image', 'simply-blocks' ) : __( 'Choose image', 'simply-blocks' ) }
											</Button>
											{ bgImageUrl && (
												<Button
													onClick={ () => setAttributes( { bgImageUrl: '', bgImageId: 0 } ) }
													variant="link"
													isDestructive
													style={ { display: 'block', marginBottom: '12px' } }
												>
													{ __( 'Remove image', 'simply-blocks' ) }
												</Button>
											) }
										</>
									) }
								/>
							</MediaUploadCheck>
							<SelectControl
								label={ __( 'Image horizontal focus', 'simply-blocks' ) }
								value={ bgPositionX }
								options={ BG_POS_X }
								onChange={ ( value ) => setAttributes( { bgPositionX: value } ) }
							/>
							<SelectControl
								label={ __( 'Image vertical focus', 'simply-blocks' ) }
								value={ bgPositionY }
								options={ BG_POS_Y }
								onChange={ ( value ) => setAttributes( { bgPositionY: value } ) }
							/>
							<SelectControl
								label={ __( 'Size', 'simply-blocks' ) }
								value={ bgImageSize }
								options={ [
									{ label: 'Cover',   value: 'cover' },
									{ label: 'Contain', value: 'contain' },
									{ label: 'Auto',    value: 'auto' },
								] }
								onChange={ ( value ) => setAttributes( { bgImageSize: value } ) }
							/>
							<ToggleControl
								label={ __( 'Fixed (parallax)', 'simply-blocks' ) }
								checked={ bgImageFixed }
								onChange={ ( value ) => setAttributes( { bgImageFixed: value } ) }
							/>
						</>
					) }

					{ bgType === 'video' && (
						<>
							<BaseControl label={ __( 'MP4 (required)', 'simply-blocks' ) }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => setAttributes( { bgVideoUrl: media.url, bgVideoId: media.id } ) }
										allowedTypes={ [ 'video' ] }
										value={ bgVideoId }
										render={ ( { open } ) => (
											<Button onClick={ open } variant={ bgVideoUrl ? 'secondary' : 'primary' } style={ { marginBottom: '4px', display: 'block' } }>
												{ bgVideoUrl ? __( 'Replace MP4', 'simply-blocks' ) : __( 'Choose MP4', 'simply-blocks' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ bgVideoUrl && (
									<p style={ { fontSize: '11px', color: '#757575', margin: '2px 0 8px' } }>
										{ bgVideoUrl.split( '/' ).pop() }
									</p>
								) }
							</BaseControl>

							<BaseControl label={ __( 'WebM (optional — ~30% smaller, loads faster)', 'simply-blocks' ) }>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) => setAttributes( { bgVideoWebmUrl: media.url, bgVideoWebmId: media.id } ) }
										allowedTypes={ [ 'video' ] }
										value={ bgVideoWebmId }
										render={ ( { open } ) => (
											<Button onClick={ open } variant={ bgVideoWebmUrl ? 'secondary' : 'primary' } style={ { marginBottom: '4px', display: 'block' } }>
												{ bgVideoWebmUrl ? __( 'Replace WebM', 'simply-blocks' ) : __( 'Choose WebM', 'simply-blocks' ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ bgVideoWebmUrl && (
									<p style={ { fontSize: '11px', color: '#757575', margin: '2px 0 8px' } }>
										{ bgVideoWebmUrl.split( '/' ).pop() }
									</p>
								) }
							</BaseControl>

							<TextControl
								label={ __( 'Or enter video URL (YouTube, MP4, etc.)', 'simply-blocks' ) }
								value={ bgVideoUrl }
								onChange={ ( value ) => setAttributes( { bgVideoUrl: value, bgVideoId: 0 } ) }
								placeholder="https://..."
							/>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => setAttributes( { bgVideoPosterUrl: media.url } ) }
									allowedTypes={ [ 'image' ] }
									value={ 0 }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" style={ { marginBottom: '8px' } }>
											{ bgVideoPosterUrl ? __( 'Replace poster image', 'simply-blocks' ) : __( 'Choose poster image (mobile fallback)', 'simply-blocks' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ bgVideoPosterUrl && (
								<>
									<img src={ bgVideoPosterUrl } alt="" style={ { width: '100%', borderRadius: '4px', marginBottom: '8px' } } />
									<Button
										onClick={ () => setAttributes( { bgVideoPosterUrl: '' } ) }
										variant="link"
										isDestructive
										style={ { marginBottom: '12px' } }
									>
										{ __( 'Remove poster', 'simply-blocks' ) }
									</Button>
								</>
							) }
						</>
					) }
				</PanelBody>

				{ /* ── OVERLAY (image + video only) ── */ }
				{ ( bgType === 'image' || bgType === 'video' ) && (
					<PanelBody title={ __( 'Overlay', 'simply-blocks' ) } initialOpen={ false }>
						<RangeControl
							label={ __( 'Opacity (0 = off)', 'simply-blocks' ) }
							value={ overlayOpacity }
							onChange={ ( value ) => setAttributes( { overlayOpacity: value } ) }
							min={ 0 } max={ 100 } step={ 1 }
						/>
						{ overlayOpacity > 0 && (
							<>
								<BaseControl label={ __( 'Overlay color', 'simply-blocks' ) }>
									<ColorPicker
										color={ overlayColor }
										onChange={ ( value ) => setAttributes( { overlayColor: value } ) }
										enableAlpha={ false }
									/>
								</BaseControl>
								<SelectControl
									label={ __( 'Blend mode', 'simply-blocks' ) }
									value={ overlayBlendMode }
									options={ BLEND_MODES }
									onChange={ ( value ) => setAttributes( { overlayBlendMode: value } ) }
								/>
							</>
						) }
					</PanelBody>
				) }

			</InspectorControls>

			{ /* ── EDITOR PREVIEW ── */ }
			<div { ...blockProps }>

				{ bgType === 'image' && bgImageUrl && (
					<div className="simply-section__bg-image" style={ bgImageStyle } />
				) }

				{ bgType === 'video' && bgVideoUrl && ( () => {
					const ytId      = getYouTubeId( bgVideoUrl );
					const thumbUrl  = ytId ? `https://img.youtube.com/vi/${ ytId }/maxresdefault.jpg` : null;
					const previewBg = thumbUrl || bgVideoPosterUrl || null;
					const label     = ytId ? '▶ YouTube background' : '▶ Video background';
					return (
						<div className="simply-section__bg-image" style={ {
							backgroundImage:    previewBg ? `url(${ previewBg })` : 'none',
							backgroundSize:     'cover',
							backgroundPosition: 'center center',
						} }>
							<span className="simply-section__video-label">{ label }</span>
						</div>
					);
				} )() }

				{ ( bgType === 'image' || bgType === 'video' ) && overlayOpacity > 0 && (
					<div
						className="simply-section__overlay"
						style={ {
							backgroundColor: overlayColor,
							opacity:         overlayOpacity / 100,
							mixBlendMode:    overlayBlendMode,
						} }
					/>
				) }

				<div
					className="simply-section__inner"
					style={ {
						maxWidth:     `${ innerWidth }${ innerWidthUnit }`,
						paddingLeft:  `${ paddingLeft }${ paddingUnit }`,
						paddingRight: `${ paddingRight }${ paddingUnit }`,
					} }
				>
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
