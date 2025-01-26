import { CSSProperties } from "react";
import { ReactNode } from "react";
import { renderToString } from "react-dom/server";

export default function calcSize(
  node: ReactNode,
  style: CSSProperties,
  className
) {
  if (!node) {
    return {
      width: 0,
      height: 0,
    };
  }
  const span = document.createElement("span");
  span.style.position = "absolute";
  span.style.top = "-9999999px";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  const html = renderToString(
    <div className={className} style={style}>
      {node}
    </div>
  );
  span.innerHTML = html;
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  document.body.removeChild(span);
  return { width: rect.width, height: rect.height };
}
