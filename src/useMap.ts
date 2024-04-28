import { useHookState } from "@rbxts/matter";

type Storage<T> = {
	value?: {
		value: T;
	};
};

export function useMap<T = unknown>(key: unknown, defaultValue: T) {
	const storage = useHookState(key) as Storage<T>;

	storage.value ??= {
		value: defaultValue,
	};

	return storage.value;
}
