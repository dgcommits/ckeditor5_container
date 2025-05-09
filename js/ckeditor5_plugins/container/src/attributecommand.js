import { Command } from 'ckeditor5/src/core';

export default class AttributeCommand extends Command {
  
  constructor(editor, attributeKey) {
    super(editor);
    this.attributeKey = attributeKey;
  }

  
  refresh() {
    const { model } = this.editor;
    const doc = model.document;
    this.value = this._getValueFromFirstAllowedNode();
    this.isEnabled = model.schema.checkAttributeInSelection(
      doc.selection,
      this.attributeKey,
    );
  }

  
  execute(options = {}) {
    const { model } = this.editor;
    const doc = model.document;
    const { selection } = doc;
    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;
    model.change((writer) => {
      if (selection.isCollapsed) {
        if (value) {
          writer.setSelectionAttribute(this.attributeKey, true);
        } else {
          writer.removeSelectionAttribute(this.attributeKey);
        }
      } else {
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          this.attributeKey,
        );
        
        for (const range of ranges) {
          if (value) {
            writer.setAttribute(this.attributeKey, value, range);
          } else {
            writer.removeAttribute(this.attributeKey, range);
          }
        }
      }
    });
  }

  
  _getValueFromFirstAllowedNode() {
    const { model } = this.editor;
    const { schema } = model;
    const { selection } = model.document;
    if (selection.isCollapsed) {
      return selection.hasAttribute(this.attributeKey);
    }
    
    for (const range of selection.getRanges()) {
      
      for (const item of range.getItems()) {
        if (schema.checkAttribute(item, this.attributeKey)) {
          return item.hasAttribute(this.attributeKey);
        }
      }
    }
    return false;
  }
}
