async function main() {
	const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
	const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
	const { chromium, firefox, webkit } = await import('@playwright/test');
	const { z } = await import('zod');

	const isHeaded = process.argv.includes('--head');
	const browserArgIndex = process.argv.indexOf('--browser');
	const browserName = browserArgIndex >= 0 ? process.argv[browserArgIndex + 1] : 'chrome';

	const browserTypes = {
		chrome: chromium,
		chromium,
		firefox,
		webkit,
	};

	let browser;
	let page;

	async function getPage() {
		if (page) {
			return page;
		}

		const browserType = browserTypes[browserName] ?? chromium;
		browser = await browserType.launch({
			headless: !isHeaded,
		});

		const context = await browser.newContext();
		page = await context.newPage();
		return page;
	}

	const server = new McpServer({
		name: 'unifiedmcpserver',
		version: '1.0.0',
	});

	server.tool('ping', 'Returns a simple pong response.', {}, async () => {
		return {
			content: [
				{
					type: 'text',
					text: 'pong',
				},
			],
		};
	});

	server.tool(
		'sum',
		'Adds two numbers and returns the result.',
		{
			a: z.number(),
			b: z.number(),
		},
		async ({ a, b }) => {
			return {
				content: [
					{
						type: 'text',
						text: `Result: ${a + b}`,
					},
				],
			};
		}
	);

	server.tool(
		'open_page',
		'Opens a URL in the configured browser.',
		{
			url: z.string().url(),
		},
		async ({ url }) => {
			const activePage = await getPage();
			await activePage.goto(url, { waitUntil: 'load' });

			return {
				content: [
					{
						type: 'text',
						text: `Opened ${url}`,
					},
				],
			};
		}
	);

	server.tool('get_page_title', 'Returns the title of the active page.', {}, async () => {
		const activePage = await getPage();
		const title = await activePage.title();

		return {
			content: [
				{
					type: 'text',
					text: title || '(empty title)',
				},
			],
		};
	});

	process.on('exit', async () => {
		if (browser) {
			await browser.close();
		}
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error('Failed to start MCP server:', error);
	process.exit(1);
});
