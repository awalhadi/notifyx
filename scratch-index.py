import re

with open("example/index.html", "r") as f:
    content = f.read()

# Fix showStreamToast
stream_old = """    // Stream toast (fake stream)
    async function showStreamToast() {
      const text = "Analyzing your codebase… Found 3 potential memory leaks in worker threads. Recommend using WeakRef for cache entries. Performance improvement estimated at 23%.";
      const fakeStream = StreamBridge.fakeStream(text, 4, 28);
      await NotifyX.stream(fakeStream, {
        loadingMessage: "AI is analyzing…",
        position: "top-right",
        duration: 7000,
        onComplete: (full) => console.log("Stream complete:", full.length, "chars"),
      });
    }"""

stream_new = """    // Stream toast (fake stream)
    async function showStreamToast() {
      const text = "Analyzing your codebase… Found 3 potential memory leaks in worker threads. Recommend using WeakRef for cache entries. Performance improvement estimated at 23%.";
      const stream = NotifyX.stream({
        title: "AI Analysis",
        loadingMessage: "AI is analyzing…",
        position: "top-right",
        onComplete: (full) => console.log("Stream complete:", full.length, "chars"),
      });

      for (let i = 0; i < text.length; i += 4) {
        stream.update(text.slice(i, i + 4));
        await new Promise(r => setTimeout(r, 28));
      }
      stream.success(text, { duration: 7000 });
    }"""

content = content.replace(stream_old, stream_new)

with open("example/index.html", "w") as f:
    f.write(content)

