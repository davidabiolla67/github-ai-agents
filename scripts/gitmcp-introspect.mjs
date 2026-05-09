import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@cyanheads/git-mcp-server'],
  });

  const client = new Client({
    name: 'agent47-gitmcp-introspect',
    version: '1.0.0',
  });

  await client.connect(transport);

  const toolsResponse = await client.listTools();
  const tools = toolsResponse.tools ?? [];

  console.log(`Discovered ${tools.length} gitmcp tools`);
  for (const tool of tools) {
    const required = tool.inputSchema?.required ?? [];
    const properties = Object.keys(tool.inputSchema?.properties ?? {});
    console.log(`\n- ${tool.name}`);
    console.log(`  required: ${JSON.stringify(required)}`);
    console.log(`  properties: ${JSON.stringify(properties)}`);
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

