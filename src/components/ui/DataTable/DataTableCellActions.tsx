import { Stack } from '@mui/material'
import { type ReactNode } from 'react'

interface DataTableCellActionsProps {
  children: ReactNode
}

export default function DataTableCellActions({ children }: DataTableCellActionsProps) {
  return (
    <Stack
      spacing={1}
      alignItems={'center'}
      direction={'row'}
      height={'100%'}
      maxWidth={'90px'}
      justifyContent={'space-between'}
    >
      {children}
    </Stack>
  )
}
