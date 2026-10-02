import { Box, Stack, useTheme } from "@mui/material";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, useRef } from "react";
import Draggable from "react-draggable";
import { GripVertical } from "lucide-react";
import { OpenMenuProvider } from "../../../../providers";

interface AppToolbarContainerProps {
  children: ReactElement;
  trigger: ReactNode;
}

function AppToolbarContainerInner(props: AppToolbarContainerProps) {
  const { children, trigger } = props;
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }}
      bounds="body"
    >
      <Box
        ref={nodeRef} // ✅ ref vai aqui
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 999999999,
          width: "fit-content",
          maxWidth: "90vw",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Drag Handle */}
          <Box
            className="drag-handle"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              background: isDark
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              color: theme.palette.primary.contrastText,
              cursor: "grab",
            }}
          >
            <GripVertical size={20} />
          </Box>

          {trigger}
          {cloneElement(children)}
        </Stack>
      </Box>
    </Draggable>
  );
}

export default function AppToolbarRoot(props: AppToolbarContainerProps) {
  return (
    <Stack>
      <OpenMenuProvider initialOpenState={false}>
        <AppToolbarContainerInner {...props} />
      </OpenMenuProvider>
    </Stack>
  );
}
