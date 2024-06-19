import { useHookState } from "@rbxts/matter";
import { equals } from "@rbxts/sift/out/Array";

type Storage = {
	dependencies: Array<unknown>;
};

export function useChange(
	dependencies: Array<unknown>,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator) as Storage;

	const previous = storage.dependencies;
	storage.dependencies = dependencies;

	return !equals(dependencies, previous);
}
