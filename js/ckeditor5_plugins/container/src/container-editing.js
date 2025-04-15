import { Plugin } from 'ckeditor5/src/core';
import InsertContainerCommand from './InsertContainerCommand';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';

export default class ContainerEditing extends Plugin {
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
        return toWidget(container, writer, { label: 'Container block' });
      }
    });

    editor.conversion.for('editingDowncast').elementToElement({
      model: 'containerContent',
      view: (modelElement, { writer }) => {
        const editable = writer.createEditableElement('div', { class: 'container-inner' });
        return toWidgetEditable(editable, writer);
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