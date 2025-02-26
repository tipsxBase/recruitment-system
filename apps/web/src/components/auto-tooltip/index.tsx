import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ComponentType,
  HTMLElementType,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AutoTooltipProps {
  text: ReactNode;
  className?: string;
  Wrapper?: ComponentType<any> | HTMLElementType;
}

export default function AutoTooltip({
  text,
  className,
  Wrapper = "span",
}: AutoTooltipProps) {
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
          textRef.current;
        setIsTruncated(
          scrollWidth > clientWidth || scrollHeight > clientHeight
        );
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    checkTruncation();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger disabled={!isTruncated} asChild>
          <div
            ref={textRef}
            className={cn(
              "truncate",
              !isTruncated && "pointer-events-none",
              className
            )}
          >
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <Wrapper>{text}</Wrapper>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
