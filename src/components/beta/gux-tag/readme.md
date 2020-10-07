# gux-tag

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description           | Type                                                                                                                                                                | Default     |
| -------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `color`  | `color`   | Tag background color. | `"aqua-green" \| "blue" \| "bubblegum-pink" \| "dark-purple" \| "default" \| "electric-purple" \| "fuscha" \| "lilac" \| "navy" \| "olive-green" \| "yellow-green"` | `'default'` |
| `tagId`  | `tag-id`  | Index for remove tag  | `string`                                                                                                                                                            | `undefined` |


## Events

| Event       | Description                          | Type               |
| ----------- | ------------------------------------ | ------------------ |
| `guxdelete` | Triggered when click on close button | `CustomEvent<any>` |


## Dependencies

### Depends on

- [gux-icon](../../stable/gux-icon)

### Graph
```mermaid
graph TD;
  gux-tag-beta --> gux-icon
  style gux-tag-beta fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
