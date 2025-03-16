export interface Toast {
  success: (message: string, options?: any) => any;
  error: (message: string, options?: any) => any;
  info: (message: string, options?: any) => any;
  warning: (message: string, options?: any) => any;
}
