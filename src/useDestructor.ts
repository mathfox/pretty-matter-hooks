import { useHookState } from "@rbxts/matter";
import { equals, isArray } from "@rbxts/sift/out/Array";

type Dtor = Callback;
type DtorCallback = () => Dtor;

type Storage = {
	dtor?: Dtor;
};

type StorageWithDependencies = Storage & {
	dependencies?: object;
};

function cleanup(storage: Storage) {
	if (storage.dtor) storage.dtor();
}

/**
 * Do not pass a discriminator of the `table` type. This will cause the underlying code flow to interpret this as `dependencies` without the discriminator being passed as 3rd argument.
 */
export function useDestructor(
	callback: DtorCallback,
	discriminator?: unknown,
): void;

/**
 * Whenever the `dependencies` change the destructor is called.
 */
export function useDestructor(
	callback: DtorCallback,
	dependencies: Array<unknown>,
	discriminator?: unknown,
): void;

export function useDestructor(
	callback: DtorCallback,
	dependenciesOrDiscriminator?: unknown,
	discriminator?: unknown,
) {
	if (typeIs(dependenciesOrDiscriminator, "table")) {
		const storage = useHookState(
			discriminator,
			cleanup,
		) as StorageWithDependencies;

		const dependencies = dependenciesOrDiscriminator;

		if (!storage.dtor || !equals(dependencies, storage.dependencies)) {
			cleanup(storage);

			storage.dtor = callback();

			storage.dependencies = dependencies;
		}
	} else {
		const storage = useHookState(
			dependenciesOrDiscriminator,
			cleanup,
		) as Storage;

		if (!storage.dtor) {
			storage.dtor = callback();
		}
	}
}
