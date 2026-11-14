export const REPO_URL = 'https://github.com/ronak-kumar-sing/refine';
export const RELEASE_URL = `${REPO_URL}/releases/latest`;

/** Demo scenarios. Outputs are pre-written samples; the demo makes no network requests. */
export const SCENARIOS = {
  email: {
    label: 'Email',
    url: 'mail.example.com/compose',
    meta: [
      ['To', 'priya@acme.co'],
      ['Subject', 'Re: Q3 launch proposal'],
    ],
    draft:
      'hey priya, sorry for late reply. i looked at the proposal and its mostly good but the timeline seems kinda tight, can we maybe push the launch by 2 weeks? lmk what u think',
    refined: {
      professional:
        "Hi Priya,\n\nSorry for the slow reply. I've been through the proposal and it's in good shape overall, but the timeline looks tight to me. Could we move the launch back two weeks?\n\nLet me know what you think.",
      casual:
        'Hey Priya, sorry for the late reply! I went through the proposal and mostly love it. The timeline just feels a bit tight. Any chance we could push the launch back a couple of weeks? Let me know what you think.',
      concise:
        'Hi Priya, sorry for the delay. The proposal looks good, but the timeline is tight. Can we move the launch back two weeks?',
      persuasive:
        "Hi Priya, sorry for the delay. The proposal is strong, and I'd like the launch to be just as strong. Two more weeks would give us time to test properly instead of rushing the last stretch. Could we settle on a new date this week?",
    },
  },
  chat: {
    label: 'Team chat',
    url: 'team.example.com/#engineering',
    meta: [['Channel', '#engineering']],
    draft:
      'did anyone check the build? its failing again on main and i think its the new auth thing but not sure, can someone look asap',
    refined: {
      professional:
        "Has anyone looked at the build? It's failing on main again. I think the new auth change is the cause, but I haven't confirmed it. Could someone take a look soon?",
      casual:
        "Has anyone checked the build? Main is failing again. My guess is the new auth change, but I'm not sure. Could someone take a look when they get a minute? It's a little urgent.",
      concise: 'Build is failing on main again, probably from the new auth change. Can someone take a look ASAP?',
      persuasive:
        "Main is failing again, and nothing can merge until it's fixed. The new auth change is the most likely cause. Could whoever worked on it take a look right away?",
    },
  },
  social: {
    label: 'Social post',
    url: 'social.example.com/new-post',
    meta: [['Post to', 'Anyone']],
    draft:
      'excited to share i got a new job at northwind as a product designer!! learned alot at my last company and im really greatful to my team. cant wait to start',
    refined: {
      professional:
        "I'm happy to share that I've joined Northwind as a Product Designer. I learned a lot at my last company, and I'm grateful to the team who helped me grow there. Looking forward to what comes next.",
      casual:
        "Some news: I'm joining Northwind as a Product Designer! I learned so much at my last company and I'm really grateful to my team there. Can't wait to get started.",
      concise: "I've joined Northwind as a Product Designer. Grateful to my last team, and excited for what's next.",
      persuasive:
        "I've joined Northwind as a Product Designer. My last role taught me that good design comes from good teams, and I'm grateful to everyone who helped me grow. If you're building something people love, I'd like to hear about it.",
    },
  },
};

export const DEMO_STYLES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'concise', label: 'Concise' },
  { id: 'persuasive', label: 'Persuasive' },
];

export const STYLES = [
  ['Professional', 'Polished and confident for clients, managers, and anything with a signature.'],
  ['Casual', 'Warm and relaxed, with your typos and stiffness smoothed out.'],
  ['Concise', 'Cuts filler and gets to the point. Great for status updates.'],
  ['Creative', 'Fresher wording and better rhythm, while staying clear.'],
  ['Academic', 'Structured, precise, and formal for papers and research notes.'],
  ['Persuasive', 'Leads with the strongest point and ends with a clear ask.'],
];

export const AI_TELLS = [
  'delve',
  'leverage',
  'utilize',
  'furthermore',
  'seamless',
  'elevate',
  'game-changer',
  'tapestry',
  "in today's fast-paced world",
  'I hope this message finds you well',
];

export const PROVIDERS = [
  { name: 'OpenRouter', detail: 'Claude Opus 5.5 · GPT-5.6 · Llama 4 · DeepSeek', tag: 'One key, every model' },
  { name: 'Google Gemini', detail: 'Flash · Flash-Lite · Pro', tag: 'Free tier' },
  { name: 'OpenAI', detail: 'GPT-4o · GPT-4o mini' },
  { name: 'Anthropic Claude', detail: 'Direct API access' },
  { name: 'ExperientialLabs', detail: 'OpenAI-compatible API' },
  { name: 'Custom endpoint', detail: 'Ollama · LM Studio · vLLM', tag: 'Runs locally', quiet: true },
];

export const SITES = ['Gmail', 'Slack', 'LinkedIn', 'X', 'Notion', 'GitHub', 'Jira', 'Outlook'];

export const FAQ = [
  [
    'Is it free?',
    'The extension is free and open source under the MIT license. You pay your AI provider directly for what you use, if anything. Google Gemini and several OpenRouter models have free tiers, and local models cost nothing.',
  ],
  [
    'Will the result sound like AI wrote it?',
    'That\'s exactly what it\'s built to avoid. Every provider gets the same carefully written editing instructions: keep your meaning and voice, use plain words and natural rhythm, and skip stock phrases like "delve" and "leverage". It aims for the quality of Claude Opus, which you can also pick directly through OpenRouter.',
  ],
  [
    'Does it read everything I type?',
    'No. The extension only reads a field when you trigger a refinement with the icon, the shortcut, or the menu. It then sends that text to your chosen provider and nowhere else.',
  ],
  [
    'Which sites does it work on?',
    "Any site with standard text inputs, textareas, or contenteditable editors, including Gmail, Slack, LinkedIn, X, Notion, and GitHub. Chrome doesn't allow extensions on chrome:// pages or the Chrome Web Store.",
  ],
  [
    "What if I don't like the result?",
    'Click Undo on the notification that appears after each refinement to restore your original text.',
  ],
  [
    'Can I use a model running on my own machine?',
    'Yes. Choose Custom endpoint and enter any OpenAI-compatible URL, such as Ollama at http://localhost:11434/v1/chat/completions. The provider guide on GitHub covers the one-line manifest change it needs.',
  ],
];
