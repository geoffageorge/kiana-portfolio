export const heroSettingFields = [
  { path: 'maxWidth', label: 'Maximum width (px)', min: 280, max: 1200, defaultValue: 660 },
  { path: 'viewBox.x', label: 'ViewBox left', min: -600, max: 600, defaultValue: 0 },
  { path: 'viewBox.y', label: 'ViewBox top', min: -450, max: 450, defaultValue: 0 },
  { path: 'viewBox.width', label: 'ViewBox width', min: 600, max: 2400, defaultValue: 1200 },
  { path: 'viewBox.height', label: 'ViewBox height', min: 450, max: 1800, defaultValue: 900 },
  { path: 'movement.x', label: 'Horizontal ring offset', min: 0, max: 300, defaultValue: 145 },
  { path: 'movement.y', label: 'Vertical ring offset', min: 0, max: 300, defaultValue: 125 },
  { path: 'movement.labelSpread', label: 'Label spread (%)', min: 0, max: 150, defaultValue: 100 },
];

export const getHeroSetting = (settings, path) => path.split('.').reduce((value, key) => value?.[key], settings);

export function validateHeroSettings(settings) {
  const result = { viewBox: {}, movement: {} };
  for (const field of heroSettingFields) {
    const value = getHeroSetting(settings, field.path);
    if (!Number.isInteger(value) || value < field.min || value > field.max) {
      throw new Error(`${field.label} must be a whole number between ${field.min} and ${field.max}.`);
    }
    const [group, key] = field.path.split('.');
    if (key) result[group][key] = value;
    else result[group] = value;
  }
  return result;
}

export function heroSettingsFromForm(form) {
  const settings = { viewBox: {}, movement: {} };
  const values = new FormData(form);
  for (const { path } of heroSettingFields) {
    const [group, key] = path.split('.');
    const value = values.get(path);
    const number = value === '' || value === null ? NaN : Number(value);
    if (key) settings[group][key] = number;
    else settings[group] = number;
  }
  return validateHeroSettings(settings);
}
