(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["container"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "ckeditor5/src/core.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/core.js");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/ui.js");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/widget.js");

/***/ }),

/***/ "dll-reference CKEditor5.dll":
/***/ ((module) => {

"use strict";
module.exports = CKEditor5.dll;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// EXTERNAL MODULE: delegated ./core.js from dll-reference CKEditor5.dll
var delegated_corefrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/core.js");
;// ./js/ckeditor5_plugins/container/src/InsertContainerCommand.js



class InsertContainerCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();
    const anchor = selection.anchor;

    const isInsideContainer = node => {
      while (node && node.name !== '$root') {
        if (node.name === 'container') return true;
        node = node.parent;
      }
      return false;
    };

    this.isEnabled =
      !isInsideContainer(position.parent) &&
      !isInsideContainer(anchor.parent) &&
      model.schema.checkChild(position.parent, 'container');
  }

  execute() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();
    const anchor = selection.anchor;

    const isInsideContainer = node => {
      while (node && node.name !== '$root') {
        if (node.name === 'container') return true;
        node = node.parent;
      }
      return false;
    };

    if (isInsideContainer(position.parent) || isInsideContainer(anchor.parent)) {
      return; // Do not insert nested containers
    }

    model.change(writer => {
      const container = writer.createElement('container');
      const content = writer.createElement('containerContent');
      writer.append(content, container);

      const isCollapsed = selection.isCollapsed;

      if (!isCollapsed) {
        const fragment = model.getSelectedContent(selection);

        for (const child of Array.from(fragment.getChildren())) {
          if (child.is('text') || child.is('textProxy') || !child.is('element')) {
            const paragraph = writer.createElement('paragraph');
            writer.append(child, paragraph);
            writer.append(paragraph, content);
          } else {
            writer.append(child, content);
          }
        }
      } else {
        const paragraph = writer.createElement('paragraph');
        writer.insertText('Insert text here.', paragraph);
        writer.append(paragraph, content);
      }

      model.insertContent(container, selection.getFirstPosition());

      const firstChild = content.getChild(0);
      const pos = firstChild && firstChild.is('element') ?
        writer.createPositionAt(firstChild, 0) :
        writer.createPositionAt(content, 0);

      writer.setSelection(pos);
    });
  }
}

// EXTERNAL MODULE: delegated ./widget.js from dll-reference CKEditor5.dll
var delegated_widgetfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/widget.js");
;// ./js/ckeditor5_plugins/container/src/container-editing.js




class ContainerEditing extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  init() {
    const editor = this.editor;
    const schema = editor.model.schema;

    // Register the outer container block
    schema.register('container', {
      allowIn: ['$root', 'paragraph'],
      isObject: true,
      allowAttributes: ['class']
    });

    // Register the editable inner content
    schema.register('containerContent', {
      allowIn: 'container',
      allowContentOf: '$root'
    });

    // Allow containerContent inside paragraphs, if available
    if (schema.isRegistered('paragraph') && schema.isRegistered('containerContent')) {
      schema.extend('paragraph', {
        allowIn: 'containerContent'
      });
    }

    // Allow containers inside list items
    if (schema.isRegistered('listItem')) {
      schema.extend('listItem', {
        allowChildren: ['container']
      });
    }

    // Data conversion (saved HTML)
    editor.conversion.for('dataDowncast').elementToElement({
      model: 'container',
      view: (modelElement, { writer }) =>
        writer.createContainerElement('div', { class: 'container' })
    });

    editor.conversion.for('dataDowncast').elementToElement({
      model: 'containerContent',
      view: (modelElement, { writer }) =>
        writer.createContainerElement('div', { class: 'container-inner' })
    });

    // Editing view (in-editor widget)
    editor.conversion.for('editingDowncast').elementToElement({
      model: 'container',
      view: (modelElement, { writer }) => {
        const container = writer.createContainerElement('div', { class: 'container' });
        return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(container, writer, { label: 'Container block' });
      }
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'containerContent',
      view: (modelElement, { writer }) => {
        const editable = writer.createEditableElement('div', { class: 'container-inner' });
        return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(editable, writer);
      }
    });

    // Upcast HTML to editor model
    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'div',
        classes: 'container'
      },
      model: 'container'
    });

    // Prevent containers from nesting
    editor.model.schema.addChildCheck((context, childDefinition) => {
      if (
        childDefinition.name === 'container' &&
        context.endsWith('containerContent')
      ) {
        return false;
      }
    });

    // Add the insert command
    editor.commands.add('insertContainer', new InsertContainerCommand(editor));
  }
}
// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
;// ./icons/quote.svg
/* harmony default export */ const quote = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M0 1v16.981h4v5.019l7-5.019h13v-16.981h-24zm12 8.028c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028zm5 0c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028z\"/></svg>");
;// ./js/ckeditor5_plugins/container/src/container-ui.js





class ContainerUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  init() {
    const { editor } = this;

    // This will register the quote toolbar button.
    editor.ui.componentFactory.add('toggleContainer', (locale) => {
      const command = editor.commands.get('insertContainer');
      const buttonView = new delegated_uifrom_dll_reference_CKEditor5.ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Inline quote'),
        icon: quote,
        tooltip: true,
        isToggleable: false,
      });

      // Bind only to isEnabled since this is not a toggle command.
      buttonView.bind('isEnabled').to(command, 'isEnabled');

      // Execute the command when the button is clicked.
      this.listenTo(buttonView, 'execute', () => {
        editor.execute('insertContainer');
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }
}

;// ./js/ckeditor5_plugins/container/src/container.js




class Container extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
  static get requires() {
    return [ ContainerEditing, ContainerUI ];
  }

  init() {
    // 🌐 Expose for dev tools
    window.containerEditor = this.editor;
  }
}

;// ./js/ckeditor5_plugins/container/src/index.js
/**
 * @file The build process always expects an index.js file. Anything exported
 * here will be recognized by CKEditor 5 as an available plugin. Multiple
 * plugins can be exported in this one file.
 *
 * I.e. this file's purpose is to make plugin(s) discoverable.
 */



/* harmony default export */ const src = ({
  Container: Container,
});

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});