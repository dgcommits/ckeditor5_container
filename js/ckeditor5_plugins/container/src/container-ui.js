import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import containerIcon from '../../../icons/quote.svg'; // Or your actual SVG path

export default class ContainerUI extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('toggleContainer', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert Container',
        icon: containerIcon,
        tooltip: true,
      });

      // Execute command when clicked
      view.on('execute', () => {
        editor.model.change(writer => {
          const container = writer.createElement('container');
          editor.model.insertContent(container);
          writer.setSelection(container, 'in');
        });
      });

      return view;
    });
  }
}
