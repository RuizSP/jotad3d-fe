import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { toast } from "react-toastify";

interface CopyButtonProps extends ButtonProps {
  value: string;
  copiedLabel?: ReactNode;
  onCopied?: () => void;
}

export default function CopyButton({
  value,
  copiedLabel = "Copiado",
  onCopied,
  children = "Copiar",
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleClick: NonNullable<ButtonProps["onClick"]> = async (event) => {
    onClick?.(event);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar para a área de transferência.");
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={props.disabled || !value}
      startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
      aria-live="polite"
    >
      {copied ? copiedLabel : children}
    </Button>
  );
}
