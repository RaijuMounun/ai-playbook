---
type: tool_order
before:
  tool: Write
  input_match: '"file_path"\s*:\s*"[^"]*evals[\\/]+[^"\\/]+[\\/]+[^"\\/]+[\\/]+(?:prompt\.md|case\.yaml|graders[\\/])'
after:
  tool: Write
  input_match: '"file_path"\s*:\s*"[^"]*SKILL\.md"'
---
