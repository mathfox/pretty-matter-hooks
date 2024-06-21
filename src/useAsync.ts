import { useHookState } from "@rbxts/matter";
import { equals } from "@rbxts/phantom/src/Array";

export type AsyncState<T> =
	| {
			status: PromiseConstructor["Status"]["Started"];
			message?: undefined;
			value?: undefined;
	  }
	| {
			status: PromiseConstructor["Status"]["Resolved"];
			message?: undefined;
			value: T;
	  }
	| {
			status:
				| PromiseConstructor["Status"]["Cancelled"]
				| PromiseConstructor["Status"]["Rejected"];
			message: unknown;
			value?: undefined;
	  };

type AnyAsyncState<T> = {
	status: Promise.Status;
	message?: unknown;
	value?: T;
};

export type AsyncCallback<T, U extends Array<unknown>> = (
	...args: U
) => Promise<T>;

type Storage<T> = {
	dependencies: Array<unknown>;
	currentPromise?: Promise<T>;
	state: AnyAsyncState<T>;
};

function cleanup(storage: Storage<unknown>) {
	storage.currentPromise?.cancel();
}

type AsyncStateTuple<T extends AsyncState<unknown>> = LuaTuple<
	[result: T["value"], status: T["status"], message: T["message"]]
>;

export function useAsync<T>(
	callback: () => Promise<T>,
	dependencies: Array<unknown>,
	discriminator?: unknown,
): AsyncStateTuple<AsyncState<T>> {
	const storage = useHookState(discriminator, cleanup) as Storage<T>;

	if (!equals(dependencies, storage.dependencies)) {
		cleanup(storage);

		storage.dependencies = dependencies;

		storage.state = {
			status: Promise.Status.Started,
		};

		const promise = callback();

		promise.then(
			(value) => {
				storage.state = { status: promise.getStatus(), value };
			},
			(message) => {
				storage.state = { status: promise.getStatus(), message };
			},
		);

		storage.currentPromise = promise;
	}

	return $tuple(
		storage.state.value,
		storage.state.status,
		storage.state.message,
	);
}
