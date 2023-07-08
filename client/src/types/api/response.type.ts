// template Response body

interface BaseResponse<T=never> {
  status: string;
  message: string;
  data: T;
}

export default BaseResponse;
