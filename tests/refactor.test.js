const vscode = require('vscode');
const utils = require('../uitls');
const { refactor, deleteRefactor, applyRefactor } = require('../features/refactoring/refactor');

jest.mock('vscode');
jest.mock('../uitls');

describe('refactorCode', () => {
  const editor = {
    document: {
      getText: jest.fn(),
      positionAt: jest.fn()
    },
    selection: {
      end: {}
    },
    edit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    vscode.window.activeTextEditor = editor;
  });

  it('should show error message if no editor is open', async () => {
    vscode.window.activeTextEditor = undefined;
    await refactor();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Open a file to refactor code.');
  });

  it('should show error message if no code is selected', async () => {
    editor.document.getText.mockReturnValue('');
    await refactor();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Select some code to refactor.');
  });

  it('should insert refactored code as a comment', async () => {
    const selectedCode = 'const a = 1;';
    const refactoredCode = 'const a = 1; // refactored';
    const response = `\`\`\`js\n${refactoredCode}\n\`\`\``;

    editor.document.getText.mockReturnValue(selectedCode);
    utils.queryLLM.mockResolvedValue(response);

    await refactor();

    expect(utils.queryLLM).toHaveBeenCalledWith(expect.stringContaining(selectedCode));
    expect(editor.edit).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Refactored code added as a suggestion. Click \'Apply Refactor\' to use it.');
  });

  it('should show error message if refactoring fails', async () => {
    const selectedCode = 'const a = 1;';
    editor.document.getText.mockReturnValue(selectedCode);
    utils.queryLLM.mockRejectedValue(new Error('LLM error'));

    await refactor();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Error refactoring code: LLM error');
  });
});

describe('deleteRefactoredCode', () => {
  const editor = {
    document: {
      getText: jest.fn(),
      positionAt: jest.fn()
    },
    edit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    vscode.window.activeTextEditor = editor;
  });

  it('should show error message if no editor is open', async () => {
    vscode.window.activeTextEditor = undefined;
    await deleteRefactor();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Open a file to delete refactored code.');
  });

  it('should delete refactored code comments', async () => {
    const text = '// 🔧 Suggested Refactor:\n// const a = 1;\n// 🟢';
    const match = text.match(/\/\/ 🔧 Suggested Refactor:[\s\S]*?\/\/ 🟢/);

    editor.document.getText.mockReturnValue(text);
    editor.document.positionAt.mockImplementation(index => ({ line: index }));

    await deleteRefactor();

    expect(editor.edit).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Suggested refactor deleted successfully!');
  });

  it('should show error message if no refactored code is found', async () => {
    editor.document.getText.mockReturnValue('');
    await deleteRefactor();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No suggested refactor found to delete.');
  });
});

describe('applyRefactoredCode', () => {
  const editor = {
    document: {
      getText: jest.fn(),
      positionAt: jest.fn()
    },
    selection: {},
    edit: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    vscode.window.activeTextEditor = editor;
  });

  it('should apply refactored code', async () => {
    const text = '// 🔧 Suggested Refactor:\n// const a = 1;\n// 🟢';
    const match = text.match(/\/\/ 🔧 Suggested Refactor:\s*([\s\S]*?)\s*\/\/ 🟢/);

    editor.document.getText.mockReturnValue(text);

    await applyRefactor();

    expect(editor.edit).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Refactored code applied successfully!');
  });

  it('should show error message if no refactored code is found', async () => {
    editor.document.getText.mockReturnValue('');
    await applyRefactor();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('No refactored code found.');
  });

  it('should show error message if applying refactored code fails', async () => {
    editor.document.getText.mockReturnValue('// 🔧 Suggested Refactor:\n// const a = 1;\n// 🟢');
    editor.edit.mockResolvedValue(false);

    await applyRefactor();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to apply refactored code.');
  });
});