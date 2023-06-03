import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import qs from 'qs';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const mode = process.env.MODE;
const isCapacitor = mode === 'capacitor';

class HttpWrapper {
  axiosClient: AxiosInstance;

  capacitorClient: typeof CapacitorHttp;

  token: string | undefined = undefined;

  baseUrl: string;

  constructor() {
    this.baseUrl = isCapacitor ? 'http://10.0.2.2:9123' : 'http://127.0.0.1:9000';
    this.capacitorClient = CapacitorHttp;
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      paramsSerializer: (params) => qs.stringify(params, {
        encodeValuesOnly: true, // prettify URL
      }),
    });
  }

  getAxiosStandardHeaders(): { [key: string]: string } {
    const headers = this.axiosClient.defaults.headers.common;
    headers['Content-Type'] = 'application/json';
    const newHeaders: any = {};
    Object.keys(headers).forEach((key): void => {
      if (headers[key]) {
        newHeaders[key] = headers[key];
      }
    });
    return newHeaders;
  }

  async get(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse | HttpResponse> {
    return isCapacitor
      ? HttpWrapper.handleCapacitorError(
        await this.capacitorClient.get(this.mapAxiosConfig(url, config)),
      )
      : this.axiosClient.get(url, config);
  }

  async post(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse | HttpResponse> {
    return isCapacitor
      ? HttpWrapper.handleCapacitorError(
        await this.capacitorClient.request({ ...this.mapAxiosConfig(url, config), method: 'POST' }),
      )
      : this.axiosClient.post(url, { data: config?.data }, config);
  }

  async put(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse | HttpResponse> {
    return isCapacitor
      ? HttpWrapper.handleCapacitorError(
        await this.capacitorClient.put(this.mapAxiosConfig(url, config)),
      )
      : this.axiosClient.put(url, { data: config?.data }, config);
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse | HttpResponse> {
    return isCapacitor
      ? HttpWrapper.handleCapacitorError(
        await this.capacitorClient.delete(this.mapAxiosConfig(url, config)),
      )
      : this.axiosClient.delete(url, config);
  }

  async patch(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse | HttpResponse> {
    return isCapacitor
      ? HttpWrapper.handleCapacitorError(
        await this.capacitorClient.patch(this.mapAxiosConfig(url, config)),
      )
      : this.axiosClient.patch(url, { data: config?.data }, config);
  }

  static handleCapacitorError(request: HttpResponse) {
    return new Promise((resolve, reject) => {
      if (request.status > 299) {
        reject(request);
      } else {
        resolve(request);
      }
    });
  }

  mapAxiosConfig(url: string, config?: AxiosRequestConfig): HttpOptions {
    const strippedHeaders: any = this.getAxiosStandardHeaders();
    if (config?.headers) {
      Object.keys(config.headers).forEach((key): void => {
        if (config.headers?.[key]) {
          strippedHeaders[key] = config.headers[key];
        }
      });
    }
    if (this.token) {
      strippedHeaders.Authorization = `Bearer ${this.token}`;
    }
    let paramString = '';
    if (config?.params) {
      paramString += '?';
      paramString += qs.stringify(config?.params, {
        encodeValuesOnly: true, // prettify URL
      });
    }
    const retörn = {
      url: `${this.baseUrl}${url}${paramString}` || '',
      data: config?.data,
      headers: strippedHeaders,
      responseType: 'json',
      body: JSON.stringify(config?.data),
    };

    console.log(retörn);
    return retörn;
  }

  setToken(token: string | undefined) {
    this.token = token;
    this.axiosClient.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = new HttpWrapper();

export default boot(({ app, router }) => {
  // const authStore = useAuthStore();
  // api.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response?.status === 401) {
  //       authStore.doLogout();
  //       router.push('/login');
  //     }
  //     return Promise.reject(error);
  //   },
  // );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
