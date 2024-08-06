import { useHookState } from "@rbxts/matter";
import { equals } from "@rbxts/phantom/src/Array";

type Storage<T> = {
	dependencies: ReadonlyArray<unknown>;
	promise?: Promise<T> | LightPromise<T>;
	status: Promise.Status | LightPromise.Status;
	settleValue?: T | unknown;
};

function cleanup(storage: Storage<unknown>) {
	if (LightPromise.is(storage.promise)) {
		storage.promise.cancel();
	} else {
		storage.promise?.cancel();
	}
}

export function useAsync<const T>(
	callback: () => Promise<T>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): LuaTuple<
	| [status: PromiseConstructor["Status"]["Started"], value: undefined]
	| [status: PromiseConstructor["Status"]["Resolved"], value: T]
	| [status: PromiseConstructor["Status"]["Rejected"], errorValue: unknown]
	| [status: PromiseConstructor["Status"]["Cancelled"], undefined]
>;

export function useAsync<const T>(
	callback: () => LightPromise<T>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): LuaTuple<
	| [status: LightPromiseConstructor["Status"]["Started"], value: undefined]
	| [status: LightPromiseConstructor["Status"]["Resolved"], value: T]
	| [status: LightPromiseConstructor["Status"]["Rejected"], errorValue: unknown]
	| [status: LightPromiseConstructor["Status"]["Cancelled"], undefined]
>;

/**
 * The type of `value` will be `undefined` in case if the promise has not been resolved.
 */
export function useAsync(
	callback: (() => LightPromise<unknown>) | (() => Promise<unknown>),
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator, cleanup) as Storage<unknown>;

	if (!equals(dependencies, storage.dependencies)) {
		cleanup(storage);

		storage.dependencies = dependencies;

		const promise = callback();

		storage.promise = promise;

		if (LightPromise.is(promise)) {
			promise.then(
				(value) => {
					storage.settleValue = value;
				},
				(errorValue) => {
					storage.settleValue = errorValue;
				},
			);

			promise.finally((status) => {
				storage.status = status;
			});
		} else {
			promise.then(
				(value) => {
					storage.settleValue = value;
				},
				(errorValue) => {
					storage.settleValue = errorValue;
				},
			);

			promise.finally(() => {
				storage.status = promise.getStatus();
			});
		}
	}

	return $tuple(storage.status, storage.settleValue);
}
