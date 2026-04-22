import re

with open("src/core/NotifyX.ts", "r") as f:
    content = f.read()

ai_method = """
  /** @public */
  public static info(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "info" });
  }

  /** @public */
  public static ai(msg: string, options?: Partial<ToastOptions> & { agentName?: string, confidence?: number, showCursor?: boolean }): HTMLElement {
    const aiOpts: any = { ...options?.ai };
    if (options?.agentName) aiOpts.model = options.agentName;
    if (options?.confidence) aiOpts.confidence = options.confidence;
    if (options?.showCursor) aiOpts.streaming = true;
    
    return this.show({ ...options, message: msg, type: "ai", ai: Object.keys(aiOpts).length > 0 ? aiOpts : undefined });
  }
"""

content = content.replace(
    """  /** @public */
  public static info(msg: string, options?: Partial<ToastOptions>): HTMLElement {
    return this.show({ ...options, message: msg, type: "info" });
  }""",
    ai_method
)

with open("src/core/NotifyX.ts", "w") as f:
    f.write(content)

