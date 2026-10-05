import { useId, useRef, useState } from 'react';
import { heroSettingFields, getHeroSetting, heroSettingsFromForm } from '../../lib/heroArtworkSettings.js';
import './HeroArtworkControls.css';

export default function HeroArtworkControls({ settings, defaults, onChange }) {
  const id = useId();
  const formRef = useRef(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const apply = async (event) => {
    event.preventDefault();
    let next;
    try { next = heroSettingsFromForm(formRef.current); }
    catch (error) { setStatus(error.message); return; }
    onChange(next);
    if (!import.meta.env.DEV) {
      setStatus('Preview updated for this browser. Download the settings to publish them as site defaults.');
      return;
    }
    setSaving(true);
    setStatus('Saving site defaults…');
    try {
      const response = await fetch('/__portfolio/hero-settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus('Saved as site defaults. Push your changes to publish them.');
    } catch {
      setStatus('Preview updated, but the defaults could not be saved. Download the settings instead.');
    } finally { setSaving(false); }
  };

  const reset = () => {
    for (const field of heroSettingFields) formRef.current.elements.namedItem(field.path).value = getHeroSetting(defaults, field.path);
    onChange(defaults);
    setStatus('Restored the saved defaults.');
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([`${JSON.stringify(settings, null, 2)}\n`], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'heroArtwork.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const fields = (prefix) => heroSettingFields.filter(field => field.path.startsWith(prefix)).map(field => (
    <label key={field.path} htmlFor={`${id}-${field.path}`}>
      <span>{field.label}</span>
      <input id={`${id}-${field.path}`} name={field.path} aria-label={field.label} aria-describedby={`${id}-${field.path}-original`} type="number" min={field.min} max={field.max} step="1" required defaultValue={getHeroSetting(settings, field.path)} />
      <small id={`${id}-${field.path}-original`}>Original: {field.defaultValue}</small>
    </label>
  ));

  return (
    <details className="hero-settings">
      <summary>Adjust hero artwork <span aria-hidden="true">+</span></summary>
      <form ref={formRef} onSubmit={apply}>
        <p className="hero-settings__intro">Adjust the canvas and movement. The artwork fits the available space, and the section below moves down when it grows.</p>
        <fieldset><legend>Canvas size</legend>
          <div className="hero-settings__fields">{fields('maxWidth')}</div>
          <div className="hero-settings__presets" aria-label="Width presets">
            {[480, 660, 780, 960].map(width => <button key={width} type="button" onClick={() => { formRef.current.elements.namedItem('maxWidth').value = width; }}>{width}px{width === 660 ? ' · original' : ''}</button>)}
          </div>
        </fieldset>
        <fieldset><legend>ViewBox framing</legend><p>Left and top set the starting coordinates. Width and height set the visible area in SVG units; larger values add space around the artwork.</p>
          <div className="hero-settings__fields">{fields('viewBox.')}</div>
        </fieldset>
        <fieldset><legend>Movement offsets</legend><p>Ring offsets use SVG units. Label spread scales the labels’ movement while preserving their final alignment.</p>
          <div className="hero-settings__fields">{fields('movement.')}</div>
        </fieldset>
        <div className="hero-settings__actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Apply settings'}</button>
          <button type="button" onClick={reset} disabled={saving}>Reset to saved</button>
          <button type="button" onClick={download}>Download settings</button>
        </div>
        <p className="hero-settings__status" role="status">{status || (import.meta.env.DEV ? 'Applying settings also saves the site defaults.' : 'Changes preview in this browser. Download settings to publish them.')}</p>
      </form>
    </details>
  );
}
