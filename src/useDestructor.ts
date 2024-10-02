import { useHookState } from "@rbxts/matter";
import deepEquals from "@rbxts/phantom/src/Array/deepEquals";

type Dtor = Callback;
type DtorCallback = () => Dtor | undefined;

interface Storage {
	dtor?: Dtor;
	dependencies?: ReadonlyArray<unknown>;
}

function cleanup(storage: Storage): void {
	storage.dtor?.();
}

/**
 * Whenever the `dependencies` change the destructor is called.
 */
export function useDestructor(
	callback: DtorCallback,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): void {
	const storage = useHookState(discriminator, cleanup) as Storage;

	if (!storage.dtor || !deepEquals(dependencies, storage.dependencies)) {
		cleanup(storage);

		storage.dependencies = dependencies;

		storage.dtor = callback();
	}
}
