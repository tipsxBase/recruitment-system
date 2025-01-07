export class Cookie {
  private _cookie: string;
  private _valueMap: Map<string, string>;
  constructor(cookie: string) {
    this._cookie = cookie;
    this._valueMap = new Map();
    if (cookie) {
      cookie.split(";").reduce((prev, current) => {
        const propAndValue = current.split("=");
        if (propAndValue && propAndValue.length === 2) {
          const [prop, value] = propAndValue;
          prev.set(prop.trim(), value);
        }
        return prev;
      }, this._valueMap);
    }
  }

  getCookie() {
    return this._cookie;
  }

  get(key: string) {
    return this._valueMap.get(key);
  }

  has(key: string) {
    return this._valueMap.has(key);
  }
}
