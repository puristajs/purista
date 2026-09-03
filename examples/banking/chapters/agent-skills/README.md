# Agent Skills tutorial source

This project mounts one reviewed, version-controlled Skill into a native Harness
agent hosted by a PURISTA `Support` service. The model receives a compact skill
catalog and may read the selected `SKILL.md`; the complete content is not pasted
into the initial prompt.

```bash
npm install
npm run build
npm test
npm run lint
```

The tests need no credentials. Set `OPENAI_API_KEY` only for `npm start`.
