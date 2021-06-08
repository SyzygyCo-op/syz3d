export class PowerUpMachine {
  static STATE_INIT = 0;
  static STATE_KEY_DOWN = 1;
  static STATE_OK = 2;

  /** @param {number} maxPowerUps
    */
  constructor(maxPowerUps) {
    this.maxPowerUpsSqrt = Math.sqrt(maxPowerUps);
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }

  get finished() {
    return this.state === PowerUpMachine.STATE_OK;
  }

  get started() {
    return this.state === PowerUpMachine.STATE_KEY_DOWN;
  }

  get result() {
    return Math.sqrt(this.powerUps) / this.maxPowerUpsSqrt;
  }

  sendKeyDown() {
    this.state = PowerUpMachine.STATE_KEY_DOWN;
  }

  sendTick() {
    if(this.result < 1 && this.state === PowerUpMachine.STATE_KEY_DOWN) {
      this.powerUps++;
      if(this.result === 1) {
        this.state = PowerUpMachine.STATE_OK;
      }
    }
  }

  sendKeyUp() {
    this.state = PowerUpMachine.STATE_OK;
  }

  reset() {
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }
}
