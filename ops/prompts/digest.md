Append one digest to the Google Doc "singletenant.ai: weekly watch" (document id 1-YbcPlRAd2H47wXYQZNGpGzJJmJwCHIpytW4pdxegp0).
Use exactly one update_doc call with a single replaceAllText request:
- containsText.text = "Applied by Claude Code (autopilot digests, newest first)", matchCase true
- replaceText = that same anchor text, then a newline, then the digest text below, unchanged.
Don't read the document first, and make no other change. Reply DONE if the call reports 1 occurrence changed, else FAILED <reason>.

Digest text:
{{DIGEST}}
