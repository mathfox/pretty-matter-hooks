import {
	createAtomicBinding,
	isManifest,
	type AtomicBinding,
	type BoundFunction,
	type DEFAULT_DEPTH,
	type InferManifestInstances,
	type Manifest,
	type ManifestInstances,
	type Paths,
} from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

type Storage<Root extends Instance = Instance> = {
	cleanup?: Callback;
	instances?: ManifestInstances<Root> | undefined;
};

function cleanup(storage: Storage) {
	storage.cleanup?.();
}

export function useAtomicBindingManifest<
	const Depth extends number = DEFAULT_DEPTH,
	const Root extends Instance = Instance,
	const Base extends {
		readonly [Key in string]: Paths<Root, Depth>;
	} = {
		readonly [Key in string]: Paths<Root, Depth>;
	},
>(
	root: Root,
	base: Base,
	discriminator?: unknown,
):
	| LuaTuple<[false, undefined]>
	| LuaTuple<[true, ManifestInstances<Root, Depth, Base>]>;

export function useAtomicBindingManifest<
	const Root extends Instance = Instance,
	const M extends Manifest<Root> = Manifest<Root>,
>(
	root: Root,
	manifest: M,
	discriminator?: unknown,
): LuaTuple<[false, undefined]> | LuaTuple<[true, InferManifestInstances<M>]>;

/**
 * The `binding` argument should be memoized in order to work correctly.
 */
export function useAtomicBindingManifest(
	root: Instance,
	value: unknown,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator, cleanup);

	if (!storage.cleanup) {
		let binding: AtomicBinding;

		const boundFn: BoundFunction<Instance> = (instances) => {
			storage.instances = instances;

			return () => {
				storage.instances = undefined;
			};
		};

		if (isManifest(value)) {
			binding = createAtomicBinding(value, boundFn);
		} else {
			binding = createAtomicBinding()(value as Record<string, never>, boundFn);
		}

		binding.bindRoot(root);

		storage.cleanup = () => {
			binding.unbindRoot(root);

			binding.destroy();
		};
	}

	const instances = storage.instances;
	if (instances !== undefined) {
		return $tuple(true as const, instances);
	}

	return $tuple(false as const, undefined);
}
