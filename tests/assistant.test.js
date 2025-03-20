jest.mock("vscode"); // Tells Jest to use our mock instead of the real vscode module

const vscode = require('vscode');

test("Extension should be present", async () => {
  const ext = vscode.extensions.getExtension("your-extension-id");
  expect(ext).toBeDefined();
});

test("Extension should be activated", async () => {
  const ext = vscode.extensions.getExtension("your-extension-id");
  await ext.activate();
  expect(ext.isActive).toBe(true);
});

const { completionGeneration } = require("../features/completion/llmAgent");

test("Completion should return an object with 'text' and 'confidence' fields", async () => {
  const result = await completionGeneration({
    codeBeforeUser: "",
    userLine: "Write a loop in JavaScript",
    codeAfterUser: ""
  });
  expect(result).toHaveProperty("text");
  expect(result).toHaveProperty("confidence");
});
