import DataTableActions from './DataTableActions'
import DataTableCellActions from './DataTableCellActions'
import DataTableDeleteButton from './DataTableDeleteButton'
import DataTableEditButton from './DataTableEditButton'
import DataTableFooter from './DataTableFooter'
import DataTableRoot from './DataTableRoot'
import DataTableTable from './DataTableTable'
import DataTableTitle from './DataTableTitle'
import DataTableToolbar from './DataTableToolbar'

import DataTablePagination from './DataTablePagination'

export const DataTable = {
  Table: DataTableTable,
  Toolbar: DataTableToolbar,
  Root: DataTableRoot,
  Actions: DataTableActions,
  Title: DataTableTitle,
  ActionEdit: DataTableEditButton,
  ActionDelete: DataTableDeleteButton,
  CellActions: DataTableCellActions,
  Pagination: DataTablePagination,
  Footer: DataTableFooter,
}
