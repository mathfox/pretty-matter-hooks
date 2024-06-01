import { AnyManifestRoot, AtomicBinding, Manifest, ManifestInstances } from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

type Storage = {
	value?: {
		instances: ManifestInstances<AnyManifestRoot, Manifest<AnyManifestRoot>> | undefined;
		root: AnyManifestRoot;
		binding: AtomicBinding<AnyManifestRoot>;
	};
};

function cleanup(storage: Storage) {
	if (!storage.value) return;

	storage.value.binding.unbindRoot(storage.value.root);
}

export function useAtomicBindingManifest<R extends AnyManifestRoot = AnyManifestRoot>(
	root: R,
	manifest: Manifest<R>,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator, cleanup) as Storage;

	if (!storage.value) {
		const binding = new AtomicBinding<R>(manifest, (instances) => {
			value.instances = instances as any;

			return () => {
				if (!storage.value) return;

				storage.value.instances = undefined;
			};
		});

		binding.bindRoot(root);

		const value: NonNullable<Storage["value"]> = {
			instances: undefined,
			binding: binding as any,
			root,
		};

		storage.value = value;
	}

	const instances = storage.value.instances;

	return [instances !== undefined, instances] as [false, undefined] | [true, ManifestInstances<R, Manifest<R>>];
}
