import { useHookState } from "@rbxts/matter";
import { equals } from "@rbxts/sift/out/Array";

type InferMemoArgs<T> = T extends () => infer A
	? A extends Array<defined>
		? LuaTuple<A>
		: A
	: never;

type Storage<T> = {
	dependencies?: Array<unknown>;
	value?: [T];
};

export function useMemo<C extends Callback = Callback, A = InferMemoArgs<C>>(
	callback: C,
	dependencies: Array<unknown>,
	discriminator?: unknown,
): A {
	const storage = useHookState(discriminator) as Storage<A>;

	if (
		storage.value === undefined ||
		!equals(dependencies, storage.dependencies)
	) {
		storage.dependencies = dependencies;
		storage.value = [callback()];
	}

	if (storage.value.size() === 1) return storage.value[0];

	return storage.value as A;
}
