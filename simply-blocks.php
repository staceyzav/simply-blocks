<?php
/**
 * Plugin Name: Simply Blocks
 * Plugin URI:  https://simplydesign.com
 * Description: Simply Design Gutenberg block library. Type "simply" in the editor to see all blocks.
 * Author:      Simply Design
 * Author URI:  https://simplydesign.com
 * Version:     1.0.34
 * License:     GPL-2.0-or-later
 * Text Domain: simply-blocks
 */

if ( ! defined( 'ABSPATH' ) ) exit;

require_once plugin_dir_path( __FILE__ ) . 'includes/class-github-updater.php';
new Simply_GitHub_Updater( 'plugin', plugin_basename( __FILE__ ), 'staceyzav/simply-blocks', '1.0.34' );

add_action( 'enqueue_block_editor_assets', 'simply_blocks_enqueue_editor_brand' );
function simply_blocks_enqueue_editor_brand() {
	wp_enqueue_script(
		'simply-blocks-brand',
		plugin_dir_url( __FILE__ ) . 'src/editor-brand.js',
		array( 'wp-hooks', 'wp-blocks' ),
		'1.0.0',
		true
	);
}

add_action( 'init', 'simply_blocks_register' );
function simply_blocks_register() {
	register_block_type( __DIR__ . '/build/columns' );
	register_block_type( __DIR__ . '/build/column' );
	register_block_type( __DIR__ . '/build/stats' );
	register_block_type( __DIR__ . '/build/pricing' );
	register_block_type( __DIR__ . '/build/faqs', [
		'render_callback' => 'simply_blocks_render_faqs',
	] );
	register_block_type( __DIR__ . '/build/news', [
		'render_callback' => 'simply_blocks_render_news',
	] );
	register_block_type( __DIR__ . '/build/logo-slider', [
		'render_callback' => 'simply_blocks_render_logo_slider',
	] );
	register_block_type( __DIR__ . '/build/section', [
		'render_callback' => 'simply_blocks_render_section',
	] );
	register_block_type( __DIR__ . '/build/events', [
		'render_callback' => 'simply_blocks_render_events',
	] );
	register_block_type( __DIR__ . '/build/reviews', [
		'render_callback' => 'simply_blocks_render_reviews',
	] );
	register_block_type( __DIR__ . '/build/team', [
		'render_callback' => 'simply_blocks_render_team',
	] );
}

add_filter( 'block_categories_all', 'simply_blocks_category' );
function simply_blocks_category( $categories ) {
	return array_merge(
		[ [ 'slug' => 'simply-blocks', 'title' => 'Simply Design' ] ],
		$categories
	);
}

/**
 * Render callback for Simply Section.
 * PHP handles all output so muted/autoplay video attributes serialize correctly.
 *
 * @param array  $attrs   Block attributes.
 * @param string $content Inner blocks HTML.
 */
function simply_blocks_render_section( $attrs, $content ) {
	$a = wp_parse_args( $attrs, [
		'sectionColor'          => '',
		'innerWidth'            => 1200,
		'paddingTop'            => 80,
		'paddingBottom'         => 80,
		'paddingLeft'           => 5,
		'paddingRight'          => 5,
		'paddingUnit'           => 'px',
		'marginTop'             => 0,
		'marginBottom'          => 0,
		'innerWidthUnit'        => 'px',
		'minHeight'             => 0,
		'minHeightUnit'         => 'px',
		'verticalAlign'         => 'center',
		'bgPositionX'           => 'center',
		'bgPositionY'           => 'center',
		'bgType'                => 'none',
		'bgColor'               => '#ffffff',
		'bgColorOpacity'        => 100,
		'bgImageUrl'            => '',
		'bgImagePosition'       => 'center center',
		'bgImageSize'           => 'cover',
		'bgImageFixed'          => false,
		'bgVideoUrl'            => '',
		'bgVideoWebmUrl'        => '',
		'bgVideoPosterUrl'      => '',
		'overlayColor'          => '#000000',
		'overlayOpacity'        => 0,
		'overlayBlendMode'      => 'normal',
		'mobilePaddingEnabled'  => false,
		'mobilePaddingTop'      => 40,
		'mobilePaddingBottom'   => 40,
	] );

	// ── Outer section styles ────────────────────────────────────────
	$padding_unit     = in_array( $a['paddingUnit'], [ 'px', '%' ], true ) ? $a['paddingUnit'] : 'px';
	$inner_width_unit = in_array( $a['innerWidthUnit'], [ 'px', '%' ], true ) ? $a['innerWidthUnit'] : 'px';

	$outer_styles = [
		'padding-top'    => absint( $a['paddingTop'] ) . $padding_unit,
		'padding-bottom' => absint( $a['paddingBottom'] ) . $padding_unit,
	];

	if ( intval( $a['marginTop'] ) !== 0 ) {
		$outer_styles['margin-top'] = intval( $a['marginTop'] ) . 'px';
	}
	if ( intval( $a['marginBottom'] ) !== 0 ) {
		$outer_styles['margin-bottom'] = intval( $a['marginBottom'] ) . 'px';
	}

	if ( absint( $a['minHeight'] ) > 0 ) {
		$min_height_unit                 = in_array( $a['minHeightUnit'], [ 'px', 'vh' ], true ) ? $a['minHeightUnit'] : 'px';
		$outer_styles['min-height']      = absint( $a['minHeight'] ) . $min_height_unit;
		$outer_styles['display']         = 'flex';
		$outer_styles['flex-direction']  = 'column';
		$outer_styles['justify-content'] = sanitize_text_field( $a['verticalAlign'] );
	}

	if ( $a['bgType'] === 'color' && ! empty( $a['bgColor'] ) ) {
		$opacity  = max( 0, min( 100, absint( $a['bgColorOpacity'] ) ) ) / 100;
		$raw      = sanitize_text_field( $a['bgColor'] );
		$hex_body = ltrim( $raw, '#' );
		if ( strlen( $hex_body ) === 8 ) {
			// 8-digit hex (#rrggbbaa) from Gutenberg ColorPicker — strip alpha channel
			$raw = '#' . substr( $hex_body, 0, 6 );
		}
		if ( preg_match( '/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/', $raw ) ) {
			$outer_styles['background-color'] = simply_blocks_hex_to_rgba( $raw, $opacity );
		} else {
			// rgba(), rgb(), hsl(), named color — pass through directly
			$outer_styles['background-color'] = $raw;
		}
	}

	$outer_style_str = simply_blocks_styles( $outer_styles );

	// ── Wrapper class list ──────────────────────────────────────────
	$hero_types = [ 'is-home-hero', 'is-page-hero' ];
	$classes    = array_filter( [ 'simply-section', sanitize_html_class( $a['sectionColor'] ) ] );
	if ( in_array( $a['sectionColor'], $hero_types, true ) ) {
		$classes[] = 'hero';
	}

	// ── Mobile padding (scoped <style>, UID added before wrapper build) ─
	$mobile_style_html = '';
	if ( ! empty( $a['mobilePaddingEnabled'] ) ) {
		$uid       = wp_unique_id( 'sb-sec-' );
		$classes[] = $uid;
		$mobile_style_html = sprintf(
			'<style>@media(max-width:767px){.%s{padding-top:%dpx!important;padding-bottom:%dpx!important;}}</style>',
			esc_attr( $uid ),
			absint( $a['mobilePaddingTop'] ),
			absint( $a['mobilePaddingBottom'] )
		);
	}

	// ── Wrapper attributes ──────────────────────────────────────────
	// Style is appended directly — avoids WP filtering that can strip rgba() values.
	$wrapper_attrs = get_block_wrapper_attributes( [
		'class' => implode( ' ', $classes ),
	] );
	if ( $outer_style_str ) {
		$wrapper_attrs .= ' style="' . esc_attr( $outer_style_str ) . '"';
	}

	// ── Background image ────────────────────────────────────────────
	$bg_image_html = '';
	if ( $a['bgType'] === 'image' && ! empty( $a['bgImageUrl'] ) ) {
		$bg_styles = simply_blocks_styles( [
			'background-image'      => 'url(' . esc_url( $a['bgImageUrl'] ) . ')',
			'background-position'   => sanitize_text_field( $a['bgPositionX'] ) . ' ' . sanitize_text_field( $a['bgPositionY'] ),
			'background-size'       => sanitize_text_field( $a['bgImageSize'] ),
			'background-attachment' => $a['bgImageFixed'] ? 'fixed' : 'scroll',
		] );
		$bg_image_html = '<div class="simply-section__bg-image" style="' . esc_attr( $bg_styles ) . '"></div>';
	}

	// ── Video background ────────────────────────────────────────────
	$bg_video_html = '';
	if ( $a['bgType'] === 'video' && ! empty( $a['bgVideoUrl'] ) ) {
		$youtube_id = simply_blocks_get_youtube_id( $a['bgVideoUrl'] );

		if ( $youtube_id ) {
			// YouTube iframe embed
			$embed_url = add_query_arg( [
				'autoplay'       => 1,
				'mute'           => 1,
				'loop'           => 1,
				'playlist'       => $youtube_id, // required for loop to work
				'controls'       => 0,
				'rel'            => 0,
				'playsinline'    => 1,
				'modestbranding' => 1,
				'iv_load_policy' => 3,
				'disablekb'      => 1,
			], 'https://www.youtube.com/embed/' . $youtube_id );

			// Mobile fallback: show thumbnail as bg image when video wrap is hidden
			$thumb_url   = 'https://img.youtube.com/vi/' . $youtube_id . '/maxresdefault.jpg';
			$mobile_style = 'background-image:url(' . esc_url( $thumb_url ) . ');background-size:cover;background-position:center center;';

			$bg_video_html = sprintf(
				'<div class="simply-section__bg-video-wrap simply-section__bg-video-wrap--youtube" style="%s">
					<iframe src="%s" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
				</div>',
				esc_attr( $mobile_style ),
				esc_url( $embed_url )
			);
		} else {
			// Self-hosted / direct file — WebM first (smaller), MP4 as fallback
			$poster       = ! empty( $a['bgVideoPosterUrl'] ) ? ' poster="' . esc_url( $a['bgVideoPosterUrl'] ) . '"' : '';
			$webm_source  = ! empty( $a['bgVideoWebmUrl'] )
				? '<source src="' . esc_url( $a['bgVideoWebmUrl'] ) . '" type="video/webm">' . "\n\t\t\t\t\t"
				: '';

			$bg_video_html = sprintf(
				'<div class="simply-section__bg-video-wrap">
					<video class="simply-section__bg-video" autoplay muted loop playsinline%s>
						%s<source src="%s" type="video/mp4">
					</video>
				</div>',
				$poster,
				$webm_source,
				esc_url( $a['bgVideoUrl'] )
			);
		}
	}

	// ── Overlay ─────────────────────────────────────────────────────
	$overlay_html = '';
	if ( in_array( $a['bgType'], [ 'image', 'video' ], true ) && absint( $a['overlayOpacity'] ) > 0 ) {
		$overlay_styles = simply_blocks_styles( [
			'background-color' => sanitize_hex_color( $a['overlayColor'] ),
			'opacity'          => ( max( 0, min( 100, absint( $a['overlayOpacity'] ) ) ) / 100 ),
			'mix-blend-mode'   => sanitize_text_field( $a['overlayBlendMode'] ),
		] );
		$overlay_html = '<div class="simply-section__overlay" style="' . esc_attr( $overlay_styles ) . '"></div>';
	}

	// ── Inner container ─────────────────────────────────────────────
	$inner_styles = simply_blocks_styles( [
		'max-width'     => absint( $a['innerWidth'] ) . $inner_width_unit,
		'padding-left'  => absint( $a['paddingLeft'] ) . $padding_unit,
		'padding-right' => absint( $a['paddingRight'] ) . $padding_unit,
	] );

	return sprintf(
		'%s<div %s>%s%s%s<div class="simply-section__inner" style="%s">%s</div></div>',
		$mobile_style_html,
		$wrapper_attrs,
		$bg_image_html,
		$bg_video_html,
		$overlay_html,
		esc_attr( $inner_styles ),
		$content
	);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function simply_blocks_hex_to_rgba( $hex, $opacity ) {
	$hex = ltrim( $hex, '#' );
	if ( strlen( $hex ) === 3 ) {
		$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
	}
	$r = hexdec( substr( $hex, 0, 2 ) );
	$g = hexdec( substr( $hex, 2, 2 ) );
	$b = hexdec( substr( $hex, 4, 2 ) );
	return "rgba($r,$g,$b,$opacity)";
}

/**
 * Render callback for Simply News.
 */
function simply_blocks_render_news( $attrs ) {
	$a = wp_parse_args( $attrs, [
		'limit'        => 3,
		'columns'      => 3,
		'category'     => '',
		'readMore'     => 'Read More',
		'heading'      => '',
		'showDate'     => true,
		'showCategory' => true,
		'showReadMore' => true,
		'showFilters'  => true,
		'orderBy'      => 'date',
	] );

	$columns   = max( 1, min( 4, absint( $a['columns'] ) ) );
	$read_more = esc_html( $a['readMore'] );
	$heading   = esc_html( $a['heading'] );
	$show_date = (bool) $a['showDate'];
	$show_cat  = (bool) $a['showCategory'];
	$show_more = (bool) $a['showReadMore'];

	$cards_html = simply_blocks_news_cards( $a['category'], $a );
	if ( ! $cards_html ) return '';

	// ── Filter buttons — suppressed when a category is pre-selected ─────────
	$filters_html = '';
	if ( (bool) $a['showFilters'] && empty( $a['category'] ) ) {
		$cats = get_categories( [ 'hide_empty' => true, 'orderby' => 'name', 'order' => 'ASC' ] );
		if ( count( $cats ) > 1 ) {
			$filters_html  = '<div class="sn-filters">';
			$filters_html .= '<button class="sn-filter-btn is-active" data-category="">' . __( 'All', 'simply-blocks' ) . '</button>';
			foreach ( $cats as $cat ) {
				$filters_html .= '<button class="sn-filter-btn" data-category="' . esc_attr( $cat->slug ) . '">'
					. esc_html( $cat->name ) . '</button>';
			}
			$filters_html .= '</div>';
		}
	}

	// ── Wrapper with data attributes for JS ─────────────────────────────────
	$wrapper_attrs = get_block_wrapper_attributes( [
		'data-ajax'          => admin_url( 'admin-ajax.php' ),
		'data-nonce'         => wp_create_nonce( 'sn_filter_nonce' ),
		'data-limit'         => absint( $a['limit'] ),
		'data-columns'       => $columns,
		'data-read-more'     => esc_attr( $a['readMore'] ),
		'data-show-date'     => $show_date ? '1' : '0',
		'data-show-cat'      => $show_cat  ? '1' : '0',
		'data-show-more'     => $show_more ? '1' : '0',
		'data-order-by'      => sanitize_key( $a['orderBy'] ),
		'data-base-category' => sanitize_text_field( $a['category'] ),
	] );

	ob_start();
	if ( $heading ) echo '<h2 class="sn-heading">' . $heading . '</h2>';
	?>
	<div <?php echo $wrapper_attrs; ?>>
		<?php echo $filters_html; ?>
		<div class="sn-grid sn-feed" style="--sn-columns:<?php echo $columns; ?>">
			<?php echo $cards_html; ?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * AJAX handler — returns rendered card HTML for the selected category filter.
 */
add_action( 'wp_ajax_sn_filter',        'simply_blocks_ajax_news_filter' );
add_action( 'wp_ajax_nopriv_sn_filter', 'simply_blocks_ajax_news_filter' );

function simply_blocks_ajax_news_filter() {
	check_ajax_referer( 'sn_filter_nonce', 'nonce' );

	$category = sanitize_text_field( $_POST['category'] ?? '' );

	$a = [
		'limit'        => absint( $_POST['limit']    ?? 3 ),
		'columns'      => absint( $_POST['columns']  ?? 3 ),
		'readMore'     => sanitize_text_field( $_POST['readMore'] ?? 'Read More' ),
		'showDate'     => ( $_POST['showDate']  ?? '1' ) === '1',
		'showCategory' => ( $_POST['showCat']   ?? '1' ) === '1',
		'showReadMore' => ( $_POST['showMore']  ?? '1' ) === '1',
		'orderBy'      => sanitize_key( $_POST['orderBy'] ?? 'date' ),
	];

	// If a category filter is active, AND with the block's base category
	if ( empty( $category ) ) {
		$category = sanitize_text_field( $_POST['baseCategory'] ?? '' );
	}

	$html = simply_blocks_news_cards( $category, $a );
	wp_send_json_success( [
		'html' => $html ?: '<p class="sn-no-posts">' . esc_html__( 'No posts found.', 'simply-blocks' ) . '</p>',
	] );
}

/**
 * Shared card rendering — used by both render_callback and AJAX handler.
 */
function simply_blocks_news_cards( $category, $a ) {
	$query_args = [
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => absint( $a['limit'] ),
		'orderby'        => sanitize_key( $a['orderBy'] ),
		'order'          => $a['orderBy'] === 'title' ? 'ASC' : 'DESC',
	];
	if ( ! empty( $category ) ) {
		$slugs = array_filter( array_map( 'trim', explode( ',', sanitize_text_field( $category ) ) ) );
		if ( ! empty( $slugs ) ) {
			$query_args['tax_query'] = [ [
				'taxonomy' => 'category',
				'field'    => 'slug',
				'terms'    => $slugs,
				'operator' => 'IN',
			] ];
		}
	}

	$posts = new WP_Query( $query_args );
	if ( ! $posts->have_posts() ) return '';

	$read_more = esc_html( $a['readMore'] );
	$show_date = (bool) $a['showDate'];
	$show_cat  = (bool) $a['showCategory'];
	$show_more = (bool) $a['showReadMore'];

	ob_start();
	while ( $posts->have_posts() ) :
		$posts->the_post();
		$cats      = get_the_category();
		$cat_label = $cats
			? implode( ' | ', array_map( fn( $c ) => esc_html( strtoupper( $c->name ) ), $cats ) )
			: '';
		$permalink = get_permalink();
		?>
		<article class="sn-card">
			<a class="sn-card__link" href="<?php echo esc_url( $permalink ); ?>" aria-label="<?php echo esc_attr( get_the_title() ); ?>"></a>
			<?php if ( has_post_thumbnail() ) : ?>
			<div class="sn-card__photo">
				<?php the_post_thumbnail( 'large', [ 'alt' => esc_attr( get_the_title() ) ] ); ?>
			</div>
			<?php endif; ?>
			<div class="sn-card__body">
				<?php if ( $show_cat && $cat_label ) : ?>
				<p class="sn-card__category"><?php echo $cat_label; ?></p>
				<?php endif; ?>
				<h3 class="sn-card__title"><?php the_title(); ?></h3>
				<?php if ( $show_date && ! get_post_meta( get_the_ID(), '_simply_hide_date', true ) ) : ?>
				<p class="sn-card__date"><?php echo esc_html( get_the_date() ); ?></p>
				<?php endif; ?>
				<?php if ( $show_more ) : ?>
				<span class="sn-card__read-more"><?php echo $read_more; ?></span>
				<?php endif; ?>
			</div>
		</article>
		<?php
	endwhile;
	wp_reset_postdata();
	return ob_get_clean();
}

/**
 * Render callback for Simply Logo Slider.
 * Handles both custom (block-managed) and global (CPT) logo sources.
 */
function simply_blocks_render_logo_slider( $attrs ) {
	$a = wp_parse_args( $attrs, [
		'source'    => 'custom',
		'logos'     => [],
		'limit'     => -1,
		'height'    => 60,
		'speed'     => 30,
		'gap'       => 80,
		'grayscale' => true,
	] );

	$items = [];

	if ( $a['source'] === 'global' ) {
		// Pull from simply_logo CPT
		$query = new WP_Query( [
			'post_type'      => 'simply_logo',
			'posts_per_page' => intval( $a['limit'] ),
			'post_status'    => 'publish',
			'orderby'        => 'menu_order',
			'order'          => 'ASC',
		] );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$img_url = get_the_post_thumbnail_url( get_the_ID(), 'large' );
				if ( ! $img_url ) continue;
				$items[] = [
					'url'   => $img_url,
					'alt'   => get_the_title(),
					'link'  => get_post_meta( get_the_ID(), '_logo_url',  true ),
					'boost' => get_post_meta( get_the_ID(), '_logo_boost', true ),
				];
			}
			wp_reset_postdata();
		}
	} else {
		// Custom logos from block attributes
		foreach ( (array) $a['logos'] as $logo ) {
			if ( empty( $logo['url'] ) ) continue;
			$items[] = [
				'url'   => $logo['url'],
				'alt'   => $logo['alt']   ?? '',
				'link'  => $logo['link']  ?? '',
				'boost' => $logo['boost'] ?? false,
			];
		}
	}

	if ( empty( $items ) ) return '';

	$slider_class = implode( ' ', array_filter( [
		'sls-slider',
		$a['grayscale'] ? '' : 'sls-slider--no-grayscale',
	] ) );

	$inline = sprintf(
		'--sls-height:%dpx;--sls-gap:%dpx;--sls-speed:%ds;',
		absint( $a['height'] ),
		absint( $a['gap'] ),
		absint( $a['speed'] )
	);

	$wrapper_attrs = get_block_wrapper_attributes( [
		'class'    => $slider_class,
		'style'    => $inline,
		'data-sls' => '',
	] );

	$logos_html = '';
	foreach ( $items as $item ) {
		$img   = '<img src="' . esc_url( $item['url'] ) . '" alt="' . esc_attr( $item['alt'] ) . '" loading="eager">';
		$link  = $item['link'] ?? '';
		$class = 'sls-logo' . ( ! empty( $item['boost'] ) ? ' sls-logo--boost' : '' );
		$logos_html .= $link
			? '<a class="' . esc_attr( $class ) . '" href="' . esc_url( $link ) . '" target="_blank" rel="noopener noreferrer">' . $img . '</a>'
			: '<span class="' . esc_attr( $class ) . '">' . $img . '</span>';
	}

	return sprintf(
		'<div %s><div class="sls-track">%s</div></div>',
		$wrapper_attrs,
		$logos_html
	);
}

/**
 * Extract YouTube video ID from any YouTube URL format.
 * Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function simply_blocks_get_youtube_id( $url ) {
	$pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/';
	if ( preg_match( $pattern, $url, $matches ) ) {
		return $matches[1];
	}
	return false;
}

/**
 * Render callback for Simply FAQs block.
 * Delegates to sf_shortcode() so there's no logic duplication.
 */
function simply_blocks_render_faqs( $attrs ) {
	$source = $attrs['source'] ?? 'cpt';

	// ── Custom one-offs ─────────────────────────────────────────────────────
	if ( $source === 'custom' ) {
		$items = $attrs['items'] ?? [];
		if ( empty( $items ) ) return '';

		ob_start();
		?>
		<div class="sf-faqs-block">
			<div class="sf-faqs">
				<?php foreach ( $items as $item ) :
					$question = wp_kses_post( $item['question'] ?? '' );
					$answer   = wp_kses_post( $item['answer']   ?? '' );
					if ( ! $question ) continue;
				?>
				<div class="sf-faq" data-category="">
					<button class="sf-faq__question" aria-expanded="false">
						<span class="sf-faq__question-text"><?php echo $question; ?></span>
						<span class="sf-faq__icon" aria-hidden="true"></span>
					</button>
					<div class="sf-faq__answer">
						<div class="sf-faq__answer-inner">
							<?php echo wpautop( $answer ); ?>
						</div>
					</div>
				</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	// ── CPT feed ────────────────────────────────────────────────────────────
	if ( ! function_exists( 'sf_shortcode' ) ) {
		return '<p style="font-style:italic;opacity:0.6">' . esc_html__( 'Simply FAQs plugin required.', 'simply-blocks' ) . '</p>';
	}
	return sf_shortcode( array(
		'category' => sanitize_text_field( $attrs['category'] ?? '' ),
		'limit'    => intval( $attrs['limit'] ?? -1 ),
	) );
}

/**
 * Render callback for Simply Events.
 * Replicates the [simply_events] shortcode query so the block supports
 * multi-category filtering (comma-separated slugs) and all sidebar options.
 * Requires Simply Events plugin to be active.
 */
function simply_blocks_render_events( $attrs ) {
	if ( ! post_type_exists( 'simply_event' ) ) {
		return '<p style="font-style:italic;opacity:0.6">' . esc_html__( 'Simply Events plugin required.', 'simply-blocks' ) . '</p>';
	}

	$a = wp_parse_args( $attrs, [
		'limit'       => 5,
		'category'    => '',
		'showFuture'  => true,
		'showPast'    => false,
		'order'       => 'ASC',
		'view'        => 'grid',
		'title'       => __( 'Upcoming Events', 'simply-blocks' ),
		'showFilter'  => true,
		'ctaText'     => '',
		'ctaUrl'      => '',
	] );

	$limit       = absint( $a['limit'] );
	$show_filter = (bool) $a['showFilter'] && empty( $a['category'] );
	$show_future = (bool) $a['showFuture'];
	$show_past   = (bool) $a['showPast'];
	$order       = strtoupper( $a['order'] ) === 'DESC' ? 'DESC' : 'ASC';
	$view        = $a['view'] === 'list' ? 'list' : 'grid';
	$title       = esc_html( $a['title'] );
	$cta_text    = esc_html( $a['ctaText'] );
	$cta_url     = esc_url( $a['ctaUrl'] );

	$meta_query = [];
	if ( $show_future && ! $show_past ) {
		$meta_query[] = [
			'key'     => '_event_start_date',
			'value'   => current_time( 'Y-m-d' ),
			'compare' => '>=',
			'type'    => 'DATE',
		];
	} elseif ( $show_past && ! $show_future ) {
		$meta_query[] = [
			'key'     => '_event_start_date',
			'value'   => current_time( 'Y-m-d' ),
			'compare' => '<',
			'type'    => 'DATE',
		];
	}
	// Both or neither → no date restriction

	$query_args = [
		'post_type'      => 'simply_event',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
		'meta_key'       => '_event_start_date',
		'orderby'        => 'meta_value',
		'order'          => $order,
	];

	if ( ! empty( $meta_query ) ) {
		$query_args['meta_query'] = $meta_query;
	}

	if ( ! empty( $a['category'] ) ) {
		$slugs = array_filter( array_map( 'trim', explode( ',', sanitize_text_field( $a['category'] ) ) ) );
		if ( ! empty( $slugs ) ) {
			$query_args['tax_query'] = [ [
				'taxonomy' => 'simply_event_cat',
				'field'    => 'slug',
				'terms'    => $slugs,
				'operator' => 'IN',
			] ];
		}
	}

	$events = new WP_Query( $query_args );

	$categories = get_terms( [
		'taxonomy'   => 'simply_event_cat',
		'hide_empty' => true,
		'orderby'    => 'name',
	] );

	ob_start();
	?>
	<div class="se-events-block" data-limit="<?php echo esc_attr( $limit ); ?>">

		<div class="se-events-header">

			<h2 class="se-events-title"><?php echo $title; ?></h2>

			<?php if ( $show_filter && ! is_wp_error( $categories ) && ! empty( $categories ) ) : ?>
			<nav class="se-events-filter" aria-label="<?php esc_attr_e( 'Filter events by category', 'simply-blocks' ); ?>">
				<button class="se-filter-btn is-active" data-cat="all">
					<?php esc_html_e( 'All', 'simply-blocks' ); ?>
				</button>
				<?php foreach ( $categories as $cat ) : ?>
				<button class="se-filter-btn" data-cat="<?php echo esc_attr( $cat->slug ); ?>">
					<?php echo esc_html( $cat->name ); ?>
				</button>
				<?php endforeach; ?>
			</nav>
			<?php endif; ?>

			<?php if ( $cta_url && $cta_text ) : ?>
			<a href="<?php echo $cta_url; ?>" class="se-events-cta">
				<?php echo $cta_text; ?>
			</a>
			<?php endif; ?>

		</div>

		<?php if ( $events->have_posts() ) : ?>
		<div class="se-events-<?php echo esc_attr( $view ); ?>"><?php // phpcs:ignore ?>
			<?php while ( $events->have_posts() ) : $events->the_post();
				$post_id   = get_the_ID();
				$start     = get_post_meta( $post_id, '_event_start_date', true );
				$end       = get_post_meta( $post_id, '_event_end_date',   true );
				$location  = get_post_meta( $post_id, '_event_location',   true );

				$terms     = get_the_terms( $post_id, 'simply_event_cat' );
				$cat_slugs = ( $terms && ! is_wp_error( $terms ) ) ? implode( ' ', wp_list_pluck( $terms, 'slug' ) ) : '';
				$cat_label = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : '';

				$start_ts    = $start ? strtotime( $start ) : false;
				$end_ts      = ( $end && $end !== $start ) ? strtotime( $end ) : false;
				$start_day   = $start_ts ? date( 'd', $start_ts ) : '';
				$start_month = $start_ts ? date( 'M', $start_ts ) : '';
				$start_year  = $start_ts ? date( 'Y', $start_ts ) : '';
				$end_day     = $end_ts   ? date( 'd', $end_ts )   : '';
				$end_month   = $end_ts   ? date( 'M', $end_ts )   : '';
			?>
				<article class="se-event-card ss-card" data-cats="<?php echo esc_attr( $cat_slugs ); ?>">

					<div class="se-event-card__date">
						<div class="se-event-card__date-start">
							<span class="se-event-card__day"><?php echo esc_html( $start_day ); ?></span>
							<span class="se-event-card__month"><?php echo esc_html( strtoupper( $start_month ) ); ?></span>
						</div>
						<?php if ( $end_ts ) : ?>
						<div class="se-event-card__date-end">
							<span class="se-event-card__sep">-</span>
							<div class="se-event-card__date-end-col">
								<span class="se-event-card__day se-event-card__day--small"><?php echo esc_html( $end_day ); ?></span>
								<span class="se-event-card__month"><?php echo esc_html( strtoupper( $end_month ) ); ?></span>
							</div>
						</div>
						<?php endif; ?>
						<?php if ( $start_year ) : ?>
						<span class="se-event-card__year"><?php echo esc_html( $start_year ); ?></span>
						<?php endif; ?>
					</div>

					<div class="se-event-card__body ss-card-body">
						<h3 class="se-event-card__title">
							<a href="<?php echo esc_url( get_permalink() ); ?>" class="se-event-card__title-link"><?php the_title(); ?></a>
						</h3>
						<?php if ( $location ) : ?>
						<p class="se-event-card__location"><?php echo esc_html( $location ); ?></p>
						<?php endif; ?>
						<?php if ( $cat_label ) : ?>
						<p class="se-event-card__category"><?php echo esc_html( $cat_label ); ?></p>
						<?php endif; ?>
					</div>

				</article>
			<?php endwhile; wp_reset_postdata(); ?>
		</div>

		<?php else : ?>
		<p class="se-events-empty"><?php esc_html_e( 'No upcoming events scheduled.', 'simply-blocks' ); ?></p>
		<?php endif; ?>

	</div>
	<?php
	return ob_get_clean();
}

// ── Simply Reviews render callback ───────────────────────────────────────────

function simply_blocks_render_team( $attrs ) {
	if ( ! shortcode_exists( 'simply_team' ) ) {
		return '<p style="font-style:italic;opacity:0.6">' . esc_html__( 'Simply Team plugin required.', 'simply-blocks' ) . '</p>';
	}

	$limit   = isset( $attrs['limit'] )   ? intval( $attrs['limit'] )   : -1;
	$columns = isset( $attrs['columns'] ) ? intval( $attrs['columns'] ) : 3;

	$sc  = '[simply_team';
	$sc .= ' limit="'   . $limit   . '"';
	$sc .= ' columns="' . $columns . '"';
	if ( ! empty( $attrs['category'] ) ) $sc .= ' category="' . esc_attr( $attrs['category'] ) . '"';
	$sc .= ']';

	return do_shortcode( $sc );
}

function simply_blocks_render_reviews( $attrs ) {
	if ( ! function_exists( 'sr_shortcode' ) ) {
		return '<p style="font-style:italic;opacity:0.6">' . esc_html__( 'Simply Reviews plugin required.', 'simply-blocks' ) . '</p>';
	}

	$limit    = isset( $attrs['limit'] )    ? intval( $attrs['limit'] )    : -1;
	$autoplay = isset( $attrs['autoplay'] ) ? intval( $attrs['autoplay'] ) : 0;
	$min      = isset( $attrs['minStars'] ) ? intval( $attrs['minStars'] ) : 1;

	$sc  = '[simply_reviews';
	$sc .= ' limit="'      . $limit . '"';
	$sc .= ' show_name="'  . ( ! empty( $attrs['showName'] )   ? '1' : '0' ) . '"';
	$sc .= ' show_source="'. ( ! empty( $attrs['showSource'] ) ? '1' : '0' ) . '"';
	$sc .= ' show_date="'  . ( ! empty( $attrs['showDate'] )   ? '1' : '0' ) . '"';
	$sc .= ' min_stars="'  . $min . '"';
	if ( ! empty( $attrs['source'] ) )   $sc .= ' source="'   . esc_attr( $attrs['source'] )   . '"';
	if ( ! empty( $attrs['category'] ) ) $sc .= ' category="' . esc_attr( $attrs['category'] ) . '"';
	if ( $autoplay > 0 )                 $sc .= ' autoplay="' . $autoplay . '"';
	$sc .= ']';

	return do_shortcode( $sc );
}

function simply_blocks_styles( $props ) {
	$parts = [];
	foreach ( $props as $prop => $value ) {
		$parts[] = $prop . ':' . $value;
	}
	return implode( ';', $parts );
}
