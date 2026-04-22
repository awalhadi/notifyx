import re

with open("src/core/NotifyX.ts", "r") as f:
    content = f.read()

# Define NotifyXElement
interface_code = """
interface NotifyXElement extends HTMLElement {
  __notifyxTimeout?: {
    timeoutId: number | null;
    startTime: number;
    remainingTime: number;
    isPaused: boolean;
  };
  __notifyxPauseTimer?: () => void;
  __notifyxResumeTimer?: () => void;
}
"""

# Insert interface after imports
content = re.sub(r'(import .*;\n)+', lambda m: m.group(0) + interface_code, content)

# Replace `(el as any)` with `(el as NotifyXElement)`
content = content.replace("(el as any)", "(el as NotifyXElement)")

# Replace `const aiOpts: any =` with `const aiOpts: AIMetadata =`
content = content.replace("const aiOpts: any =", "const aiOpts: AIMetadata =")

# Replace `toastElement as any` if it exists
content = content.replace("(toastElement as any)", "(toastElement as NotifyXElement)")

with open("src/core/NotifyX.ts", "w") as f:
    f.write(content)
