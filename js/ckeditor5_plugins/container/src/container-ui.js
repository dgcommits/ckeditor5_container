
import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import icon from '../../../../icons/quote.svg';

export default class ContainerUI extends Plugin {
  init() {
    const { editor } = this;

    // This will register the quote toolbar button.
    editor.ui.componentFactory.add('toggleContainer', (locale) => {
      const command = editor.commands.get('insertContainer');
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Inline quote'),
        icon,
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
