import type { Manifest, ManifestInstances } from "@rbxts/atomic-binding";
import { AtomicBinding } from "@rbxts/atomic-binding";
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

export function useAtomicBindingManifest<R extends Instance = Instance, M extends Manifest<R> = Manifest<R>>(
	discriminator: unknown,
	root: R,
	manifest: M,
) {
	const storage = useHookState(discriminator, cleanup) as Storage;

	if (!storage.value) {
		const value: NonNullable<Storage["value"]> = {
			instances: undefined,
			binding: new AtomicBinding<R, M>(manifest, (instances) => {
				value.instances = instances as any;

				return () => {
					if (!storage.value) return;

					storage.value.instances = undefined;
				};
			}),
			root,
		};

		value.binding.bindRoot(root);

		storage.value = value;
	}

	const instances = storage.value.instances;

	return [instances !== undefined, instances] as [false, undefined] | [true, ManifestInstances<R, M>];
}
