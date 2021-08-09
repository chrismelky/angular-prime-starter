export declare class CustomResponse<T> {
  readonly data: T | null;

  readonly success: boolean;

  readonly message: string;

  readonly total: number;

  readonly current_page: number;

  readonly per_page: number;

  /**
   * Construct a new `CustomResponse`.
   */
  constructor(init?: {
    success?: boolean;
    data?: T | null;
    message?: string;
    total: number;
    current_page: number;
    per_page: number;
  });
}
