KIANA GEORGE — WEBSITE ANIMATION
Latest approved version: close-ups, faster four-circle/diamond transition, no spirograph.

QUICK PREVIEW
Open animation.html in a web browser. Click REPLAY to watch it again.

OPTION 1 — EMBED THE COMPLETE COMPONENT
Copy everything inside embed.html into a Custom HTML / Raw HTML block that permits CSS and JavaScript.
Use a full-width section with no extra vertical padding. Add this component only once on a page.
Some WordPress editors remove script elements. If that happens, use Option 2 or Option 3.

OPTION 2 — SEPARATE FILES (FOR YOUR DEVELOPER)
1. Add the contents of component.html where the animation should appear.
2. Load animation.css in the page head.
3. Load animation.js with defer, or in the footer after the component.
   Example, replacing /assets/ with your actual upload folder:
   <link rel="stylesheet" href="/assets/animation.css">
   <script src="/assets/animation.js" defer></script>

OPTION 3 — SELF-CONTAINED IFRAME
Upload animation.html to a public folder on your website, for example /animation/animation.html.
Then add the following to the page, replacing the URL with your actual URL:

<style>
.kiana-animation-frame {display:block;width:100%;height:626px;border:0;}
@media(max-width:480px){.kiana-animation-frame {height:526px;}}
</style>
<iframe class="kiana-animation-frame" src="/animation/animation.html" title="Kiana George: Understanding people. Shaping digital experiences." loading="eager"></iframe>

BEHAVIOR
- Plays once when the component enters the viewport; rests on the headline.
- Replay button restarts the sequence.
- Respects reduced-motion preferences by showing the final message immediately.
- Final headline remains readable if JavaScript is disabled.
- Responsive sizing; original four colors; sharp CSS shapes and live text.
- No external libraries, fonts, tracking, or network requests.
- Contains no ChatGPT preview controls or branding.

CUSTOMIZATION
- Edit headline and subhead in component.html, embed.html, or animation.html, depending on the installation option.
- The main headline currently uses an h1 element. If the page already has its own h1, change this to h2 and update the matching CSS/JavaScript selectors.
- All component CSS is scoped to #kg-quick-convergence.
- Keep the same element classes and id unless updating the corresponding CSS and JavaScript.
- The component uses a white background, matching the approved preview.

FILES
animation.html  Self-contained preview and iframe deployment file.
embed.html      Complete inline component for a page builder.
component.html  Markup only, for use with the separate CSS/JS files.
animation.css   Component styles.
animation.js    Animation and viewport/replay behavior.
README.txt      This guide.

VALIDATION
JavaScript syntax, animation states, replay, reduced-motion behavior, and archive contents were checked programmatically.
Visual integration with your site's theme and page builder should be reviewed after installation.
