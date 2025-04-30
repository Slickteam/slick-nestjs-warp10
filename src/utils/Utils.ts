/* eslint-disable @typescript-eslint/no-explicit-any */
export class Utils {
  public static getNavigatorLanguage = () => {
    let lang;
    if (navigator.languages && navigator.languages.length) {
      lang = navigator.languages[0];
    } else {
      lang = navigator.language || 'fr';
    }
    return lang.split('-')[0].toLowerCase();
  };

  public static clone(inObject: any): any {
    return structuredClone(inObject);
  }

  public static throttle(func: any, delay: number, ctx?: any) {
    let isRunning: boolean;
    return (...args: any[]) => {
      const context = ctx || this; // store the context of the object that owns this function
      if (!isRunning) {
        isRunning = true;
        func.apply(context, args); // execute the function with the context of the object that owns it
        setTimeout(() => (isRunning = false), delay);
      }
    };
  }

  public static httpPost(
    theUrl: string,
    payload: string,
    headers?: { [key: string]: string },
  ): Promise<{
    data: any;
    headers: { [key: string]: string };
    status: {
      ops: number;
      elapsed: number;
      fetched: number;
    };
  }> {
    return new Promise((resolve, reject) => {
      const xmlHttp = new XMLHttpRequest();
      const resHeaders: any = {};
      xmlHttp.onreadystatechange = () => {
        xmlHttp
          .getAllResponseHeaders()
          .split('\n')
          .forEach((header) => {
            if (header.trim() !== '') {
              const h = header.split(':');
              resHeaders[h[0].trim().toLowerCase()] = h[1].trim().replace('\r', '');
            }
          });
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve({
            data: xmlHttp.responseText,
            headers: resHeaders,
            status: {
              ops: parseInt(resHeaders['x-warp10-ops'], 10),
              elapsed: parseInt(resHeaders['x-warp10-elapsed'], 10),
              fetched: parseInt(resHeaders['x-warp10-fetched'], 10),
            },
          });
        } else if (xmlHttp.readyState === 4 && xmlHttp.status === 403) {
          reject({
            statusText: xmlHttp.statusText,
            status: xmlHttp.status,
            url: theUrl,
            headers: resHeaders,
            message: 'Not Authorized',
          });
        } else if (xmlHttp.readyState === 4 && xmlHttp.status >= 500) {
          if (resHeaders['x-warp10-error-line'] && resHeaders['x-warp10-error-message']) {
            reject({
              statusText: xmlHttp.statusText,
              status: xmlHttp.status,
              url: theUrl,
              headers: resHeaders,
              message: `line #${resHeaders['x-warp10-error-line']}: ${resHeaders['x-warp10-error-message']}`,
              detail: {
                mess: resHeaders['x-warp10-error-message'],
                line: resHeaders['x-warp10-error-line'],
              },
            });
          } else {
            reject({
              statusText: xmlHttp.statusText,
              status: xmlHttp.status,
              url: theUrl,
              headers: resHeaders,
              message: 'WarpScript Error without message',
            });
          }
        } else if (xmlHttp.readyState === 4 && xmlHttp.status === 0) {
          reject({
            statusText: theUrl + ' is unreachable',
            status: 404,
            url: theUrl,
            headers: resHeaders,
            message: theUrl + ' is unreachable',
            detail: {
              mess: theUrl + ' is unreachable',
              line: -1,
            },
          });
        }
      };
      xmlHttp.open('POST', theUrl, true); // true for asynchronous
      xmlHttp.setRequestHeader('Content-Type', 'text/plain; charset=utf-8');
      const _headers = headers ?? {};
      Object.keys(_headers)
        .filter((h) => h.toLowerCase() !== 'accept' && h.toLowerCase() !== 'content-type')
        .forEach((h) => xmlHttp.setRequestHeader(h, _headers[h]));
      xmlHttp.send(payload);
    });
  }

  public static sanitize(data: any) {
    if (typeof data === 'string') return '["' + data + '"]';
    else return data;
  }
}
