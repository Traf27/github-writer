/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Editor from '../editor/editor';

export default class ReviewEditor extends Editor {
	get type() {
		return 'ReviewEditor';
	}

	static run() {
		return this.createEditor( 'div.pull-request-review-menu > form' );
	}
}
