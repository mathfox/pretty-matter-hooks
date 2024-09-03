import { useEvent, useHookState } from "@rbxts/matter";
import { UserInputService } from "@rbxts/services";

interface Storage {
	inputType?: Enum.UserInputType;
}

export function useLastInputType(discriminator?: unknown): Enum.UserInputType {
	const storage = useHookState(discriminator) as Storage;

	storage.inputType ??= UserInputService.GetLastInputType();

	for (const [_, inputType] of useEvent(UserInputService, UserInputService.LastInputTypeChanged)) {
		storage.inputType = inputType;
	}

	return storage.inputType;
}
