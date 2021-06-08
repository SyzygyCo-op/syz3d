export class PowerUpMachine {
  static STATE_INIT = 0;
  static STATE_STARTED = 1;
  static STATE_FINISHED = 2;

  /** @param {number} maxPowerUps
    */
  constructor(maxPowerUps) {
    this.maxPowerUpsSqrt = Math.sqrt(maxPowerUps);
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }

  get finished() {
    return this.state === PowerUpMachine.STATE_FINISHED;
  }

  get started() {
    return this.state === PowerUpMachine.STATE_STARTED;
  }

  get result() {
    return Math.sqrt(this.powerUps) / this.maxPowerUpsSqrt;
  }

  sendStart() {
    this.state = PowerUpMachine.STATE_STARTED;
  }

  // TODO should be no-op if not in STATE_STARTED?
  sendTick() {
    if(this.result < 1) {
      this.powerUps++;
    }
  }

  sendFinish() {
    this.state = PowerUpMachine.STATE_FINISHED;
  }

  reset() {
    this.powerUps = 0;
    this.state = PowerUpMachine.STATE_INIT;
  }
}
