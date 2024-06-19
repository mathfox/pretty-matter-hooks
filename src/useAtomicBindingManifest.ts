import {
	type AnyManifestRoot,
	AtomicBinding,
	type Manifest,
	type ManifestInstances,
} from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

type Storage<
	R extends AnyManifestRoot = AnyManifestRoot,
	M extends Manifest<R> = Manifest<R>,
> = {
	cleanup?: Callback;
	instances?: ManifestInstances<R, M> | undefined;
};

function cleanup(storage: Storage) {
	storage.cleanup?.();
}

export function useAtomicBindingManifest<
	R extends AnyManifestRoot = AnyManifestRoot,
	M extends Manifest<R> = Manifest<R>,
>(
	root: R,
	manifest: M,
	discriminator?: unknown,
): LuaTuple<[false, undefined]> | LuaTuple<[true, ManifestInstances<R, M>]> {
	const storage = useHookState(discriminator, cleanup) as Storage<R, M>;

	if (!storage.cleanup) {
		const binding = new AtomicBinding<R, M>(manifest, (instances) => {
			storage.instances = instances;

			return () => {
				storage.instances = undefined;
			};
		});

		binding.bindRoot(root);

		storage.cleanup = () => {
			binding.unbindRoot(root);

			binding.destroy();
		};
	}

	const instances = storage?.instances;

	if (instances !== undefined) {
		return $tuple(true as const, instances);
	}

	return $tuple(false as const, undefined);
}
