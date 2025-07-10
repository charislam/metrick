// Result<T, E> inspired by Rust's Result enum

/**
 * A type that represents either success (Ok) or failure (Err).
 */
export class Result<T, E> {
	private constructor(
		private readonly value?: T,
		private readonly error?: E,
	) {}

	/** Create a successful result */
	static ok<T, E = never>(value: T): Result<T, E> {
		return new Result<T, E>(value, undefined);
	}

	/** Create an error result */
	static err<T = never, E = unknown>(error: E): Result<T, E> {
		return new Result<T, E>(undefined, error);
	}

	/** Returns true if the result is Ok */
	isOk(): boolean {
		return this.error === undefined;
	}

	/** Returns true if the result is Err */
	isErr(): boolean {
		return this.error !== undefined;
	}

	/** Returns the value if Ok, or throws if Err */
	unwrap(): T {
		if (this.isOk()) return this.value as T;
		throw new Error(`Tried to unwrap an Err: ${this.error}`);
	}

	/** Returns the value if Ok, or throws the raw error if Err */
	unwrapRaw(): T {
		if (this.isOk()) return this.value as T;
		throw this.error;
	}

	/** Returns the value if Ok, or a default if Err */
	unwrapOr(defaultValue: T): T {
		return this.isOk() ? (this.value as T) : defaultValue;
	}

	/** Returns the error if Err, or throws if Ok */
	unwrapErr(): E {
		if (this.isErr()) return this.error as E;
		throw new Error(`Tried to unwrapErr an Ok: ${this.value}`);
	}

	/** Maps an Ok value to another value */
	map<U>(fn: (value: T) => U): Result<U, E> {
		return this.isOk()
			? Result.ok<U, E>(fn(this.value as T))
			: Result.err<U, E>(this.error as E);
	}

	/** Maps an Err value to another error */
	mapErr<F>(fn: (error: E) => F): Result<T, F> {
		return this.isErr()
			? Result.err<T, F>(fn(this.error as E))
			: Result.ok<T, F>(this.value as T);
	}

	/** Chains another Result-producing function if Ok */
	andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
		return this.isOk()
			? fn(this.value as T)
			: Result.err<U, E>(this.error as E);
	}
}

/**
 * Represents an error that occurred during a database operation.
 */
export class DatabaseError extends Error {
	override cause: unknown;
	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = "DatabaseError";
		this.cause = cause;
		if (cause instanceof Error && cause.stack) {
			this.stack += `\nCaused by: ${cause.stack}`;
		}
	}
}

/**
 * Represents an unknown error that occurred during an operation.
 */
export class UnknownError extends Error {
	override cause: unknown;
	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = "UnknownError";
		this.cause = cause;
		if (cause instanceof Error && cause.stack) {
			this.stack += `\nCaused by: ${cause.stack}`;
		}
	}
}
