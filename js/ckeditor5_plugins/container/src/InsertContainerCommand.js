
import { Command } from 'ckeditor5/src/core';

export default class InsertContainerCommand extends Command {
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
