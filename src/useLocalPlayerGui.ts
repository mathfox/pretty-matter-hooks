import { useHookState } from "@rbxts/matter";
import { Players } from "@rbxts/services";

interface Storage {
	gui?: PlayerGui | undefined;
}

export function useLocalPlayerGui(
	discriminator?: unknown,
): PlayerGui | undefined {
	const storage = useHookState(discriminator) as Storage;

	storage.gui ??= Players.LocalPlayer.FindFirstChildOfClass("PlayerGui");

	return storage.gui;
}
