# Starting a new hub conversation

Paste the prompt below into a new Claude Code conversation in this repo, using Opus. Add the job for that conversation in the last line.

```text
We are continuing work on my ai-playbook repo (Claude Code plugin marketplace). The earlier conversations are not available to you. Everything we decided and everything still open is written down in the repo.

Before doing anything:
1. Read CLAUDE.md and docs/decisions.md. Read "Where things stand" and "Open items" first, then the entries they point to.
2. Read docs/design/agent-architect.md if the job touches agent-architect, evals, or building agents or skills.
3. Tell me in Turkish, in a few lines, where things stand and what is next. Then go ahead with the job below.

How this conversation works:
- It is the hub. Plan the work here, and start a separate sub-session for each self-contained job, with a full brief that names the files and what done looks like. I want to keep talking in this hub while the sub-sessions run.
- I am on the Pro plan. Default to one agent per job, use the cheapest model that does the job well, and give me a quota estimate before anything expensive (eval runs, research, several agents).
- I approve designs and changes before they land. Use the eval-gated improve loop for any change to a skill or agent.
- Record every decision and every open item in docs/decisions.md, with the reason, before this conversation ends or gets long. Update "Where things stand" as well. Nothing should live only in this conversation.
- Talk to me in Turkish; write files, code, and commit messages in English.

The job for this conversation: <write it here, or "pick the first item under Next">
```
