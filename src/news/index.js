import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import metadata from './block.json';
import Edit from './edit';

// Dynamic block — PHP render_callback handles all output
registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
