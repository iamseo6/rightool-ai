'use strict';
// RighTool.ai MCP server — Streamable HTTP, stateless, public, no auth.
// Serves the directory's real data: 45 tools, 10 categories, 8 guides + 2 roundups,
// ranking methodology, and listing tiers — the same data as the live site.

const crypto = require('crypto');

const TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', category: 'chatbots', pricing: 'Freemium', description: 'The original AI assistant — chat, write, code, analyze, and generate images in one place.', homepage: 'https://chatgpt.com' },
  { id: 'claude', name: 'Claude', category: 'chatbots', pricing: 'Freemium', description: 'Anthropic\'s thoughtful assistant — long documents, careful reasoning, and clean writing.', homepage: 'https://claude.ai' },
  { id: 'gemini', name: 'Gemini', category: 'chatbots', pricing: 'Freemium', description: 'Google\'s AI assistant, built into Search, Gmail, and Docs.', homepage: 'https://gemini.google.com' },
  { id: 'perplexity', name: 'Perplexity', category: 'chatbots', pricing: 'Freemium', description: 'An answer engine that searches the live web and cites its sources.', homepage: 'https://www.perplexity.ai' },
  { id: 'microsoft-copilot', name: 'Microsoft Copilot', category: 'chatbots', pricing: 'Freemium', description: 'Microsoft\'s AI companion, built into Windows, Edge, and Microsoft 365.', homepage: 'https://copilot.microsoft.com' },
  { id: 'grammarly', name: 'Grammarly', category: 'writing', pricing: 'Freemium', description: 'Grammar, clarity, and tone checks for everything you write, everywhere you write it.', homepage: 'https://www.grammarly.com' },
  { id: 'jasper', name: 'Jasper', category: 'writing', pricing: 'Paid', description: 'On-brand AI copy for marketing teams — blog posts, ads, and emails in your voice.', homepage: 'https://www.jasper.ai' },
  { id: 'writesonic', name: 'Writesonic', category: 'writing', pricing: 'Freemium', description: 'SEO-ready articles, ads, and landing pages with built-in research.', homepage: 'https://writesonic.com' },
  { id: 'quillbot', name: 'QuillBot', category: 'writing', pricing: 'Freemium', description: 'Paraphrasing, summarizing, and grammar help for students and writers.', homepage: 'https://quillbot.com' },
  { id: 'midjourney', name: 'Midjourney', category: 'image', pricing: 'Paid', description: 'Stunning, stylized AI images from text prompts, via Discord.', homepage: 'https://www.midjourney.com' },
  { id: 'ideogram', name: 'Ideogram', category: 'image', pricing: 'Freemium', description: 'AI images that finally get text right — logos, posters, and typography.', homepage: 'https://ideogram.ai' },
  { id: 'leonardo', name: 'Leonardo.Ai', category: 'image', pricing: 'Freemium', description: 'Game assets, concept art, and consistent characters from prompts.', homepage: 'https://leonardo.ai' },
  { id: 'adobe-firefly', name: 'Adobe Firefly', category: 'image', pricing: 'Freemium', description: 'Commercially safe image generation, built into Photoshop and Express.', homepage: 'https://www.adobe.com/products/firefly.html' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', category: 'image', pricing: 'Free', description: 'The open image model — free, local, and endlessly customizable.', homepage: 'https://stability.ai' },
  { id: 'runway', name: 'Runway', category: 'video', pricing: 'Freemium', description: 'Text-to-video and AI editing tools for creators and filmmakers.', homepage: 'https://runwayml.com' },
  { id: 'descript', name: 'Descript', category: 'video', pricing: 'Freemium', description: 'Edit video by editing text — plus AI voices, filler-word removal, and Studio Sound.', homepage: 'https://www.descript.com' },
  { id: 'opus-clip', name: 'Opus Clip', category: 'video', pricing: 'Freemium', description: 'Turn long videos into viral-ready short clips with AI captions and hooks.', homepage: 'https://www.opus.pro' },
  { id: 'heygen', name: 'HeyGen', category: 'video', pricing: 'Freemium', description: 'AI avatars and voice clones that turn a script into a studio-quality video.', homepage: 'https://www.heygen.com' },
  { id: 'synthesia', name: 'Synthesia', category: 'video', pricing: 'Paid', description: 'Corporate training and explainer videos from text, with 230+ avatars.', homepage: 'https://www.synthesia.io' },
  { id: 'capcut', name: 'CapCut', category: 'video', pricing: 'Freemium', description: 'The free editor behind most short-form video — captions, effects, and templates.', homepage: 'https://www.capcut.com' },
  { id: 'elevenlabs', name: 'ElevenLabs', category: 'audio', pricing: 'Freemium', description: 'The most realistic AI voices — narration, dubbing, and cloning.', homepage: 'https://elevenlabs.io' },
  { id: 'suno', name: 'Suno', category: 'audio', pricing: 'Freemium', description: 'Full songs from a text prompt — lyrics, vocals, and instruments included.', homepage: 'https://suno.com' },
  { id: 'udio', name: 'Udio', category: 'audio', pricing: 'Freemium', description: 'Studio-quality AI music generation with strong vocal control.', homepage: 'https://www.udio.com' },
  { id: 'murf', name: 'Murf AI', category: 'audio', pricing: 'Paid', description: 'Professional AI voiceovers for videos, courses, and presentations.', homepage: 'https://murf.ai' },
  { id: 'github-copilot', name: 'GitHub Copilot', category: 'coding', pricing: 'Freemium', description: 'AI pair programming inside your editor, trained on public code.', homepage: 'https://github.com/features/copilot' },
  { id: 'cursor', name: 'Cursor', category: 'coding', pricing: 'Freemium', description: 'The AI-first code editor — chat with your codebase and ship faster.', homepage: 'https://cursor.com' },
  { id: 'windsurf', name: 'Windsurf', category: 'coding', pricing: 'Freemium', description: 'An agentic IDE that plans, edits, and runs code with you.', homepage: 'https://codeium.com/windsurf' },
  { id: 'replit', name: 'Replit', category: 'coding', pricing: 'Freemium', description: 'Build and ship apps from the browser — AI agent included.', homepage: 'https://replit.com' },
  { id: 'notion-ai', name: 'Notion AI', category: 'productivity', pricing: 'Paid', description: 'Notes, docs, and wikis with AI summaries, drafting, and autofill.', homepage: 'https://www.notion.so/product/ai' },
  { id: 'otter', name: 'Otter.ai', category: 'productivity', pricing: 'Freemium', description: 'Live meeting transcription and AI summaries that capture every decision.', homepage: 'https://otter.ai' },
  { id: 'fireflies', name: 'Fireflies.ai', category: 'productivity', pricing: 'Freemium', description: 'Meeting notes, transcripts, and searchable conversations for teams.', homepage: 'https://fireflies.ai' },
  { id: 'motion', name: 'Motion', category: 'productivity', pricing: 'Paid', description: 'An AI calendar that auto-plans your day around tasks and meetings.', homepage: 'https://www.usemotion.com' },
  { id: 'gamma', name: 'Gamma', category: 'productivity', pricing: 'Freemium', description: 'Beautiful decks, docs, and pages from a single prompt.', homepage: 'https://gamma.app' },
  { id: 'copy-ai', name: 'Copy.ai', category: 'marketing', pricing: 'Freemium', description: 'Go-to-market AI — workflows that write, enrich, and launch campaigns.', homepage: 'https://www.copy.ai' },
  { id: 'adcreative', name: 'AdCreative.ai', category: 'marketing', pricing: 'Paid', description: 'Ad creatives that convert — AI-generated, brand-safe, and scored.', homepage: 'https://www.adcreative.ai' },
  { id: 'surfer', name: 'Surfer SEO', category: 'marketing', pricing: 'Paid', description: 'Content that ranks — data-driven briefs, audits, and optimization.', homepage: 'https://surferseo.com' },
  { id: 'anyword', name: 'Anyword', category: 'marketing', pricing: 'Paid', description: 'Predictive copy that scores performance before you publish.', homepage: 'https://anyword.com' },
  { id: 'canva', name: 'Canva', category: 'design', pricing: 'Freemium', description: 'Design anything — social posts, decks, and brands — with AI built in.', homepage: 'https://www.canva.com' },
  { id: 'figma', name: 'Figma', category: 'design', pricing: 'Freemium', description: 'Collaborative interface design with AI features for teams.', homepage: 'https://www.figma.com' },
  { id: 'framer', name: 'Framer', category: 'design', pricing: 'Freemium', description: 'Design and publish websites visually, with AI site generation.', homepage: 'https://www.framer.com' },
  { id: 'looka', name: 'Looka', category: 'design', pricing: 'Freemium', description: 'Logo and brand kit generation for new businesses.', homepage: 'https://looka.com' },
  { id: 'zapier', name: 'Zapier', category: 'business', pricing: 'Freemium', description: 'Automate work between 7,000+ apps — no code required.', homepage: 'https://zapier.com' },
  { id: 'make', name: 'Make', category: 'business', pricing: 'Freemium', description: 'Visual automation for complex workflows across your stack.', homepage: 'https://www.make.com' },
  { id: 'hubspot', name: 'HubSpot', category: 'business', pricing: 'Freemium', description: 'Marketing, sales, and service in one CRM, with AI throughout.', homepage: 'https://www.hubspot.com' },
  { id: 'airtable', name: 'Airtable', category: 'business', pricing: 'Freemium', description: 'Spreadsheets with the power of a database, plus AI fields.', homepage: 'https://www.airtable.com' },
];

const CATEGORY_NAMES = {
  chatbots: 'Chatbots', writing: 'Writing', image: 'Image', video: 'Video',
  audio: 'Audio', coding: 'Coding', productivity: 'Productivity',
  marketing: 'Marketing', design: 'Design', business: 'Business',
};

const GUIDES = {
  posts: [
    { title: 'How to choose the right AI tool (without trying all of them)', url: 'https://rightool.ai/blog/how-to-choose-the-right-ai-tool' },
    { title: 'ChatGPT vs Claude vs Gemini: which AI assistant should you use?', url: 'https://rightool.ai/blog/chatgpt-vs-claude-vs-gemini' },
    { title: 'The best free AI tools in 2026 (that are actually free)', url: 'https://rightool.ai/blog/best-free-ai-tools' },
    { title: 'AI tools for small business owners: where to start', url: 'https://rightool.ai/blog/ai-tools-for-small-business-owners' },
    { title: 'Best AI tools for YouTube creators: edit less, publish more', url: 'https://rightool.ai/blog/best-ai-tools-for-youtube-creators' },
    { title: 'Best AI coding tools in 2026: Cursor vs Copilot vs the chat assistants', url: 'https://rightool.ai/blog/best-ai-coding-tools' },
    { title: 'AI meeting notes: Otter vs Fireflies vs Notion AI', url: 'https://rightool.ai/blog/ai-meeting-notes-tools' },
    { title: 'AI image generators compared: Midjourney vs Stable Diffusion vs Firefly vs Ideogram', url: 'https://rightool.ai/blog/ai-image-generators-compared' },
  ],
  roundups: [
    { title: 'Best AI tools for small business marketing', url: 'https://rightool.ai/roundup/best-ai-tools-for-small-business-marketing' },
    { title: 'Best AI tools for video creation', url: 'https://rightool.ai/roundup/best-ai-tools-for-video-creation' },
  ],
};

const METHODOLOGY = {
  rankingsForSale: false,
  shortVersion: 'Tools earn their place here. Money can buy speed and a labelled spotlight — never a ranking.',
  criteria: [
    'Does it do the job? Quality of output for its core task, tested against rivals in the same category.',
    'Is the pricing honest? A “free” tier that exists only to collect an email scores worse than a paid tool that’s upfront.',
    'Would we hand it to a friend? Setup friction, support, and whether the free experience respects the user.',
    'Is it still alive? Recent updates, a working product, a company that answers its email.',
  ],
  sponsorsNote: 'Sponsored placements are always labelled. Rankings are never for sale.',
  url: 'https://rightool.ai/how-we-rank',
};

const LISTING = {
  rule: 'Payment buys speed and a labelled featured slot — it never buys a ranking, a roundup spot or a kinder review.',
  tiers: [
    { name: 'Free Listing', price: 0, priceNote: '$0', tagline: 'For patient launches', features: ['Full directory listing with pros, cons & pricing', 'Reviewed in the standard queue (typically 3–4 weeks)', 'Eligible for roundups on merit', 'Free forever — no renewal'] },
    { name: 'Fast-Track Review', price: 49, priceNote: '$49 one-time', tagline: 'Skip the queue', badge: 'MOST POPULAR', features: ['Everything in Free Listing', 'Reviewed and live within 48 hours', 'Category placement checked by a human editor', 'One revision round included'] },
    { name: 'Featured Launch', price: 347, priceNote: '$347 one-time', tagline: 'Launch with a spotlight', features: ['Everything in Fast-Track Review', '30 days in the labelled Featured slot on the homepage', 'Mention in the weekly newsletter', 'Clearly labelled as a paid placement, always'] },
  ],
  finePrint: 'Prices are one-time payments in US dollars. The free listing has no renewal and no expiry. Submitting does not guarantee a listing.',
  url: 'https://rightool.ai/listing-pricing',
};

function publicTool(t) {
  return {
    id: t.id, name: t.name, category: t.category,
    categoryName: CATEGORY_NAMES[t.category], pricing: t.pricing,
    description: t.description, homepage: t.homepage,
    url: 'https://rightool.ai/tool/' + t.id,
  };
}

function searchTools(args) {
  const query = (args.query || '').trim();
  if (!query) return { error: 'query is required' };
  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  let results = TOOLS.filter((t) => {
    const hay = (t.name + ' ' + t.description + ' ' + CATEGORY_NAMES[t.category]).toLowerCase();
    return words.every((w) => hay.includes(w));
  });
  if (args.pricing) results = results.filter((t) => t.pricing === args.pricing);
  const limit = Math.min(Math.max(parseInt(args.limit, 10) || 10, 1), 10);
  if (results.length === 0) return { error: 'No tools matched "' + query + '"' };
  return { count: Math.min(results.length, limit), total: results.length, results: results.slice(0, limit).map(publicTool) };
}

function getToolDetails(args) {
  let found = null;
  if (args.id) found = TOOLS.find((t) => t.id === args.id);
  if (!found && args.name) {
    const n = args.name.toLowerCase();
    found = TOOLS.find((t) => t.name.toLowerCase() === n) ||
      TOOLS.find((t) => t.name.toLowerCase().includes(n));
  }
  if (!found) {
    const words = (args.name || args.id || '').toLowerCase().split(/\W+/).filter(Boolean);
    const suggestions = TOOLS.filter((t) => words.some((w) => t.name.toLowerCase().includes(w)))
      .slice(0, 5).map((t) => t.name);
    return { found: false, suggestions: suggestions.length ? suggestions : TOOLS.slice(0, 5).map((t) => t.name) };
  }
  return Object.assign({ found: true }, publicTool(found));
}

function listCategories() {
  const categories = Object.keys(CATEGORY_NAMES).map((slug) => ({
    slug, name: CATEGORY_NAMES[slug],
    count: TOOLS.filter((t) => t.category === slug).length,
  }));
  return { total: TOOLS.length, categories };
}

const MCP_TOOLS = [
  { name: 'search_tools', description: 'Search the RighTool.ai directory by keyword, optionally filtered by pricing tier. Returns up to 10 matching tools.', inputSchema: { type: 'object', properties: { query: { type: 'string', description: 'Keyword to search tool names, descriptions, and categories.' }, pricing: { type: 'string', enum: ['Free', 'Freemium', 'Paid'], description: 'Optional pricing tier filter.' }, limit: { type: 'integer', minimum: 1, maximum: 10, default: 10 } }, required: ['query'] } },
  { name: 'get_tool_details', description: 'Get full details for one tool by its directory id (e.g. chatgpt) or name.', inputSchema: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } } },
  { name: 'list_categories', description: 'List the directory categories with tool counts.', inputSchema: { type: 'object', properties: {} } },
  { name: 'list_guides', description: 'List the guides and comparison roundups published on RighTool.ai.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_ranking_methodology', description: 'How RighTool.ai ranks tools. Rankings are never for sale.', inputSchema: { type: 'object', properties: {} } },
  { name: 'get_listing_options', description: 'Listing and launch pricing for getting a tool into the directory.', inputSchema: { type: 'object', properties: {} } },
];

function callTool(name, args) {
  switch (name) {
    case 'search_tools': return searchTools(args || {});
    case 'get_tool_details': return getToolDetails(args || {});
    case 'list_categories': return listCategories();
    case 'list_guides': return GUIDES;
    case 'get_ranking_methodology': return METHODOLOGY;
    case 'get_listing_options': return LISTING;
    default: return null;
  }
}

const SUPPORTED_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id, MCP-Protocol-Version');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(''); return; }
  if (req.method !== 'POST') {
    sendJson(res, 405, { jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed; use POST.' } });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      sendJson(res, 400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
      return;
    }
  }
  if (!body || typeof body !== 'object' || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    sendJson(res, 400, { jsonrpc: '2.0', id: (body && body.id !== undefined) ? body.id : null, error: { code: -32600, message: 'Invalid Request' } });
    return;
  }
  const isNotification = !Object.prototype.hasOwnProperty.call(body, 'id');
  const id = isNotification ? null : body.id;
  const reply = (result) => sendJson(res, 200, { jsonrpc: '2.0', id, result });
  const replyError = (code, message) => sendJson(res, 200, { jsonrpc: '2.0', id, error: { code, message } });
  const accept = () => { res.statusCode = 202; res.end(''); };

  switch (body.method) {
    case 'initialize': {
      const clientVersion = body.params && body.params.protocolVersion;
      const version = SUPPORTED_VERSIONS.includes(clientVersion) ? clientVersion : '2025-06-18';
      res.setHeader('Mcp-Session-Id', crypto.randomUUID());
      reply({ protocolVersion: version, capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'RighTool.ai', version: '1.0.0' } });
      return;
    }
    case 'notifications/initialized':
      if (isNotification) accept(); else reply({});
      return;
    case 'ping':
      if (isNotification) accept(); else reply({});
      return;
    case 'tools/list':
      if (isNotification) { accept(); return; }
      reply({ tools: MCP_TOOLS });
      return;
    case 'tools/call': {
      if (isNotification) { accept(); return; }
      const params = body.params || {};
      const result = callTool(params.name, params.arguments || {});
      if (result === null) { replyError(-32602, 'Unknown tool: ' + params.name); return; }
      reply({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
      return;
    }
    default:
      if (isNotification) accept(); else replyError(-32601, 'Method not found: ' + body.method);
      return;
  }
};
