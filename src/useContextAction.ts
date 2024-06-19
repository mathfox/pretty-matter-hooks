import { useHookState } from "@rbxts/matter";
import { ContextActionService } from "@rbxts/services";

export type ContextActionInput =
	| Enum.UserInputType
	| Enum.KeyCode
	| Enum.PlayerActions;

export type ContextActionCallback = (
	inputState: Enum.UserInputState,
	inputObject: InputObject,
) => Enum.ContextActionResult | undefined;

type Storage = {
	value?: {
		callback: ContextActionCallback;
		actionName: string;
	};
};

function cleanup(storage: Storage) {
	if (!storage.value) return;

	ContextActionService.UnbindAction(storage.value.actionName);
}

export function useContextAction(
	actionName: string,
	callback: ContextActionCallback,
	options: {
		inputTypes: Array<ContextActionInput>;
		priority?: Enum.ContextActionPriority;
	},
) {
	const storage = useHookState(actionName, cleanup) as Storage;

	if (!storage.value) {
		const value: NonNullable<Storage["value"]> = {
			actionName,
			callback,
		};

		storage.value = value;

		ContextActionService.BindActionAtPriority(
			actionName,
			(_, ...args) => value.callback(...args),
			false,
			options.priority?.Value || Enum.ContextActionPriority.Medium.Value,
			...options.inputTypes,
		);
	}
}
