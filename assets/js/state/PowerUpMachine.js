export class PowerUpMachine {
  static STATE_INIT = -1;
  static STATE_OK = 0;
  static STATE_CANCEL = 1;
  static STATE_KEY_DOWN = 2;
  static STATE_TOUCH_END = 3;

  /** @param {number} maxPowerUps */
  constructor(maxPowerUps) {
    this.maxPowerUpsSqrt = Math.sqrt(maxPowerUps);
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }

  get finished() {
    return (
      this.state === PowerUpMachine.STATE_OK ||
      this.state === PowerUpMachine.STATE_CANCEL
    );
  }

  get started() {
    return (
      this.state === PowerUpMachine.STATE_KEY_DOWN ||
      this.state === PowerUpMachine.STATE_TOUCH_END
    );
  }

  get result() {
    return Math.sqrt(this.powerUps) / this.maxPowerUpsSqrt;
  }

  get resultOk() {
    return this.state === PowerUpMachine.STATE_OK;
  }

  sendKeyDown() {
    this.state = PowerUpMachine.STATE_KEY_DOWN;
  }

  sendTouchEnd() {
    this.state = PowerUpMachine.STATE_TOUCH_END;
  }

  sendTick() {
    if (this.started) {
      if (this.state === PowerUpMachine.STATE_KEY_DOWN) {
        if (this.result < 1) {
          this.powerUps++;
        }
        if (this.result === 1) {
          this.state = PowerUpMachine.STATE_OK;
        }
      }
      if (this.state === PowerUpMachine.STATE_TOUCH_END) {
        this.powerUps++;
        if (this.result > 1) {
          this.state = PowerUpMachine.STATE_CANCEL;
        }
      }
    }
  }

  sendKeyUp() {
    this.state = PowerUpMachine.STATE_OK;
  }

  sendTouchStart() {
    if (this.result <= 1) {
      this.state = PowerUpMachine.STATE_OK;
    }
  }

  reset() {
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }
}
