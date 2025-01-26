import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import ResizeObserver from "rc-resize-observer";
import calcSize from "@/lib/calcSize";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface AutoTooltipProps<T extends Record<string, any> = any> {
  /**
   *
   */
  className?: string;
  // text: string | number;
  text?: ReactNode;
  // fontSize?: number;
  style?: React.CSSProperties;
  /**
   * 单元格的key
   */
  rowKey?: string;
  record?: T;
  index?: number;

  /**
   * 自定义取值逻辑
   * @param item
   * @returns
   */
  render?: (text: ReactNode, item: T, index: number) => string;

  renderTooltip?: (text: ReactNode) => ReactNode;

  displayRow?: number;
}

/**
 * 计算文本长度
 * @param text
 * @returns
 */

/**
 * Table 单元格渲染
 * @param props
 * @returns
 */
function AutoTooltip<T = any>(props: AutoTooltipProps<T>) {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const {
    text,
    rowKey,
    render,
    record,
    index,
    style,
    className,
    displayRow,
    renderTooltip,
  } = props;
  const styleRef = useRef(style);
  styleRef.current = style;
  const displayText = useMemo(() => {
    if (render) {
      return render(text, record, index);
    }
    // 为 0 时也要显示
    if (text !== null && text !== undefined && text !== "") {
      return text;
    }
    return "-";
  }, [index, record, render, text]);

  const textWidth = useMemo(() => {
    const { width } = calcSize(displayText, styleRef.current, className);
    if (displayRow && displayRow > 1) {
      return Math.ceil(width / displayRow);
    }
    return width;
  }, [displayText, displayRow, className]);

  const [ellipsis, setIsEllipse] = useState(true);

  const onResize = useCallback(
    ({ offsetWidth }) => {
      const width = offsetWidth;
      if (width === 0) return;
      setIsEllipse(textWidth > width);
    },
    [textWidth]
  );

  const labelStyle = useMemo<CSSProperties>(() => {
    if (!displayRow || displayRow === 1) {
      return null;
    }
    return {
      display: "-webkit-box",
      WebkitLineClamp: displayRow,
      WebkitBoxOrient: "vertical",
      whiteSpace: "unset",
      wordBreak: "break-all",
    };
  }, [displayRow]);

  const textRender = useMemo(
    () => (
      <div
        style={labelStyle}
        className={cn("flex-1 text-left truncate", className)}
      >
        {displayText}
      </div>
    ),
    [labelStyle, className, displayText]
  );

  useEffect(() => {
    const { width } = outerContainerRef.current.getBoundingClientRect();
    // 16px 是复制的图标的宽度，6px 是字体图标跟右侧文字的宽度，12px 是 ... 的宽度
    setIsEllipse(textWidth > width);
  }, [textWidth]);

  const tooltipContent = useMemo(() => {
    if (renderTooltip) {
      return renderTooltip(text);
    }
    return text;
  }, [text, renderTooltip]);

  return (
    <ResizeObserver onResize={onResize}>
      <div
        key={rowKey}
        ref={outerContainerRef}
        className="w-full flex items-center"
      >
        {ellipsis ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{textRender}</TooltipTrigger>
              <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          textRender
        )}
      </div>
    </ResizeObserver>
  );
}

export default AutoTooltip;
