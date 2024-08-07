import { useHookState } from "@rbxts/matter";
import { useChange } from "./useChange";

type Storage<T> = {
	value: T;
	setValue: (newValue: T) => void;
};

export type UseStateReturn<T> = LuaTuple<
	[value: T, setValue: (newValue: T) => void]
>;

export function useState<T>(
	getDefaultValue: () => T,
	discriminator?: unknown,
): UseStateReturn<T>;

export function useState<T>(
	defaultValue: T,
	discriminator?: unknown,
): UseStateReturn<T>;

export function useState<T>(
	defaultValue: T | (() => T),
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator) as Storage<T>;

	if (useChange([storage])) {
		storage.value = typeIs(defaultValue, "function")
			? defaultValue()
			: defaultValue;
		storage.setValue = (newValue) => {
			storage.value = newValue;
		};
	}

	return $tuple(storage.value, storage.setValue);
}
