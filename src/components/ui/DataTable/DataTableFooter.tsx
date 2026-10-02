import { Stack } from '@mui/material'
import type { ReactNode } from 'react'

interface DataTableToolbarProps {
  children?: ReactNode
}

export default function DataTableFooter({ children }: DataTableToolbarProps) {
  return (
    <Stack
      direction={"row"}
      width={"100%"}
      p={1}
      alignItems={"center"}
      justifyContent={"space-between"}
      height={64}
      sx={{ borderTop: 1, borderColor: "divider" }}
    >
      {children}
    </Stack>
  )
}
