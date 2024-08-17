import { useHookState } from "@rbxts/matter";
import { PhantomArray } from "@rbxts/phantom/src/Array";

type Storage = {
	dependencies?: ReadonlyArray<unknown>;
};

export function useChange(
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): boolean {
	const storage = useHookState(discriminator) as Storage;

	const previous = storage.dependencies;
	storage.dependencies = dependencies;

	return !PhantomArray.equals(dependencies, previous);
}
