import { useHookState } from "@rbxts/matter";

interface Storage<T> {
	isInitialValueSet: boolean;
	value: T;
	setValue: (newValue: T) => void;
}

export type UseStateReturn<T> = LuaTuple<[value: T, setValue: (newValue: T) => void]>;

export function useState<T>(getDefaultValue: () => T, discriminator?: unknown): UseStateReturn<T>;

export function useState<T>(defaultValue: T, discriminator?: unknown): UseStateReturn<T>;

export function useState<T>(value: T | (() => T), discriminator?: unknown) {
	const storage = useHookState(discriminator) as Storage<T>;

	if (!storage.isInitialValueSet) {
		storage.isInitialValueSet = true;

		storage.value = typeIs(value, "function") ? value() : value;

		storage.setValue = (newValue) => {
			storage.value = newValue;
		};
	}

	return $tuple(storage.value, storage.setValue);
}
