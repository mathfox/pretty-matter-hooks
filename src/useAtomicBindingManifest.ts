import { AnyManifestRoot, AtomicBinding, Manifest, ManifestInstances } from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

type Storage = {
	value?: {
		instances: ManifestInstances<Instance, Manifest<Instance>> | undefined;
		root: Instance;
		binding: AtomicBinding<Instance>;
	};
};

function cleanup(storage: Storage) {
	if (!storage.value) return;

	storage.value.binding.unbindRoot(storage.value.root);
}

export function useAtomicBindingManifest<
	R extends AnyManifestRoot = AnyManifestRoot,
	M extends Manifest<any> = Manifest<R>,
>(root: R, manifest: M, discriminator?: unknown) {
	const storage = useHookState(discriminator, cleanup) as Storage;

	if (!storage.value) {
		const binding = new AtomicBinding<R, M>(manifest, (instances) => {
			value.instances = instances;

			return () => {
				if (!storage.value) return;

				storage.value.instances = undefined;
			};
		});

		binding.bindRoot(root);

		const value: NonNullable<Storage["value"]> = {
			instances: undefined,
			binding,
			root,
		};

		storage.value = value;
	}

	const instances = storage.value.instances;

	return [instances !== undefined, instances] as [false, undefined] | [true, ManifestInstances<R, M>];
}
