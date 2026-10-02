import {
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  type ButtonProps,
  type IconButtonProps,
} from "@mui/material";
import { useDialogs, type DialogComponent } from "@toolpad/core";
import type { ElementType } from "react";

type DialogTriggerProps<Tpayload = any, Tresult = any> = {
  icon?: ElementType;
  label?: string;
  onlyIcon?: boolean;
  dialogComponent: DialogComponent<Tpayload, Tresult>;
  payload: Tpayload;
  onResult?: (result: Tresult) => Promise<void>;
} & ButtonProps &
  IconButtonProps;

export default function DialogTrigger<P, R>(props: DialogTriggerProps<P, R>) {
  const {
    icon: Icon,
    label = "Adicionar",
    onlyIcon: _onlyIcon,
    dialogComponent,
    onResult,
    payload,
    ...rest
  } = props;
  const theme = useTheme();
  const breakPoint = useMediaQuery(theme.breakpoints.down("sm"));
  const onlyIcon = _onlyIcon || breakPoint;
  const dialogs = useDialogs();

  async function handleClik() {
    const result = await dialogs.open(dialogComponent, payload);
    if (result !== undefined || (result !== null && onResult)) {
      onResult?.(result);
    }
  }

  return !onlyIcon ? (
    <Button
      variant={"text"}
      startIcon={Icon ? <Icon /> : undefined}
      {...rest}
      onClick={handleClik}
    >
      {label}
    </Button>
  ) : (
    <IconButton title={rest.title || label} {...rest} onClick={handleClik}>
      {Icon && <Icon />}
    </IconButton>
  );
}
