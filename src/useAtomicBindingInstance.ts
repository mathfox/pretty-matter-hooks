import { type TryIndex, createAtomicBinding } from "@rbxts/atomic-binding";
import { useHookState } from "@rbxts/matter";

interface Storage {
	cleanup?: Callback;
	instance?: Instance | undefined;
}

function cleanup(storage: Storage): void {
	storage.cleanup?.();
}

/**
 * Basically the same as using `getInstanceFromPath` function every render,
 * except it utilizes the `AtomicBinding` struct underneath the same behavior.
 */
export function useAtomicBindingInstance<const Root extends Instance = Instance, const Path extends string = string>(
	root: Root,
	path: Path,
	discriminator?: unknown,
): TryIndex<Root, Path> {
	const storage = useHookState(discriminator, cleanup);

	if (!storage.cleanup) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const binding = createAtomicBinding<Root>()<{ payload: any }>(
			{
				payload: path,
			},
			(instances) => {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				storage.instance = instances.payload as any;

				return () => {
					storage.instance = undefined;
				};
			},
		);

		binding.bindRoot(root);

		storage.cleanup = () => {
			binding.unbindRoot(root);

			binding.destroy();
		};
	}

	return storage.instance as TryIndex<Root, Path>;
}
