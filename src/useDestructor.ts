import { useHookState } from "@rbxts/matter";
import { PhantomArray } from "@rbxts/phantom/src/Array";

type Dtor = Callback;
type DtorCallback = () => Dtor | undefined;

type Storage = {
	dtor?: Dtor;
};

type StorageWithDependencies = Storage & {
	dependencies?: object;
};

function cleanup(storage: Storage) {
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
	const storage = useHookState(discriminator, cleanup) as StorageWithDependencies;

	if (!storage.dtor || !PhantomArray.equals(dependencies, storage.dependencies)) {
		cleanup(storage);

		storage.dtor = callback();

		storage.dependencies = dependencies;
	}
}
