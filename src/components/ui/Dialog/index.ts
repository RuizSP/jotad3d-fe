import DialogActionCancel from "./DialogActionCancel";
import DialogActionClose from "./DialogActionClose";
import DialogActionMinimize from "./DialogActionMinimize";
import DialogActionSubmit from "./DialogActionSubmit";
import DialogContent from "./DialogContent";
import DialogFooter from "./DialogFooter";
import DialogFooterActions from "./DialogFooterActions";
import DialogHeader from "./DialogHeader";
import DialogHeaderActions from "./DialogHeaderActions";
import DialogRoot from "./DialogRoot";
import DialogTitle from "./DialogTitle";
import DialogTrigger from "./DialogTrigger";

export const Dialog = {
  Root: DialogRoot,
  Header: DialogHeader,
  HeaderActions: DialogHeaderActions,
  Content: DialogContent,
  Title: DialogTitle,
  Footer: DialogFooter,
  FooterActions: DialogFooterActions,
  ActionClose: DialogActionClose,
  ActionSubmit: DialogActionSubmit,
  ActionCancel: DialogActionCancel,
  ActionMinimize: DialogActionMinimize,
  Trigger: DialogTrigger,
};
