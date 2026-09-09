# Agent Skills tutorial source

This project mounts one reviewed, version-controlled Skill into a service-owned
Harness agent in a PURISTA `Support` service. The model receives a compact Skill
catalog and may read the selected `SKILL.md`; the complete content is not pasted
into the initial prompt.

Run `npm install`, then use `npm run build`, `npm test`, and `npm run lint` to
verify the project. Run `npm run demo` for the credential-free example.

The checks and deterministic demo need no credentials. Set `OPENAI_API_KEY`
only for the optional live `npm start` composition.
