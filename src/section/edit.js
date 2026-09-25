import './editor.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl, RangeControl, ColorPicker, TextControl, ToggleControl, Button, BaseControl } from '@wordpress/components';

const SECTION_COLORS = [
	{ label: __( 'White',     'simply-blocks' ), value: 'is-white' },
	{ label: __( 'Light',     'simply-blocks' ), value: 'is-light' },
	{ label: __( 'Dark',      'simply-blocks' ), value: 'is-dark' },
	{ label: __( 'Brand 1',   'simply-blocks' ), value: 'is-brand-1' },
	{ label: __( 'Brand 2',   'simply-blocks' ), value: 'is-brand-2' },
	{ label: __( 'Home Hero', 'simply-blocks' ), value: 'is-home-hero' },
	{ label: __( 'Page Hero', 'simply-blocks' ), value: 'is-page-hero' },
	{ label: __( 'Custom',    'simply-blocks' ), value: '' },
];

const HERO_TYPES = [ 'is-home-hero', 'is-page-hero' ];

const BG_TYPES = [
	{ label: __( 'None',  'simply-blocks' ), value: 'none' },
	{ label: __( 'Image', 'simply-blocks' ), value: 'image' },
	{ label: __( 'Video', 'simply-blocks' ), value: 'video' },
	{ label: __( 'Color (legacy)', 'simply-blocks' ), value: 'color' },
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

// Visual box model control — padding (inner blue box) + margin (outer dashed box).
// Uses plain function calls (not components) for inputs to preserve focus on re-render.
function BoxModelControl( { paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft, unit, onChange } ) {
	const base = {
		width: '40px',
		border: 'none',
		background: 'transparent',
		textAlign: 'center',
		fontSize: '11px',
		fontFamily: 'inherit',
		padding: '2px 0',
		MozAppearance: 'textfield',
		WebkitAppearance: 'none',
		appearance: 'none',
		outline: 'none',
		cursor: 'text',
	};

	const inp = ( value, prop, color ) => (
		<input
			type="number"
			value={ value === 0 ? '' : value }
			placeholder="–"
			min="0"
			onChange={ ( e ) => onChange( { [ prop ]: parseInt( e.target.value ) || 0 } ) }
			style={ { ...base, color } }
		/>
	);

	const mColor = '#999';
	const pColor = '#1e4075';

	return (
		<div style={ { marginBottom: '4px', fontSize: '11px' } }>
			{ /* Outer: margin */ }
			<div style={ {
				position: 'relative',
				background: '#f6f6f6',
				border: '1px dashed #bbb',
				borderRadius: '3px',
				padding: '6px',
			} }>
				<span style={ { position: 'absolute', top: '3px', left: '6px', fontSize: '10px', color: '#bbb', letterSpacing: '0.03em' } }>margin</span>

				{ /* Margin top */ }
				<div style={ { display: 'flex', justifyContent: 'center', paddingTop: '4px', paddingBottom: '3px' } }>
					{ inp( marginTop, 'marginTop', mColor ) }
				</div>

				{ /* Middle row */ }
				<div style={ { display: 'flex', alignItems: 'stretch' } }>
					<div style={ { display: 'flex', alignItems: 'center' } }>
						{ inp( marginLeft, 'marginLeft', mColor ) }
					</div>

					{ /* Inner: padding */ }
					<div style={ {
						flex: 1,
						position: 'relative',
						background: '#ddeaf7',
						border: '2px solid #4a80c4',
						borderRadius: '2px',
						padding: '3px 2px',
					} }>
						<span style={ { position: 'absolute', top: '3px', left: '5px', fontSize: '10px', color: '#3a6aaa', letterSpacing: '0.03em' } }>padding</span>

						{ /* Padding top */ }
						<div style={ { display: 'flex', justifyContent: 'center', paddingTop: '13px', paddingBottom: '3px' } }>
							{ inp( paddingTop, 'paddingTop', pColor ) }
						</div>

						{ /* Padding L / content / R */ }
						<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }>
							{ inp( paddingLeft, 'paddingLeft', pColor ) }
							<div style={ { width: '30px', height: '30px', background: '#2c5685', borderRadius: '2px', flexShrink: 0 } } />
							{ inp( paddingRight, 'paddingRight', pColor ) }
						</div>

						{ /* Padding bottom */ }
						<div style={ { display: 'flex', justifyContent: 'center', padding: '3px 0' } }>
							{ inp( paddingBottom, 'paddingBottom', pColor ) }
						</div>
					</div>

					<div style={ { display: 'flex', alignItems: 'center' } }>
						{ inp( marginRight, 'marginRight', mColor ) }
					</div>
				</div>

				{ /* Margin bottom */ }
				<div style={ { display: 'flex', justifyContent: 'center', paddingTop: '3px' } }>
					{ inp( marginBottom, 'marginBottom', mColor ) }
				</div>
			</div>
			<p style={ { fontSize: '10px', color: '#bbb', margin: '3px 0 0', textAlign: 'right' } }>
				{ `padding: ${ unit } · margin: px` }
			</p>
		</div>
	);
}

// Number input + inline unit dropdown — units prop is array of {label, value}
function SizeControl( { value, unit, units, onChangeValue, onChangeUnit } ) {
	return (
		<div style={ { display: 'flex', border: '1px solid #949494', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' } }>
			<input
				type="number"
				value={ value === 0 ? '' : value }
				placeholder="0"
				min="0"
				onChange={ ( e ) => onChangeValue( parseInt( e.target.value ) || 0 ) }
				style={ {
					flex: 1,
					border: 'none',
					padding: '8px 10px',
					fontSize: '13px',
					outline: 'none',
					background: '#fff',
					MozAppearance: 'textfield',
					WebkitAppearance: 'none',
					appearance: 'none',
				} }
			/>
			<div style={ { borderLeft: '1px solid #949494', background: '#f6f6f6', display: 'flex', alignItems: 'center' } }>
				<select
					value={ unit }
					onChange={ ( e ) => onChangeUnit( e.target.value ) }
					style={ { border: 'none', background: 'transparent', padding: '0 8px', fontSize: '13px', cursor: 'pointer', outline: 'none', height: '100%' } }
				>
					{ units.map( ( u ) => <option key={ u.value } value={ u.value }>{ u.label }</option> ) }
				</select>
			</div>
		</div>
	);
}

// Vertical alignment: three icon buttons (top / center / bottom)
const VALIGN_ICONS = {
	'flex-start': (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
			<rect x="2" y="2" width="14" height="2" rx="1"/>
			<rect x="6" y="5" width="6" height="9" rx="1" opacity="0.55"/>
		</svg>
	),
	'center': (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
			<rect x="2" y="8" width="14" height="2" rx="1"/>
			<rect x="6" y="2" width="6" height="4" rx="1" opacity="0.55"/>
			<rect x="6" y="12" width="6" height="4" rx="1" opacity="0.55"/>
		</svg>
	),
	'flex-end': (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
			<rect x="2" y="14" width="14" height="2" rx="1"/>
			<rect x="6" y="4" width="6" height="9" rx="1" opacity="0.55"/>
		</svg>
	),
};

function VertAlignControl( { value, onChange } ) {
	const opts = [ 'flex-start', 'center', 'flex-end' ];
	return (
		<div style={ { display: 'flex', border: '1px solid #ccc', borderRadius: '2px', overflow: 'hidden', width: 'fit-content', marginBottom: '8px' } }>
			{ opts.map( ( val, i ) => (
				<button
					key={ val }
					type="button"
					onClick={ () => onChange( val ) }
					style={ {
						width: '44px',
						height: '40px',
						border: 'none',
						borderRight: i < opts.length - 1 ? '1px solid #ccc' : 'none',
						background: value === val ? '#1e1e1e' : '#fff',
						color: value === val ? '#fff' : '#1e1e1e',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: 0,
					} }
				>
					{ VALIGN_ICONS[ val ] }
				</button>
			) ) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		sectionColor, innerWidth, innerWidthUnit, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingUnit,
		marginTop, marginBottom, marginLeft, marginRight, borderRadius, minHeight, minHeightUnit, verticalAlign,
		bgType, bgColor, bgColorOpacity, bgImageUrl, bgImageId, bgPositionX, bgPositionY, bgImageSize, bgImageFixed,
		bgVideoUrl, bgVideoId, bgVideoWebmUrl, bgVideoWebmId, bgVideoPosterUrl, bgGradient, bgMediaOpacity,
		overlayColor, overlayOpacity, overlayBlendMode,
		mobilePaddingEnabled, mobilePaddingTop, mobilePaddingBottom,
		borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderColor, borderStyle,
		useGlobalLayout,
	} = attributes;

	const showCustomLayout = ! useGlobalLayout;

	// Pull theme color + gradient presets — try all known paths (classic, FSE global styles)
	const themeGradients = useSelect( ( select ) => {
		const s = select( 'core/block-editor' ).getSettings();
		return Array.isArray( s.simplyBlocksGradients ) && s.simplyBlocksGradients.length
			? s.simplyBlocksGradients
			: ( Array.isArray( s.gradients ) ? s.gradients : [] );
	} );

	// Outer section styles
	const outerStyle = {
		...( ! useGlobalLayout && {
			paddingTop:    `${ paddingTop }${ paddingUnit }`,
			paddingBottom: `${ paddingBottom }${ paddingUnit }`,
		} ),
		...(marginTop    !== 0 && { marginTop:    `${ marginTop }px` }),
		...(marginBottom !== 0 && { marginBottom: `${ marginBottom }px` }),
		...(marginLeft   !== 0 && { marginLeft:   `${ marginLeft }px` }),
		...(marginRight  !== 0 && { marginRight:  `${ marginRight }px` }),
		...((marginLeft !== 0 || marginRight !== 0) && { width: `calc(100% - ${ marginLeft }px - ${ marginRight }px)` }),
		...(borderRadius      !== 0 && { borderRadius:  `${ borderRadius }px` }),
		...(borderTopWidth    > 0   && { borderTop:    `${ borderTopWidth }px ${ borderStyle } ${ borderColor }` }),
		...(borderRightWidth  > 0   && { borderRight:  `${ borderRightWidth }px ${ borderStyle } ${ borderColor }` }),
		...(borderBottomWidth > 0   && { borderBottom: `${ borderBottomWidth }px ${ borderStyle } ${ borderColor }` }),
		...(borderLeftWidth   > 0   && { borderLeft:   `${ borderLeftWidth }px ${ borderStyle } ${ borderColor }` }),
		...(minHeight > 0 && { minHeight: `${ minHeight }${ minHeightUnit }` }),
		...(minHeight > 0 && { display: 'flex', flexDirection: 'column', justifyContent: verticalAlign }),
		...(bgType === 'color' && bgColor && { backgroundColor: bgColor }),
		...(bgType === 'gradient' && bgGradient && { background: bgGradient }),
	};

	const bgImageStyle = bgType === 'image' && bgImageUrl ? {
		backgroundImage:      `url(${ bgImageUrl })`,
		backgroundPosition:   `${ bgPositionX } ${ bgPositionY }`,
		backgroundSize:       bgImageSize,
		backgroundAttachment: bgImageFixed ? 'fixed' : 'scroll',
		opacity:              bgMediaOpacity / 100,
	} : null;

	const isHero = HERO_TYPES.includes( sectionColor );

	const blockProps = useBlockProps( {
		className: [ 'simply-section', sectionColor, isHero ? 'hero' : '', useGlobalLayout ? 'is-global-layout' : '' ].filter( Boolean ).join( ' ' ),
		style: outerStyle,
	} );

	return (
		<>
			<InspectorControls>

				{ /* ── COLOR SCHEME ── */ }
				<PanelBody title={ __( 'Color Scheme and Background', 'simply-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Section color', 'simply-blocks' ) }
						value={ sectionColor }
						options={ SECTION_COLORS }
						onChange={ ( value ) => {
							const attrs = { sectionColor: value };
							if ( value !== '' ) {
								attrs.bgColor    = '';
								attrs.bgGradient = '';
								attrs.bgType     = 'none';
							}
							setAttributes( attrs );
						} }
					/>
					{ sectionColor === '' && ( () => {
						const GradientPicker = window.wp?.components?.__experimentalGradientPicker;
						const slashIcon = (
							<svg width="24" height="24" viewBox="0 0 24 24" style={ { flexShrink: 0 } }>
								<circle cx="12" cy="12" r="11" fill="#f0f0f0" stroke="#ccc" strokeWidth="1"/>
								<line x1="17" y1="7" x2="7" y2="17" stroke="#bbb" strokeWidth="1.5"/>
							</svg>
						);
						const colorSwatch = bgColor ? (
							<span style={ { width: '24px', height: '24px', borderRadius: '50%', background: bgColor, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block', flexShrink: 0 } } />
						) : slashIcon;
						const gradientSwatch = bgGradient ? (
							<span style={ { width: '24px', height: '24px', borderRadius: '50%', background: bgGradient, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block', flexShrink: 0 } } />
						) : slashIcon;
						const rowStyle = ( active ) => ( {
							display: 'flex', alignItems: 'center', gap: '10px',
							padding: '10px 12px', border: '1px solid #ddd',
							marginBottom: '-1px', cursor: 'pointer',
							background: active ? '#f0f7ff' : '#fff',
							fontSize: '13px', userSelect: 'none',
						} );
						return (
							<div style={ { marginTop: '8px' } }>
								{ /* Color row */ }
								<div
									style={ rowStyle( bgType === 'color' ) }
									onClick={ () => setAttributes( { bgType: bgType === 'color' ? 'none' : 'color', bgGradient: '' } ) }
								>
									{ colorSwatch }
									<span>{ __( 'Color', 'simply-blocks' ) }</span>
								</div>
								{ bgType === 'color' && (
									<div style={ { border: '1px solid #ddd', borderTop: 'none', padding: '12px' } }>
										<ColorPicker
											color={ bgColor }
											onChange={ ( color ) => setAttributes( { bgColor: color, bgType: color ? 'color' : 'none' } ) }
											enableAlpha={ false }
										/>
									</div>
								) }

								{ /* Gradient row */ }
								<div
									style={ { ...rowStyle( bgType === 'gradient' ), marginTop: '0' } }
									onClick={ () => setAttributes( { bgType: bgType === 'gradient' ? 'none' : 'gradient', bgColor: '' } ) }
								>
									{ gradientSwatch }
									<span>{ __( 'Gradient', 'simply-blocks' ) }</span>
								</div>
								{ bgType === 'gradient' && (
									<div style={ { border: '1px solid #ddd', borderTop: 'none', padding: '12px' } }>
										{ GradientPicker ? (
											<GradientPicker
												value={ bgGradient }
												onChange={ ( g ) => setAttributes( { bgGradient: g || '', bgType: g ? 'gradient' : 'none' } ) }
											/>
										) : (
											<>
												{ themeGradients.length > 0 && (
													<>
														<p style={ { fontSize: '11px', color: '#757575', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' } }>{ __( 'Theme', 'simply-blocks' ) }</p>
														<div style={ { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' } }>
															{ themeGradients.map( ( g ) => (
																<button
																	key={ g.slug }
																	title={ g.name }
																	type="button"
																	onClick={ () => setAttributes( { bgGradient: g.gradient, bgType: 'gradient' } ) }
																	style={ { width: '28px', height: '28px', borderRadius: '50%', background: g.gradient, border: bgGradient === g.gradient ? '2px solid #007cba' : '1px solid rgba(0,0,0,0.15)', cursor: 'pointer', padding: 0 } }
																/>
															) ) }
														</div>
													</>
												) }
												<TextControl
													label={ __( 'Custom CSS gradient', 'simply-blocks' ) }
													value={ bgGradient }
													placeholder="linear-gradient(135deg, #132436 0%, #4894A8 100%)"
													onChange={ ( v ) => setAttributes( { bgGradient: v, bgType: v ? 'gradient' : 'none' } ) }
												/>
												{ bgGradient && <div style={ { height: '36px', borderRadius: '3px', background: bgGradient } } /> }
													{ bgGradient && (
														<Button
															variant="link"
															isDestructive
															onClick={ () => setAttributes( { bgGradient: '', bgType: 'none' } ) }
															style={ { marginTop: '8px', display: 'block' } }
														>
															{ __( 'Clear gradient', 'simply-blocks' ) }
														</Button>
													) }
												</>
											) }
										</div>
								) }
							</div>
						);
					} )() }
				</PanelBody>

				{ /* ── BACKGROUND ── */ }
				<PanelBody title={ __( 'Background Media', 'simply-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Background type', 'simply-blocks' ) }
						value={ bgType }
						options={ BG_TYPES }
						onChange={ ( value ) => setAttributes( { bgType: value } ) }
					/>

					{ ( bgType === 'image' || bgType === 'video' ) && (
						<RangeControl
							label={ __( 'Opacity (%)', 'simply-blocks' ) }
							value={ bgMediaOpacity }
							onChange={ ( value ) => setAttributes( { bgMediaOpacity: value } ) }
							min={ 0 } max={ 100 } step={ 5 }
						/>
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
				{ /* ── LAYOUT ── */ }
				<PanelBody title={ __( 'Layout', 'simply-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Use global layout', 'simply-blocks' ) }
						help={ useGlobalLayout
							? __( 'Width and side padding follow Styles → Layout.', 'simply-blocks' )
							: __( 'Set width and side padding below.', 'simply-blocks' )
						}
						checked={ useGlobalLayout }
						onChange={ ( value ) => setAttributes( { useGlobalLayout: value } ) }
					/>
					{ showCustomLayout && (
						<>
							<BaseControl label={ __( 'Inner Width', 'simply-blocks' ) }>
								<SizeControl
									value={ innerWidth }
									unit={ innerWidthUnit }
									units={ [ { label: 'px', value: 'px' }, { label: '%', value: '%' } ] }
									onChangeValue={ ( val ) => setAttributes( { innerWidth: val } ) }
									onChangeUnit={ ( unit ) => setAttributes( {
										innerWidthUnit: unit,
										innerWidth: unit === '%' ? 90 : 1200,
									} ) }
								/>
							</BaseControl>
							<SelectControl
								label={ __( 'Margin / Padding unit', 'simply-blocks' ) }
								value={ paddingUnit }
								options={ [
									{ label: 'px', value: 'px' },
									{ label: '%',  value: '%'  },
								] }
								onChange={ ( unit ) => setAttributes( {
									paddingUnit:   unit,
									paddingTop:    unit === '%' ? 5 : 80,
									paddingBottom: unit === '%' ? 5 : 80,
									paddingLeft:   unit === '%' ? 5 : 25,
									paddingRight:  unit === '%' ? 5 : 25,
								} ) }
							/>
							<BoxModelControl
								paddingTop={ paddingTop }
								paddingRight={ paddingRight }
								paddingBottom={ paddingBottom }
								paddingLeft={ paddingLeft }
								marginTop={ marginTop }
								marginRight={ marginRight }
								marginBottom={ marginBottom }
								marginLeft={ marginLeft }
								unit={ paddingUnit }
								onChange={ ( attrs ) => setAttributes( attrs ) }
							/>
						</>
					) }
					<BaseControl label={ __( 'Min-Height', 'simply-blocks' ) }>
						<SizeControl
							value={ minHeight }
							unit={ minHeightUnit }
							units={ [ { label: 'px', value: 'px' }, { label: 'vh', value: 'vh' } ] }
							onChangeValue={ ( val ) => setAttributes( { minHeight: val } ) }
							onChangeUnit={ ( unit ) => setAttributes( {
								minHeightUnit: unit,
								minHeight: unit === 'vh' ? Math.min( minHeight, 200 ) : minHeight,
							} ) }
						/>
					</BaseControl>
					<BaseControl label={ __( 'Vertical Alignment', 'simply-blocks' ) }>
						<VertAlignControl
							value={ verticalAlign }
							onChange={ ( val ) => setAttributes( { verticalAlign: val } ) }
						/>
					</BaseControl>
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

				{ /* ── BORDER ── */ }
				<PanelBody title={ __( 'Border', 'simply-blocks' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Border radius (px)', 'simply-blocks' ) }
						value={ borderRadius }
						onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
						min={ 0 } max={ 100 } step={ 2 }
					/>
					<BaseControl label={ __( 'Border color', 'simply-blocks' ) }>
						<ColorPicker
							color={ borderColor }
							onChange={ ( value ) => setAttributes( { borderColor: value } ) }
							enableAlpha={ false }
						/>
					</BaseControl>
					<SelectControl
						label={ __( 'Border style', 'simply-blocks' ) }
						value={ borderStyle }
						options={ [
							{ label: 'Solid',  value: 'solid'  },
							{ label: 'Dashed', value: 'dashed' },
							{ label: 'Dotted', value: 'dotted' },
						] }
						onChange={ ( value ) => setAttributes( { borderStyle: value } ) }
					/>
					<RangeControl
						label={ __( 'Top (px)', 'simply-blocks' ) }
						value={ borderTopWidth }
						onChange={ ( value ) => setAttributes( { borderTopWidth: value } ) }
						min={ 0 } max={ 20 } step={ 1 }
					/>
					<RangeControl
						label={ __( 'Right (px)', 'simply-blocks' ) }
						value={ borderRightWidth }
						onChange={ ( value ) => setAttributes( { borderRightWidth: value } ) }
						min={ 0 } max={ 20 } step={ 1 }
					/>
					<RangeControl
						label={ __( 'Bottom (px)', 'simply-blocks' ) }
						value={ borderBottomWidth }
						onChange={ ( value ) => setAttributes( { borderBottomWidth: value } ) }
						min={ 0 } max={ 20 } step={ 1 }
					/>
					<RangeControl
						label={ __( 'Left (px)', 'simply-blocks' ) }
						value={ borderLeftWidth }
						onChange={ ( value ) => setAttributes( { borderLeftWidth: value } ) }
						min={ 0 } max={ 20 } step={ 1 }
					/>
				</PanelBody>

				{ /* ── MOBILE ── */ }
				<PanelBody title={ __( 'Mobile', 'simply-blocks' ) } initialOpen={ false }>
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
							opacity:            bgMediaOpacity / 100,
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
					style={ showCustomLayout ? {
						maxWidth:     `${ innerWidth }${ innerWidthUnit }`,
						paddingLeft:  `${ paddingLeft }${ paddingUnit }`,
						paddingRight: `${ paddingRight }${ paddingUnit }`,
					} : {} }
				>
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
