/** @module httpClient */

export interface RequestOption {
  method: 'GET' | 'POST' | 'PUT' | 'OPTION';
  body?: any;
  customConf?: any;
}

/**
 * ### basic client untuk request ke `server`
 * @param {string} endpoint target / url endpoint
 * @param {RequestInit} options tambahan opsi [request](http://localhost)
 * @returns {Promise<any>} hasil request
 */
async function client(endpoint: string, options: RequestOption): Promise<any> {
  const headers = { 'Content-Type': 'application/json' };

  const config = {
    method: options?.method ?? 'GET',
    ...options?.customConf,
    headers: {
      ...headers,
      ...options?.customConf?.headers,
    },
  };

  if (options?.body) {
    config.body = JSON.stringify(options?.body);
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (!response.ok) {
      throw new Error(data?.statusText ?? 'Gagal request ke api');
    }

    return data;
  } catch (err) {
    return Promise.reject(err?.message || data);
  }
}

/**
 * request dengan method GET
 * @param {string} endpoint target / url endpoint
 * @param {RequestInit} options tambahan opsi request
 */
client.get = (endpoint: string, customConf:any = {}): Promise<any> => {
  const config: RequestOption = {
    method: 'GET',
    ...customConf
  };
  return client(endpoint, config);
};

/**
 * request dengan method POST
 * @param {string} endpoint target / url endpoint
 * @param {Object} body konten dari request
 * @param {RequestInit} options tambahan opsi request
 */
client.post = <T>(endpoint: string, body: any, customConf: any = {}): Promise<T> => {
  return client(endpoint, { method: 'POST', body, ...customConf });
};

/**
 * request dengan method PUT
 * @param {string} endpoint target / url endpoint
 * @param {Object} body konten dari request
 * @param {RequestInit} options tambahan opsi request
 */
client.put = (endpoint: string, body?: any, customConf: any = {}): Promise<any> => {
  return client(endpoint, { method: 'PUT', body, ...customConf });
};

export { client as httpClient };
