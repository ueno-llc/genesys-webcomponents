import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'gux-text-highlight'
})
export class GuxTextHighlight {
  /**
   * The value to display.
   */
  @Prop()
  text: string;

  /**
   * The text to highlight.
   */
  @Prop()
  highlight: string;

  render() {
    if (this.highlight && this.text) {
      return this.renderHighlight();
    } else {
      return this.text;
    }
  }

  private renderHighlight(): HTMLElement | string {
    // Eventually this will support different highlight strategies.
    if (this.text.startsWith(this.highlight)) {
      return this.renderPrefixHighlight();
    }

    return this.text;
  }

  private renderPrefixHighlight(): HTMLElement {
    return (
      <span>
        <strong>{this.highlight}</strong>
        {this.text.replace(this.highlight, '')}
      </span>
    );
  }
}