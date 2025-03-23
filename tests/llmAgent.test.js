const { gitAgent, checkGitErrors } = require('../features/git/llmAgent');
const utils = require('../uitls');

jest.mock('../uitls');

describe('gitAgent', () => {
  const prompts = {
    generation_extractor: 'Generate command: ',
    generation_system_prompt: 'Explain command: ',
    system_prompt: 'Clarify: ',
    classifier: 'Classify: '
  };
  const userMessage = 'Commit changes';
  const history = 'Previous conversation history';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return aiResponse and aiGitCommand when userIntent is GENERATION', async () => {
    const gitContext = 'Git context';
    const aiGitCommand = 'git commit -m "message"';
    const aiResponse = 'This command commits changes';

    utils.queryLLM
      .mockResolvedValueOnce('GENERATION') // getUserIntent
      .mockResolvedValueOnce(aiGitCommand) // generation command
      .mockResolvedValueOnce(aiResponse); // generation explanation

    utils.runCommand.mockResolvedValue(gitContext);

    const result = await gitAgent(prompts, userMessage, history);

    expect(result).toEqual({ aiResponse, aiGitCommand });
    expect(utils.queryLLM).toHaveBeenCalledTimes(3);
  });

  it('should return aiResponse and undefined when userIntent is not GENERATION', async () => {
    const gitContext = 'Git context';
    const aiResponse = 'Clarified response';

    utils.queryLLM
      .mockResolvedValueOnce('CLARIFICATION') // getUserIntent
      .mockResolvedValueOnce(aiResponse); // clarification response

    utils.runCommand.mockResolvedValue(gitContext);

    const result = await gitAgent(prompts, userMessage, history);

    expect(result).toEqual({ aiResponse, aiGitCommand: undefined });
    expect(utils.queryLLM).toHaveBeenCalledTimes(2);
  });
});

describe('checkGitErrors', () => {
  it('should return git summary from gitCheckFromTerminal', async () => {
    const resultSummary = 'Users git Git Summary:\nGit status output';
    utils.runCommand.mockResolvedValue('Git status output');

    const result = await checkGitErrors();

    expect(result).toBe(resultSummary);
    expect(utils.runCommand).toHaveBeenCalledWith(
      'git status && git log --summary && git branch -v && git remote show origin && git diff && git ls-files && git config --list && git stash list && git reflog && git tag'
    );
  });
});