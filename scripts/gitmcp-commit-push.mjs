import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const REPO_URL = 'https://github.com/davidabiolla67/ai-agent-qa-workflow';
const WORKDIR = '/Users/pelumioluwaabiola/Documents/agent47';
const COMMIT_MESSAGE = `feat(tests): add complete test suite for parabank user-registration

Add user story documentation
Add comprehensive test plan with all scenarios
Add test execution report with results
Add automated test scripts for checkout process
Include validation, navigation, and edge case tests`;

function toolText(result) {
  const content = result?.content ?? [];
  return content
    .map((item) => {
      if (typeof item?.text === 'string') return item.text;
      return JSON.stringify(item);
    })
    .join('\n');
}

async function callTool(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  const text = toolText(result);
  return { result, text };
}

async function ensureOriginRemote(client) {
  const listed = await callTool(client, 'git_remote', { path: WORKDIR, mode: 'list' });
  if (listed.text.includes('origin') && listed.text.includes('github-ai-agents')) {
    return listed.text;
  }

  try {
    const added = await callTool(client, 'git_remote', {
      path: WORKDIR,
      mode: 'add',
      name: 'origin',
      url: REPO_URL,
    });
    return added.text;
  } catch {
    const setUrl = await callTool(client, 'git_remote', {
      path: WORKDIR,
      mode: 'set-url',
      name: 'origin',
      url: REPO_URL,
    });
    return setUrl.text;
  }
}

async function main() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@cyanheads/git-mcp-server'],
    env: {
      ...process.env,
      MCP_LOG_LEVEL: 'error',
    },
  });

  const client = new Client({
    name: 'agent47-gitmcp-pusher',
    version: '1.0.0',
  });

  await client.connect(transport);

  const summary = {
    workdir: WORKDIR,
    commitMessage: COMMIT_MESSAGE,
    statusBefore: '',
    remoteResult: '',
    commitResult: '',
    pushResult: '',
    statusAfter: '',
  };

  try {
    await callTool(client, 'git_init', {
      path: WORKDIR,
      initialBranch: 'main',
      bare: false,
    });

    await callTool(client, 'git_set_working_dir', {
      path: WORKDIR,
      validateGitRepo: true,
      initializeIfNotPresent: false,
    });

    summary.statusBefore = (await callTool(client, 'git_status', { path: WORKDIR, includeUntracked: true })).text;

    summary.remoteResult = await ensureOriginRemote(client);

    await callTool(client, 'git_add', { path: WORKDIR, paths: ['.'], all: false });

    summary.commitResult = (await callTool(client, 'git_commit', {
      path: WORKDIR,
      message: COMMIT_MESSAGE,
      allowEmpty: false,
    })).text;

    summary.pushResult = (await callTool(client, 'git_push', {
      path: WORKDIR,
      remote: 'origin',
      setUpstream: true,
    })).text;

    summary.statusAfter = (await callTool(client, 'git_status', { path: WORKDIR, includeUntracked: true })).text;

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
