import { useHookState } from "@rbxts/matter";

interface Storage<T> {
	value?: {
		value: T;
	};
}

/**
 * The `key` argument serves as discriminator for `useHookState`.
 */
export function useMap<T>(
	key: unknown,
	defaultValue: T,
): {
	value: T;
} {
	const storage = useHookState(key) as Storage<T>;

	storage.value ??= {
		value: defaultValue,
	};

	return storage.value;
}
