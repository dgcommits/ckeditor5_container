import { Plugin } from 'ckeditor5/src/core';
import ContainerEditing from './container-editing';
import ContainerUI from './container-ui';

export default class Container extends Plugin {
  static get requires() {
    return [ ContainerEditing, ContainerUI ];
  }

  init() {
    // 🌐 Expose for dev tools
    window.containerEditor = this.editor;
  }
}
