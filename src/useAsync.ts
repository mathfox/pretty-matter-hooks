import { useHookState } from "@rbxts/matter";
import { deepEquals } from "@rbxts/phantom/src/Array";

interface Storage<TValue> {
	dependencies: ReadonlyArray<unknown>;
	promise?: Promise<TValue>;
	status: Promise.Status;
	settleValue?: TValue | unknown;
}

function cleanup(storage: Storage<unknown>) {
	storage.promise?.cancel();
}

export function useAsync<TValue>(
	callback: () => Promise<TValue>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): LuaTuple<
	| [status: PromiseConstructor["Status"]["Started"], value: undefined]
	| [status: PromiseConstructor["Status"]["Resolved"], value: TValue]
	| [status: PromiseConstructor["Status"]["Rejected"], errorValue: unknown]
	| [status: PromiseConstructor["Status"]["Cancelled"], undefined]
>;

/**
 * The type of `value` will be `undefined` in case if the promise has not been resolved.
 */
export function useAsync(
	callback: () => Promise<unknown>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator, cleanup) as Storage<unknown>;

	if (!deepEquals(dependencies, storage.dependencies)) {
		cleanup(storage);

		storage.dependencies = dependencies;

		const promise = callback();

		storage.promise = promise;

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

	return $tuple(storage.status, storage.settleValue);
}
