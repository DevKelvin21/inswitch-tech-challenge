import type { TableConfig } from '../../../../types/table.types'

export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  joinDate: string
  salary: number
}

export const defaultTableConfig: TableConfig<User> = {
  id: 'users-table',

  features: {
    sorting: 'multi',
    filtering: true,
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100],
    },
    selection: 'multiple',
    export: ['csv', 'json'],
    virtualScroll: false,
    columnResize: true,
    columnReorder: false,
  },

  columns: [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      type: 'text',
      sortable: true,
      filterable: true,
      minWidth: 150,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      type: 'text',
      sortable: true,
      filterable: true,
      minWidth: 200,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 120,
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 150,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      type: 'text',
      sortable: true,
      filterable: true,
      width: 100,
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      accessorKey: 'joinDate',
      type: 'date',
      sortable: true,
      filterable: true,
      width: 120,
    },
    {
      id: 'salary',
      header: 'Salary',
      accessorKey: 'salary',
      type: 'number',
      sortable: true,
      filterable: true,
      width: 120,
    },
  ],

  dataSource: {
    endpoint: '/users',
    headers: {
      'Content-Type': 'application/json',
    },
  },

  defaultPageSize: 10,
  defaultSorting: [{ id: 'name', desc: false }],
}
