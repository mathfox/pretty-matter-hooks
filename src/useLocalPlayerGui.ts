import { useHookState } from "@rbxts/matter";
import { Players } from "@rbxts/services";

type Storage = {
	gui?: PlayerGui | undefined;
};

export function useLocalPlayerGui(discriminator?: unknown) {
	const storage = useHookState(discriminator) as Storage;

	storage.gui ??= Players.LocalPlayer.FindFirstChildOfClass("PlayerGui");

	return storage.gui;
}
