/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  QuickPickItem,
  window,
  Disposable,
  QuickInputButton,
  QuickInput,
  ExtensionContext,
  QuickInputButtons,
  workspace,
} from 'vscode';
import find = require('find-process');

/**
 * Takes config and makes axios request
 * @param {ExtensionContext} context context provided by vscode during activation
 */
export async function multiStepInput(context: ExtensionContext) {
  const title = 'Configure Environment';

  /**
   * Init gathering user input on server,port and server path.
   * @returns {State} Object with user input.
   */
  async function collectInputs() {
    const state = {} as Partial<State>;
    await MultiStepInput.run((input) => pickServerType(input, state));
    return state as State;
  }

  /**
   * Gets server type from user
   * @param {MultiStepInput} input traversing function.
   * @param {Partial<State>} state Object with user input.
   * @returns {MultiStepInput} traversing function.
   */
  async function pickServerType(input: MultiStepInput, state: Partial<State>) {
    state.serverType = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 3,
      placeholder: 'Pick a server type',
      items: [{ label: 'Express' }, { label: 'Node' }],
      activeItem: state.serverType,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => inputPort(input, state);
  }

  /**
   * Gets port from user
   * @param {MultiStepInput} input traversing function.
   * @param {Partial<State>} state Object with user input.
   * @returns {MultiStepInput} traversing function.
   */
  async function inputPort(input: MultiStepInput, state: Partial<State>) {
    state.port = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 3,
      placeholder: 'port',
      value: '',
      prompt: 'Enter port number of server',
      validate: validatePort,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => pickServerFile(input, state);
  }

  /**
   * Gets server file path from user
   * @param {MultiStepInput} input traversing function.
   * @param {Partial<State>} state Object with user input.
   * @returns {MultiStepInput} traversing function.
   */
  async function pickServerFile(input: MultiStepInput, state: Partial<State>) {
    if (!window.activeTextEditor) return;
    state.serverPath = await input.showInputBox({
      title,
      step: 3,
      totalSteps: 3,
      value: window.activeTextEditor.document.uri.path,
      prompt: 'select main server file in file explorer',
      validate: validateNameIsUnique,
      shouldResume: shouldResume,
    });
  }

  /**
   * Ensures server running on selected port.
   * @param {string} port server port.
   * @returns {undefined | string} undefined if server running. String if no server running.
   */
  async function validatePort(port: string) {
    if (port.length === 4) {
      return find('port', port).then(function (list) {
        if (!list.length) {
          return `No local server running on ${port}. Please start dev server and try again`;
        } else {
          return undefined;
        }
      });
    }
    return undefined;
  }

  // todo
  async function validateNameIsUnique(serverPath: string) {
    // todo - check that file has express server declaration
    return undefined;
  }

  // todo
  async function shouldResume() {
    return new Promise<boolean>((resolve, reject) => {
      // todo
    });
  }

  interface State {
    title: string;
    step: number;
    totalSteps: number;
    port: string;
    serverType: QuickPickItem;
    serverPath: string;
  }

  const state = await collectInputs();
  return state;
}

class InputFlowAction {
  static back = new InputFlowAction();
  static cancel = new InputFlowAction();
  static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
  title: string;
  step: number;
  totalSteps: number;
  items: T[];
  activeItem?: T;
  placeholder: string;
  buttons?: QuickInputButton[];
  shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
  title: string;
  step: number;
  totalSteps: number;
  value: string;
  prompt: string;
  validate: (value: string) => Promise<string | undefined>;
  buttons?: QuickInputButton[];
  shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {
  static async run<T>(start: InputStep) {
    const input = new MultiStepInput();
    return input.stepThrough(start);
  }

  private current?: QuickInput;
  private steps: InputStep[] = [];

  private async stepThrough<T>(start: InputStep) {
    let step: InputStep | void = start;
    while (step) {
      this.steps.push(step);
      if (this.current) {
        this.current.enabled = false;
        this.current.busy = true;
      }
      try {
        step = await step(this);
      } catch (err) {
        if (err === InputFlowAction.back) {
          this.steps.pop();
          step = this.steps.pop();
        } else if (err === InputFlowAction.resume) {
          step = this.steps.pop();
        } else if (err === InputFlowAction.cancel) {
          step = undefined;
        } else {
          throw err;
        }
      }
    }
    if (this.current) {
      this.current.dispose();
    }
  }

  async showQuickPick<
    T extends QuickPickItem,
    P extends QuickPickParameters<T>
  >({
    title,
    step,
    totalSteps,
    items,
    activeItem,
    placeholder,
    buttons,
    shouldResume,
  }: P) {
    const disposables: Disposable[] = [];
    try {
      return await new Promise<
        T | (P extends { buttons: (infer I)[] } ? I : never)
      >((resolve, reject) => {
        const input = window.createQuickPick<T>();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.placeholder = placeholder;
        input.items = items;
        if (activeItem) {
          input.activeItems = [activeItem];
        }
        input.buttons = [
          ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
          ...(buttons || []),
        ];
        disposables.push(
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              resolve(<any>item);
            }
          }),
          input.onDidChangeSelection((items) => resolve(items[0])),
          input.onDidHide(() => {
            (async () => {
              reject(
                shouldResume && (await shouldResume())
                  ? InputFlowAction.resume
                  : InputFlowAction.cancel,
              );
            })().catch(reject);
          }),
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }

  async showInputBox<P extends InputBoxParameters>({
    title,
    step,
    totalSteps,
    value,
    prompt,
    validate,
    buttons,
    shouldResume,
  }: P) {
    const disposables: Disposable[] = [];
    try {
      return await new Promise<
        string | (P extends { buttons: (infer I)[] } ? I : never)
      >((resolve, reject) => {
        const input = window.createInputBox();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.value = value || '';
        input.prompt = prompt;
        input.buttons = [
          ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
          ...(buttons || []),
        ];
        let validating = validate('');
        disposables.push(
          workspace.onDidOpenTextDocument((doc) => {
            if (
              (doc.languageId == 'typescript' || doc.languageId == 'javascript')
              && doc.uri.scheme === 'file'
            ) {
              input.value = doc.uri.path;
            }
          }),
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              resolve(<any>item);
            }
          }),
          input.onDidAccept(async () => {
            const value = input.value;
            input.enabled = false;
            input.busy = true;
            if (!(await validate(value))) {
              resolve(value);
            }
            input.enabled = true;
            input.busy = false;
          }),
          input.onDidChangeValue(async (text) => {
            const current = validate(text);
            validating = current;
            const validationMessage = await current;
            if (current === validating) {
              input.validationMessage = validationMessage;
            }
          }),
          input.onDidHide(() => {
            (async () => {
              reject(
                shouldResume && (await shouldResume())
                  ? InputFlowAction.resume
                  : InputFlowAction.cancel,
              );
            })().catch(reject);
          }),
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }
}
