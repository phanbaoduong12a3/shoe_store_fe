/* eslint-disable @typescript-eslint/no-explicit-any */
class ResponseError extends Error {
  data: any;
  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

export default ResponseError;
