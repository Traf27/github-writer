/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Editor from '../editor/editor';

export default class NewCommentEditor extends Editor {
	static run() {
		return this.createEditor( 'form.js-new-comment-form' );
	}
}
