# gux-disclosure-button

This is a UI button component that is used to open or dismiss an associated panel.

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                | Type      | Default  |
| ---------- | ---------- | ---------------------------------------------------------- | --------- | -------- |
| `isOpen`   | `is-open`  | Used to open or close the disclosure panel                 | `boolean` | `false`  |
| `label`    | `label`    | Indicates the label for the disclosure button              | `string`  | `'open'` |
| `position` | `position` | Indicates the position of the button panel (right or left) | `string`  | `'left'` |


## Events

| Event    | Description                                              | Type               |
| -------- | -------------------------------------------------------- | ------------------ |
| `active` | Return the state of the components panel on state change | `CustomEvent<any>` |


## Dependencies

### Used by

 - [gux-summary-palette-beta](../../beta/gux-summary-palette)

### Depends on

- [gux-icon](../gux-icon)

### Graph
```mermaid
graph TD;
  gux-disclosure-button --> gux-icon
  gux-summary-palette-beta --> gux-disclosure-button
  style gux-disclosure-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
