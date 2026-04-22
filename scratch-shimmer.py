import re

with open("src/styles/themes.css", "r") as f:
    content = f.read()

# Fix shimmer to use transform instead of left
shimmer_old = """/* Shimmer */
.notifyx::before {
  content: '';
  position: absolute;
  inset: 0;
  left: -100%;
  width: 60%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent);
  animation: nx-shimmer 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}"""

shimmer_new = """/* Shimmer */
.notifyx::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-150%);
  width: 60%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 50%, transparent);
  animation: nx-shimmer 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}"""

content = content.replace(shimmer_old, shimmer_new)

with open("src/styles/themes.css", "w") as f:
    f.write(content)

with open("src/styles/animations.css", "r") as f:
    anim = f.read()

anim_old = """@keyframes nx-shimmer {
  0% { left: -100%; }
  20%, 100% { left: 200%; }
}"""

anim_new = """@keyframes nx-shimmer {
  0% { transform: translateX(-150%); }
  20%, 100% { transform: translateX(250%); }
}"""

anim = anim.replace(anim_old, anim_new)

with open("src/styles/animations.css", "w") as f:
    f.write(anim)

