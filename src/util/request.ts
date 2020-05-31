import axios, {
  AxiosStatic,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

export interface ResponsePromise<T> extends AxiosPromise<T> {}
export interface RequestConfig extends AxiosRequestConfig {}
export interface Reponse<T = any> extends AxiosResponse<T> {}

export class Request {
  private request: AxiosStatic;

  constructor(request = axios) {
    this.request = request;
  }

  public get<T>(url: string, config: RequestConfig = {}): ResponsePromise<T> {
    return this.request.get<T>(url, config);
  }

  public static isRequestError(error: AxiosError): boolean {
    console.log(
      'TESTTTTTTTTTTTTTT'
      //!!(error.response && error.response.status)
    );
    return !!(error.response && error.response.status);
  }
}
