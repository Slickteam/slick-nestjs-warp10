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

  public static async httpPost(
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
    const _headers = headers ?? {};
    const response = await fetch(theUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ..._headers,
      },
      body: payload,
    });

    const resHeaders: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      resHeaders[key.toLowerCase()] = value;
    });

    if (response.ok) {
      return {
        data: await response.text(),
        headers: resHeaders,
        status: {
          ops: parseInt(resHeaders['x-warp10-ops'], 10),
          elapsed: parseInt(resHeaders['x-warp10-elapsed'], 10),
          fetched: parseInt(resHeaders['x-warp10-fetched'], 10),
        },
      };
    } else if (response.status === 403) {
      throw {
        statusText: response.statusText,
        status: response.status,
        url: theUrl,
        headers: resHeaders,
        message: 'Not Authorized',
      };
    } else if (response.status >= 500) {
      if (resHeaders['x-warp10-error-line'] && resHeaders['x-warp10-error-message']) {
        throw {
          statusText: response.statusText,
          status: response.status,
          url: theUrl,
          headers: resHeaders,
          message: `line #${resHeaders['x-warp10-error-line']}: ${resHeaders['x-warp10-error-message']}`,
          detail: {
            mess: resHeaders['x-warp10-error-message'],
            line: resHeaders['x-warp10-error-line'],
          },
        };
      } else {
        throw {
          statusText: response.statusText,
          status: response.status,
          url: theUrl,
          headers: resHeaders,
          message: 'WarpScript Error without message',
        };
      }
    } else {
      throw {
        statusText: theUrl + ' is unreachable',
        status: 404,
        url: theUrl,
        headers: resHeaders,
        message: theUrl + ' is unreachable',
        detail: {
          mess: theUrl + ' is unreachable',
          line: -1,
        },
      };
    }
  }

  public static sanitize(data: any) {
    if (typeof data === 'string') return '["' + data + '"]';
    else return data;
  }
}
