import { useEvent, useHookState } from "@rbxts/matter";
import { UserInputService } from "@rbxts/services";

type Storage = {
	inputType?: Enum.UserInputType;
};

export function useLastInputType() {
	const storage = useHookState() as Storage;

	storage.inputType ??= UserInputService.GetLastInputType();

	for (const [_, inputType] of useEvent(UserInputService, "LastInputTypeChanged")) {
		storage.inputType = inputType;
	}

	return storage.inputType;
}
