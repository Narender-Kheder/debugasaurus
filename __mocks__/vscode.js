module.exports = {
    extensions: {
      getExtension: jest.fn(() => ({
        isActive: true,
        activate: jest.fn(),
      })),
    },
    window: {
      showInformationMessage: jest.fn(),
      showErrorMessage: jest.fn(),
    },
    commands: {
      registerCommand: jest.fn(),
      executeCommand: jest.fn(),
    },
  };
  