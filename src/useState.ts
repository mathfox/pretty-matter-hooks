import { useHookState } from "@rbxts/matter";

type SetValue<TValue> = (newValue: TValue | ((currentValue: TValue) => TValue)) => void;

interface Storage<TValue> {
	value: TValue;
	setValue: SetValue<TValue>;
}

export type UseStateReturn<TValue> = LuaTuple<[value: TValue, setValue: SetValue<TValue>]>;

export function useState<TValue>(getDefaultValue: () => TValue, discriminator?: unknown): UseStateReturn<TValue>;

export function useState<TValue>(defaultValue: TValue, discriminator?: unknown): UseStateReturn<TValue>;

export function useState<TValue>(value: TValue | (() => TValue), discriminator?: unknown) {
	const storage = useHookState(discriminator) as Storage<TValue>;

	if (!storage.setValue) {
		storage.value = typeIs(value, "function") ? value() : value;

		storage.setValue = (newValue) => {
			storage.value = typeIs(newValue, "function") ? newValue(storage.value) : newValue;
		};
	}

	return $tuple(storage.value, storage.setValue);
}
