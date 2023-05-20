export enum ServiceEvent {
  /**
   * Emitted by user v1 command signUp:
   * a new user registration
   */
  NewUserRegistered = 'newUserRegistered',
  /**
   * Emitted by email v1 subscription sendWelcomeEmail:
   * a new user registration
   */
  WelcomeEmailSent = 'send a welcome mail to new registered users',
}
