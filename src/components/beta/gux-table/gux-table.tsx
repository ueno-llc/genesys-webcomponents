import {
  Component,
  Element,
  h,
  Listen,
  Prop,
  readTask,
  State
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import tableResources from './i18n/en.json';

interface TableHeaderCell {
  name: string;
  sortable?: boolean;
  sortDirection?: string;
}

interface TableRow {
  selected: boolean;
}

@Component({
  styleUrl: 'gux-table.less',
  tag: 'gux-table-beta'
})
export class GuxTable {
  @Element()
  root: HTMLElement;

  private rows: TableRow[] = [];

  private resizeObserver: ResizeObserver;

  private i18n: GetI18nValue;

  /**
   * Keeps columns names, sorting information, etc.
   */
  @State()
  private columns: TableHeaderCell[] = [];

  /**
   * Indicates that horizontal scroll is presented for table
   */
  @State()
  private isHorizontalScroll: boolean = false;

  /**
   * Indicates that table content scrolled to it's last column
   */
  @State()
  private isScrolledToFirstCell: boolean = true;

  /**
   * Indicates that table content scrolled to it's first column
   */
  @State()
  private isScrolledToLastCell: boolean = false;

  /**
   * Indicates table row density style
   */
  @Prop()
  compact: boolean = false;

  /**
   * Indicates that object table specific styles should be applied
   */
  @Prop()
  objectTable: boolean = false;

  /**
   * Represents info message that should be displayed for empty table
   */
  @Prop()
  emptyMessage: string;

  /**
   * Indicates columns in order they should be displayed
   */
  @Prop()
  columnsOrder: string;

  @Listen('scroll', { capture: true })
  onScroll(): void {
    const scrollLeft = this.tableContainer.querySelector('.gux-table-container')
      .scrollLeft;
    const maxScrollLeft =
      this.tableContainer.querySelector('.gux-table-container').scrollWidth -
      this.tableContainer.querySelector('.gux-table-container').clientWidth;

    if (scrollLeft === 0) {
      this.isScrolledToFirstCell = true;
    } else if (maxScrollLeft - scrollLeft - this.tableScrollbarConstant === 0) {
      this.isScrolledToLastCell = true;
    }
  }

  private get tableContainer(): HTMLElement {
    return this.root.children[0] as HTMLElement;
  }

  private get isTableEmpty(): boolean {
    return (
      !this.root.children[0] ||
      this.root.children[0].querySelectorAll('tbody tr').length < 1
    );
  }

  private get isVerticalScroll(): boolean {
    const rowsCount = this.root.querySelectorAll('tbody tr').length;
    return rowsCount * (this.compact ? 24 : 40) > this.root.clientHeight;
  }

  private get tableScrollbarConstant(): number {
    const container = this.tableContainer.querySelector(
      '.gux-table-container'
    ) as HTMLElement;
    return container ? container.offsetWidth - container.clientWidth : 0;
  }

  private get tableClasses(): string {
    return [
      'gux-table',
      this.isVerticalScroll ? 'vertical-scroll' : '',
      this.isHorizontalScroll ? 'horizontal-scroll' : ''
    ]
      .join(' ')
      .trim();
  }

  private get tableContainerClasses(): string {
    return [
      'gux-table-container',
      this.compact ? 'compact' : '',
      this.objectTable ? 'object-table' : ''
    ]
      .join(' ')
      .trim();
  }

  private previousColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    columns.some(column => {
      if (
        columnsWidth + column.getBoundingClientRect().width <
        containerWidth + Math.floor(currentScrollX - 1)
      ) {
        columnsWidth += column.getBoundingClientRect().width;
        return false;
      } else {
        return true;
      }
    });

    this.isScrolledToLastCell = false;
    const scrollToValue = currentScrollX + containerWidth - columnsWidth;
    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(currentScrollX - scrollToValue);
  }

  private nextColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    this.isScrolledToFirstCell = false;
    columns.some(column => {
      columnsWidth += column.getBoundingClientRect().width;

      if (columnsWidth > containerWidth + currentScrollX) {
        return true;
      } else {
        return false;
      }
    });

    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(columnsWidth - containerWidth);
  }

  private setRowsCellsNames(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const rowsElements = Array.from(
      this.tableContainer.querySelectorAll('tbody tr')
    );

    rowsElements.map(row => {
      Array.from(row.querySelectorAll('td')).forEach((cell, cellIndex) => {
        cell.setAttribute(
          'data-column-name',
          columnsElements[cellIndex].getAttribute('data-column-name')
        );
      });
    });
  }

  /* private changeColumnSorting(column: TableHeaderCell): void {
    switch (column.sortDirection) {
      case '':
        column.sortDirection = 'asc';
        break;
      case 'asc':
        column.sortDirection = 'desc';
        break;
      case 'desc':
        column.sortDirection = '';
        break;
    }

    this.columns = [...this.columns]; // FIND MORE ELEGANT SOLUTION!!!!!
    this.sortChanged.emit({
      columnName: column.name,
      sortDirection: column.sortDirection
    });
  } */

  // @Listen('click', { target: 'window' })
  // onClick(e: MouseEvent): void {
  //   const element = e.target as HTMLElement;

  //   if (!this.root.contains(element as Node)) {
  //     this.setOpened(false);
  //   }
  // }

  // componentDidLoad() {
  //   this.root.onfocus = () => this.onFocus.emit(this.text);
  //   this.root.onclick = () => {
  //     this.onItemClicked();
  //   };

  //   this.root.onkeydown = (e: KeyboardEvent) => {
  //     switch (e.key) {
  //       case ' ':
  //       case 'Enter':
  //         this.selectedChanged.emit(this.value ? this.value : this.text);
  //         break;
  //     }
  //   };
  // }

  private prepareSortableColumns(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const downArrow = document.createElement('gux-icon');
    const upArrow = document.createElement('gux-icon');
    const sortingHiglight = document.createElement('div');

    downArrow.setAttribute('icon-name', 'ic-arrow-solid-down');
    downArrow.setAttribute('screenreader-text', 'test');
    downArrow.setAttribute('class', 'gux-column-sort-arrow-down');

    upArrow.setAttribute('icon-name', 'ic-arrow-solid-up');
    upArrow.setAttribute('screenreader-text', 'test');
    upArrow.setAttribute('class', 'gux-column-sort-arrow-up');

    sortingHiglight.setAttribute('class', 'gux-column-sort-highlight');

    columnsElements.forEach((column: HTMLElement) => {
      if (column.dataset.hasOwnProperty('sortable')) {
        column.appendChild(downArrow.cloneNode(true));
        column.appendChild(upArrow.cloneNode(true));
        column.appendChild(sortingHiglight.cloneNode(true));
        column.onclick = (event: MouseEvent) => {
          const columnElement = event.target as HTMLElement;
          const sortDirection = columnElement.dataset.sortDirection || '';

          switch (sortDirection) {
            case '':
              columnElement.setAttribute('data-sort-direction', 'asc');
              break;
            case 'asc':
              columnElement.setAttribute('data-sort-direction', 'desc');
              break;
            case 'desc':
              columnElement.removeAttribute('data-sort-direction');
              break;
          }

          // console.log('SORT DIRECTION: ', column.dataset.sortDirection)
        };
      }
    });
  }

  private prepareTableData(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const rowsElements = Array.from(
      this.tableContainer.querySelectorAll('tbody tr')
    );

    this.columns = columnsElements.map((column: HTMLElement, index: number) => {
      return {
        name: column.dataset.columnName || index.toString(),
        sortable: column.dataset.hasOwnProperty('sortable'),
        sortDirection: ''
      };
    });

    this.rows = rowsElements.map((row, rowIndex) => {
      Array.from(row.querySelectorAll('td')).forEach((cell, cellIndex) => {
        cell.setAttribute('data-row', rowIndex.toString());
        cell.setAttribute('data-row-cell', cellIndex.toString());
      });

      return {
        selected: false
      };
    });
  }

  private reorderColumns(): void {
    const columnsOrder = this.columnsOrder.split(' ');
    const tableHead = this.tableContainer.querySelector('thead tr');
    const tableBody = this.tableContainer.querySelectorAll('tbody tr');
    const reorderedColumns = [];

    columnsOrder.forEach(columnName => {
      reorderedColumns.push(
        Array.from(tableHead.children).find(el => {
          return el.getAttribute('data-column-name') === columnName;
        })
      );
    });

    tableHead.innerHTML = '';
    reorderedColumns.forEach(el => {
      tableHead.appendChild(el);
    });

    tableBody.forEach(row => {
      const reorderedRowCells = [];

      columnsOrder.forEach(columnName => {
        reorderedRowCells.push(
          Array.from(row.children).find(el => {
            return el.getAttribute('data-column-name') === columnName;
          })
        );
      });

      row.innerHTML = '';
      reorderedRowCells.forEach(el => {
        row.appendChild(el);
      });
    });
  }

  private checkHorizontalScroll(): void {
    const tableWidth = this.tableContainer
      .querySelector('.gux-table-container table')
      .getBoundingClientRect().width;
    const containerWidth = this.root.getBoundingClientRect().width;

    if (tableWidth <= containerWidth) {
      this.isHorizontalScroll = false;
    } else {
      this.isHorizontalScroll = true;
    }
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
    if (!this.emptyMessage) {
      this.emptyMessage = this.i18n('emptyMessage');
    }

    this.setRowsCellsNames();

    if (this.columnsOrder) {
      this.reorderColumns();
    }

    this.prepareSortableColumns();

    setTimeout(() => {
      this.prepareTableData();
      this.checkHorizontalScroll();

      if (!this.resizeObserver && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          readTask(() => {
            this.checkHorizontalScroll();
          });
        });
      }

      this.resizeObserver.observe(
        this.tableContainer.querySelector('.gux-table-container table')
      );
    });
  }

  disconnectedCallback(): void {
    this.resizeObserver.unobserve(
      this.tableContainer.querySelector('.gux-table-container table')
    );
  }

  render() {
    return (
      <div class={this.tableClasses}>
        <div class={this.tableContainerClasses}>
          <slot name="data" />
        </div>
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToFirstCell
                ? 'gux-table-scroll-left disabled'
                : 'gux-table-scroll-left'
            }
            onClick={
              !this.isScrolledToFirstCell && this.previousColumn.bind(this)
            }
          >
            <gux-icon
              icon-name="ic-chevron-left"
              screenreader-text={this.i18n('scrollLeft')}
            />
          </button>
        )}
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToLastCell
                ? 'gux-table-scroll-right disabled'
                : 'gux-table-scroll-right'
            }
            style={{ marginRight: `${this.tableScrollbarConstant}px` }}
            onClick={!this.isScrolledToLastCell && this.nextColumn.bind(this)}
          >
            <gux-icon
              icon-name="ic-chevron-right"
              screenreader-text={this.i18n('scrollRight')}
            />
          </button>
        )}
        {this.isTableEmpty && (
          <div class="empty-table">
            <h2>{this.emptyMessage}</h2>
          </div>
        )}
      </div>
    );
  }
}
