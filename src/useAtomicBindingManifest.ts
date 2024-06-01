import { AnyManifestRoot, AtomicBinding, Manifest, ManifestInstances } from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

type Storage<R extends AnyManifestRoot = AnyManifestRoot, M extends Manifest<R> = Manifest<R>> = {
	value?: {
		instances: ManifestInstances<R, M> | undefined;
		root: R;
		binding: AtomicBinding<R, M>;
	};
};

function cleanup(storage: Storage) {
	const value = storage.value;
	if (!value) return;

	value.binding.unbindRoot(value.root);
}

export function useAtomicBindingManifest<
	R extends AnyManifestRoot = AnyManifestRoot,
	M extends Manifest<R> = Manifest<R>,
>(root: R, manifest: M, discriminator?: unknown) {
	const storage = useHookState(discriminator, cleanup) as Storage<R, M>;

	if (!storage.value) {
		const binding = new AtomicBinding<R, M>(manifest, (instances) => {
			if (!storage.value) return;

			storage.value.instances = instances as any;

			return () => {
				if (!storage.value) return;

				storage.value.instances = undefined;
			};
		});

		binding.bindRoot(root);

		storage.value = {
			instances: undefined,
			binding,
			root,
		};
	}

	const instances = storage.value?.instances;

	return $tuple(instances !== undefined, instances) as
		| LuaTuple<[false, undefined]>
		| LuaTuple<[true, ManifestInstances<R, M>]>;
}
