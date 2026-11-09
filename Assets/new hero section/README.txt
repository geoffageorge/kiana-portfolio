Kiana George Portfolio Animation

OPTION 1: CUSTOM HTML / EMBED BLOCK
Paste the contents of embed.html into a website block that allows HTML, CSS, and JavaScript. It fills its container width. Some builders disable scripts in editing mode: test the published or preview page.

OPTION 2: IFRAME
Host animation.html on your own website, then insert:
<iframe src="/animation.html" title="Kiana George portfolio animation" style="width:100%;height:630px;border:0;display:block" loading="lazy"></iframe>
Replace /animation.html with the actual hosted URL. Use 540px height for screens below 480px. Do not use a YouTube/video block.

BEHAVIOR
Plays once when at least 25% visible. Replay button restarts it. Reduced-motion preferences show the final headline. Four circles appear briefly and move into vertical alignment; spirograph rotates slowly. No external libraries or font downloads.

DESIGN
White animation surface with a transparent outer document. Ring interiors use white, so place on white for the intended look. To change the surface color, replace --paper:#fff in the embedded CSS.
