import './editor.scss';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps( { className: 'simply-column' } );

	return (
		<div { ...blockProps }>
			<InnerBlocks />
		</div>
	);
}
