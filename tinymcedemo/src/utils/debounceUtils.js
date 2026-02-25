/**
 * 防抖控制器类
 */
export class DebounceController {
  constructor(delay = 500) {
    this.lastOperationTime = 0;
    this.delay = delay;
  }

  /**
   * 检查是否应该阻止操作（防抖）
   * @returns {boolean} true表示应该阻止，false表示可以通过
   */
  shouldPrevent() {
    const now = new Date().getTime();
    if (now - this.lastOperationTime < this.delay) {
      return true;
    }
    this.lastOperationTime = now;
    return false;
  }

  /**
   * 重置防抖状态
   */
  reset() {
    this.lastOperationTime = 0;
  }

  /**
   * 设置防抖延迟时间
   * @param {number} delay - 延迟时间（毫秒）
   */
  setDelay(delay) {
    this.delay = delay;
  }
}
