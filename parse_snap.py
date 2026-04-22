import json

with open("/home/dev/.gemini/antigravity/brain/bc939af3-3a6e-4d65-8102-0bb42f5f2bba/.system_generated/steps/622/output.txt", "r") as f:
    data = json.load(f)

for node in data["snapshot"]:
    if "button" in node.get("nodeName", "").lower() or "button" in node.get("role", ""):
        print(node.get("uid"), node.get("attributes", {}).get("id"))
