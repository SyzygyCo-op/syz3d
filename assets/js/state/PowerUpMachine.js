export const BIT_KEYBOARD = 1;
export const BIT_VIRTUAL_GAMEPAD = 2;

export class PowerUpMachine {
  static STATE_INIT = 0;
  static STATE_STARTED = 1;

  /** @param {number} maxPowerUps
    */
  constructor(maxPowerUps) {
    this.maxPowerUpsSqrt = Math.sqrt(maxPowerUps);
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
    this.activeBits = 0;
  }

  get finished() {
    return this.state !== PowerUpMachine.STATE_INIT && this.activeBits == 0;
  }

  get started() {
    return this.state !== PowerUpMachine.STATE_INIT && this.activeBits > 0;
  }

  get result() {
    return Math.sqrt(this.powerUps) / this.maxPowerUpsSqrt;
  }

  /** @param {BIT_VIRTUAL_GAMEPAD | BIT_KEYBOARD} bit */
  sendStart(bit) {
    this.state = PowerUpMachine.STATE_STARTED;
    this.activeBits |= bit;
  }

  sendTick() {
    if(this.activeBits > 0) {
      this.powerUps++;
    }

    if(this.result === 1) {
      this.activeBits = 0;
    }
  }

  /** @param {BIT_VIRTUAL_GAMEPAD | BIT_KEYBOARD} bit */
  sendFinish(bit) {
    this.activeBits &= ~bit;
  }

  reset() {
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
    this.activeBits = 0;
  }
}
