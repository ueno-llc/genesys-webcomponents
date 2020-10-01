# gux-table-beta



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                      | Type      | Default     |
| ------------------ | ------------------- | ---------------------------------------------------------------- | --------- | ----------- |
| `compact`          | `compact`           | Indicates table row density style                                | `boolean` | `false`     |
| `emptyMessage`     | `empty-message`     | Represents info message that should be displayed for empty table | `string`  | `undefined` |
| `objectTable`      | `object-table`      | Indicates that object table specific styles should be applied    | `boolean` | `false`     |
| `resizableColumns` | `resizable-columns` | Indicates that table should have resizable columns               | `boolean` | `undefined` |


## Events

| Event              | Description                                               | Type                          |
| ------------------ | --------------------------------------------------------- | ----------------------------- |
| `selectionChanged` | Triggers when table row was selected/unselected           | `CustomEvent<ISelectedState>` |
| `sortChanged`      | Triggers when the sorting of the table column is changed. | `CustomEvent<ISortState>`     |


## Dependencies

### Depends on

- [gux-icon](../../stable/gux-icon)

### Graph
```mermaid
graph TD;
  gux-table-beta --> gux-icon
  style gux-table-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
