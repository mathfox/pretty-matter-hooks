import { useHookState } from "@rbxts/matter";
import { ContextActionService, HttpService } from "@rbxts/services";

export type ContextActionInput = Enum.UserInputType | Enum.KeyCode | Enum.PlayerActions;

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

interface Storage {
	value?: {
		callback: ContextActionCallback;
		actionName: string;
	};
}

function cleanup(storage: Storage): void {
	if (!storage.value) return;

	ContextActionService.UnbindAction(storage.value.actionName);
}

export function useContextAction(
	callback: ContextActionCallback,
	{ inputTypes, actionName, priority = Enum.ContextActionPriority.Medium.Value }: ContextActionOptions,
	discriminator?: unknown,
): void {
	const storage = useHookState(actionName || discriminator, cleanup) as Storage;

	if (!storage.value) {
		const resultActionName = actionName || HttpService.GenerateGUID(false);

		const value: NonNullable<Storage["value"]> = {
			actionName: resultActionName,
			callback,
		};

		storage.value = value;

		ContextActionService.BindActionAtPriority(
			resultActionName,
			(name, inputState, inputObject) => value.callback(inputState, inputObject, name),
			false,
			priority,
			...inputTypes,
		);
	}
}
