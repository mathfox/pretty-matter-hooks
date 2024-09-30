import { useHookState } from "@rbxts/matter";

interface Storage<TValue> {
	value?: {
		value: TValue;
	};
}

/**
 * The `key` argument serves as discriminator for `useHookState`.
 */
export function useMap<TValue>(
	key: unknown,
	defaultValue: TValue,
): {
	value: TValue;
} {
	const storage = useHookState(key) as Storage<TValue>;

	storage.value ??= {
		value: defaultValue,
	};

	return storage.value;
}
