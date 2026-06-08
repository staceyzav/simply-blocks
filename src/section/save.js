import { InnerBlocks } from '@wordpress/block-editor';

// Dynamic block — PHP render_callback handles all HTML output.
// save() only preserves inner block content for the render_callback's $content param.
export default function save() {
	return <InnerBlocks.Content />;
}
