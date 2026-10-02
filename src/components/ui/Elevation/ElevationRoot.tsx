import { Card, type CardProps } from "@mui/material";
import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type ElevationRootProps = {
  children: ReactNode;
  motionProps?: MotionProps;
  cardProps?: CardProps;
};

export default function ElevationRoot(props: ElevationRootProps) {
  const { children, motionProps, cardProps } = props;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...motionProps}
    >
      <Card sx={{ borderRadius: "16px", boxShadow: 2 }} {...cardProps}>
        {children}
      </Card>
    </motion.div>
  );
}
