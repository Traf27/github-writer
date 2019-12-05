/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * Enables `tab` and `shift+tab` to decrease and increase the heading level.
 */
export default class HeadingTabKey extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		{
			const command = new ChangeHeadingLevelCommand( editor, -1 );
			editor.commands.add( 'decreaseHeading', command );

			editor.keystrokes.set( 'Tab', ( undefined, cancel ) => {
				command.execute();
				cancel();
			} );
		}

		{
			const command = new ChangeHeadingLevelCommand( editor, 1 );
			editor.commands.add( 'increaseHeading', command );

			editor.keystrokes.set( 'Shift+Tab', ( undefined, cancel ) => {
				command.execute();
				cancel();
			} );
		}
	}
}

/**
 * A command that changes the level of the current heading under the selection by a number of steps.
 */
export class ChangeHeadingLevelCommand extends Command {
	/**
	 * Creates a new `ChangeHeadingLevelCommand` instance.
	 *
	 * @param {Editor} editor Editor on which this command will be used.
	 * @param {Number} steps The number of levels to increase (or decrease, if negative) when the command is executed.
	 */
	constructor( editor, steps ) {
		super( editor );

		/**
		 * The number of levels to increase (or decrease, if negative) when the command is executed.
		 *
		 * @type {Number}
		 */
		this.steps = steps;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const { heading, next } = this._getCurrentHeadingAndIndex();

		this.isEnabled = !!( heading && heading.name !== next );
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const editor = this.editor;
		const { heading, next } = this._getCurrentHeadingAndIndex();

		if ( heading && heading.name !== next ) {
			editor.model.change( writer => {
				// Rename the block to the heading name in the list under the next index.
				writer.rename( heading, next );
			} );
		}
	}

	/**
	 * Runs most of the logic of the command.
	 *
	 * @returns {{heading: (Element|null), next: String}} An object with the following properties:
	 *  - heading: the heading element under selection or `null` if not found.
	 *  - next: the next heading element name to switch to if the comment would be ever executed.
	 *          It could be the same as heading.name, if there are no more levels available.
	 * @private
	 */
	_getCurrentHeadingAndIndex() {
		const editor = this.editor;
		const selection = editor.model.document.selection;
		const selectedBlocks = selection.getSelectedBlocks();

		// Get the first block, which could be a heading.
		const block = selectedBlocks.next().value;

		// Check if there is just one block under selection.
		const oneBlock = selectedBlocks.next().done;

		let next;

		// The command allows one block selected only.
		if ( oneBlock ) {
			// Get the list of heading elements.
			const headingElements = editor.commands.get( 'heading' ).modelElements;

			// Check if the block is one of the heading elements.
			const index = headingElements.indexOf( block.name );

			// If found, calculates the next index to be used.
			if ( index >= 0 ) {
				// The list of headings is ordered from bigger to smaller, so we invert the steps.
				const steps = -this.steps;

				let nextIndex = index + steps;

				if ( nextIndex < 0 ) {
					nextIndex = 0;
				}

				if ( nextIndex > headingElements.length ) {
					nextIndex = headingElements.length - 1;
				}

				next = headingElements[ nextIndex ];
			}
		}

		return {
			heading: next ? block : null,
			next
		};
	}
}