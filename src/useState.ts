import { useHookState } from "@rbxts/matter";
import { useChange } from "./useChange";

type Storage<T> = {
	value: T;
	setValue: (newValue: T) => void;
};

export type UseStateReturn<T> = LuaTuple<
	[value: T, setValue: (newValue: T) => void]
>;

export function useState<const T>(defaultValue: T): UseStateReturn<T>;

export function useState<const T>(getDefaultValue: () => T): UseStateReturn<T>;

export function useState<const T>(
	defaultValueOrGetter: T | (() => T),
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator) as Storage<T>;

	if (useChange([storage])) {
		storage.value = typeIs(defaultValueOrGetter, "function")
			? defaultValueOrGetter()
			: defaultValueOrGetter;
		storage.setValue = (newValue) => {
			storage.value = newValue;
		};
	}

	return $tuple(storage.value, storage.setValue);
}
