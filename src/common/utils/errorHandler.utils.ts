/**
 * 에러 처리 유틸리티 클래스
 *
 * @description
 * 타입 안전한 에러 처리를 위한 정적 메서드 모음
 */
export class ErrorHandler {
  /**
   * 주어진 값이 Error 객체인지 타입 가드로 검사
   */
  static isError(error: unknown): error is Error {
    return error instanceof Error;
  }
  /**
   * 에러 객체에서 메세지를 추출
   */
  static getMessage(error: unknown): string {
    if (this.isError(error)) {
      return error.message;
    } else {
      return 'Unknown error occurred';
    }
  }
  /**
   * 에러 객체에서 스택 트레이스를 추출
   */
  static getStack(error: unknown): string[] | undefined {
    if (this.isError(error) && error.stack) {
      return error.stack.split('\n');
    }
    return undefined;
  }
}
