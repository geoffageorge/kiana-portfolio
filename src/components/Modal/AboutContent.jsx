import { assetUrl } from '../../lib/urls.js';

const asset = (file) => assetUrl(`about-figma/${file}`);

export default function AboutContent({ site }) {
  return (
    <div className="about-content" data-figma-node="28:40">
      <figure className="about-portrait" data-figma-node="497:11" style={{ maskImage: `url("${asset('white-dress-portrait-without-graduation-sash-copy1.svg')}")` }}>
        <div className="about-portrait__rotation">
          <div className="about-portrait__source" data-figma-node="497:9">
            <img src={asset('white-dress-portrait-without-graduation-sash-copy2.png')} alt="Kiana George" width="1179" height="1334" decoding="async" />
          </div>
        </div>
      </figure>
      <div className="about-content__copy" data-figma-node="486:9">
        <p>Growing up, people called me “Curious George” (yes, my last name is George!), and it still fits. I’m always asking questions and wanting to know more about the people around me. That curiosity led me to broadcast journalism, where I became an award-winning storyteller, and then to UX design, where I combine my curiosity about people with storytelling and creative problem-solving to build meaningful experiences.</p>
        <p>Outside of design, you’ll find me running (one marathon and two half marathons so far), hiking, or in the kitchen baking bread and hosting themed dinner parties. I also love exploring new places and perspectives, from studying abroad in Florence and Greece to traveling around the world.</p>
        <p>Currently, I’m laying the groundwork to develop a food and health platform for women with PCOS, where research and design make health information clearer and more approachable.</p>
        <p>Whether I’m interviewing, designing, or hosting, it all comes back to learning people’s stories and finding creative ways to bring them together.</p>
      </div>
      <div className="about-content__actions">
        <a className="profile-button profile-button--resume" href={site.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Resume (PDF, opens in a new tab)">
          <img src={asset('rectangle138.svg')} alt="" width="111.949" height="37.3165" aria-hidden="true" data-figma-node="498:28" />
          <span data-figma-node="498:29">RESUME <span aria-hidden="true">↗</span></span>
        </a>
        <a className="profile-button profile-button--linkedin" href={site.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" data-figma-node="498:26"><span data-figma-node="498:27">LINKEDIN <span aria-hidden="true">↗</span></span></a>
      </div>
    </div>
  );
}
