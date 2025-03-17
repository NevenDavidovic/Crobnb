export interface ApiError {
  message: string;
  name?: string;
  status?: number;
  code?: string;

  errors?: Array<{
    message: string;
    extensions?: {
      code: string;
      collection?: string;
      field?: string;
    };
  }>;

  response?: {
    data?: any;
    status: number;
    statusText?: string;
    headers?: Record<string, string>;
    url?: string;
  };
}
