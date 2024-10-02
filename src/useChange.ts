import { useHookState } from "@rbxts/matter";
import deepEquals from "@rbxts/phantom/src/Array/deepEquals";

interface Storage {
	dependencies?: ReadonlyArray<unknown>;
}

export function useChange(dependencies: ReadonlyArray<unknown>, discriminator?: unknown): boolean {
	const storage = useHookState(discriminator) as Storage;

	const previous = storage.dependencies;
	storage.dependencies = dependencies;

	return !deepEquals(dependencies, previous);
}
