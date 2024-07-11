import { UserInputService } from "@rbxts/services";

export function useKeyPress(keyCodes: ReadonlyArray<Enum.KeyCode>) {
	return keyCodes.every((keyCode) => UserInputService.IsKeyDown(keyCode));
}
