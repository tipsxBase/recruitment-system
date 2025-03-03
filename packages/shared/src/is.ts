const opt = Object.prototype.toString;

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === "[object Array]";
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return opt.call(obj) === "[object Object]";
}

export function isString(obj: any): obj is string {
  return opt.call(obj) === "[object String]";
}

export function isNumber(obj: any): obj is number {
  return opt.call(obj) === "[object Number]" && obj === obj; // eslint-disable-line
}

export function isRegExp(obj: any) {
  return opt.call(obj) === "[object RegExp]";
}

export function isFile(obj: any): obj is File {
  return opt.call(obj) === "[object File]";
}

export function isBlob(obj: any): obj is Blob {
  return opt.call(obj) === "[object Blob]";
}

function isHex(color: string) {
  return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
}

function isRgb(color: string) {
  return /^rgb\((\s*\d+\s*,?){3}\)$/.test(color);
}

function isRgba(color: string) {
  return /^rgba\((\s*\d+\s*,\s*){3}\s*\d(\.\d+)?\s*\)$/.test(color);
}
export function isColor(color: any): boolean {
  return isHex(color) || isRgb(color) || isRgba(color);
}
export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isNullOrUndefined(obj: any): boolean {
  return obj === null || obj === undefined;
}

export function isEmptyString(obj: any): boolean {
  return obj === "";
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === "function";
}

export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0;
}

export function isEmptyArray(obj: any): boolean {
  return isArray(obj) && obj.length === 0;
}

export function isExist(obj: any): boolean {
  return obj || obj === 0;
}

export function isWindow(el: any): el is Window {
  return el === window;
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

export function isPromise(value: any): value is Promise<any> {
  return (
    !!value &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function"
  );
}

let userAgentCached: any = null;

const getOperatingSystem = () => {
  let userAgent = userAgentCached;
  if (!userAgent) {
    userAgent = userAgentCached = navigator.userAgent;
  }
  if (userAgent.indexOf("Macintosh") > -1) {
    return "Mac";
  } else if (userAgent.indexOf("Windows") > -1) {
    return "Windows";
  } else {
    return "Unknown";
  }
};

export const isMac = () => getOperatingSystem() === "Mac";

export const isStringNumber = (value: any): value is string => {
  return isString(value) && !isNaN(Number(value));
};
