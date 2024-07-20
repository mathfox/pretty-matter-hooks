import { useHookState } from "@rbxts/matter";
import { ContextActionService, HttpService } from "@rbxts/services";

export type ContextActionInput =
	| Enum.UserInputType
	| Enum.KeyCode
	| Enum.PlayerActions;

export type ContextActionCallback = (
	inputState: Enum.UserInputState,
	inputObject: InputObject,
	actionName: string,
) => Enum.ContextActionResult | undefined;

export interface ContextActionOptions {
	inputTypes: Array<ContextActionInput>;
	priority?: number;
	actionName?: string;
}

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
	callback: ContextActionCallback,
	{
		inputTypes,
		actionName = HttpService.GenerateGUID(false),
		priority = Enum.ContextActionPriority.Medium.Value,
	}: ContextActionOptions,
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
			(name, inputState, inputObject) =>
				value.callback(inputState, inputObject, name),
			false,
			priority,
			...inputTypes,
		);
	}
}
