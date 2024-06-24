export enum ServiceEvent {
	/**
	 * Emitted by user v1 command createUser:
	 * creates a new user
	 */
	UserCreated = 'user-created',
	/**
	 * Emitted by email v1 command confirmEmail:
	 * confirms an email address
	 */
	EmailAddressConfirmed = 'emailAddressConfirmed',
	/**
	 * Emitted by user v1 command register:
	 * registers a new user
	 */
	UserRegistrationStarted = 'user-registration-started',
	/**
	 * Emitted by account v1 command createAccount:
	 * creates a new bank account for given user
	 */
	BankAccountCreated = 'bankAccountCreated',
}
