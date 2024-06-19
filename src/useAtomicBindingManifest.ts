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
	value?: {
		info: {
			instances: ManifestInstances<R, M> | undefined;
			root: R;
		};
		binding: AtomicBinding<R, M>;
	};
};

function cleanup(storage: Storage) {
	const value = storage.value;
	if (!value) return;

	value.binding.unbindRoot(value.info.root);
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

	if (!storage.value) {
		const info: NonNullable<Storage["value"]>["info"] = {
			instances: undefined,
			root,
		};

		const binding = new AtomicBinding<R, M>(manifest, (instances) => {
			info.instances = instances as any;

			return () => {
				info.instances = undefined;
			};
		});

		binding.bindRoot(root);

		storage.value = {
			binding,
			info: info as any,
		};
	}

	const instances = storage.value?.info.instances;

	if (instances !== undefined) {
		return $tuple(true as const, instances);
	}

	return $tuple(false as const, undefined);
}
