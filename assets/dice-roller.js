// Shared @3d-dice/dice-box loader/roller used by every bot's 3D dice tray.
// Centralizes the CDN import + theme config + init/roll timeout guards that
// were previously copy-pasted (with drift) into each bot's inline script.
// Usage from a bot's inline <script> (no build step needed, dynamic import works in classic scripts):
//   const { loadDiceBox } = await import('../assets/dice-roller.js');
//   diceBox = await loadDiceBox({ theme: 'rust', themeColor: '#c2543a', scale: 27 });

const DICE_BOX_VERSION = '1.1.3';
const DICE_THEMES_VERSION = '0.2.1';
const DICE_BOX_MODULE = `https://unpkg.com/@3d-dice/dice-box@${DICE_BOX_VERSION}/dist/dice-box.es.min.js`;
const DICE_BOX_ORIGIN = `https://unpkg.com/@3d-dice/dice-box@${DICE_BOX_VERSION}/dist/`;
const DICE_THEMES_ORIGIN = `https://unpkg.com/@3d-dice/dice-themes@${DICE_THEMES_VERSION}/themes`;

// Themes whose material.type is "standard" (fixed baked-in texture) - themeColor has no effect on these.
export const NON_RECOLORABLE_THEMES = ['blueGreenMetal', 'gemstoneMarble', 'wooden'];

/**
 * Loads @3d-dice/dice-box and initializes it with the given theme, bounded by a timeout.
 * @param {object} opts
 * @param {string} [opts.container='#dice-box']
 * @param {string} [opts.theme='default']  - built-in name, or a dice-themes/self-hosted external theme name
 * @param {string} [opts.themeUrl]         - override path for the external theme (defaults to the dice-themes CDN package); ignored when theme==='default'
 * @param {string} [opts.themeColor]       - ignored for NON_RECOLORABLE_THEMES
 * @param {number} [opts.scale=27]
 * @param {number} [opts.gravity]
 * @param {number} [opts.friction]
 * @param {number} [opts.restitution]
 * @param {number} [opts.timeoutMs=6000]
 * @returns {Promise<object>} the ready DiceBox instance (throws if loading/init failed or timed out)
 */
export async function loadDiceBox(opts = {}) {
  const {
    container = '#dice-box',
    theme = 'default',
    themeUrl,
    themeColor,
    scale = 27,
    gravity,
    friction,
    restitution,
    timeoutMs = 6000
  } = opts;

  const loadPromise = (async () => {
    const { default: DiceBox } = await import(DICE_BOX_MODULE);
    const config = { container, assetPath: 'assets/', origin: DICE_BOX_ORIGIN, theme, scale };
    if (theme !== 'default') {
      config.externalThemes = { [theme]: themeUrl || `${DICE_THEMES_ORIGIN}/${theme}` };
    }
    if (themeColor && !NON_RECOLORABLE_THEMES.includes(theme)) config.themeColor = themeColor;
    if (gravity !== undefined) config.gravity = gravity;
    if (friction !== undefined) config.friction = friction;
    if (restitution !== undefined) config.restitution = restitution;
    const box = new DiceBox(config);
    await box.init();
    return box;
  })();

  return Promise.race([
    loadPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('DiceBox init timeout')), timeoutMs))
  ]);
}

/**
 * Rolls dice on an already-initialized DiceBox instance, guarded by a timeout
 * (the physics engine can occasionally never settle and silently hang).
 */
export function rollDiceSafe(diceBox, notation, timeoutMs = 5000) {
  return Promise.race([
    diceBox.roll(notation),
    new Promise((_, reject) => setTimeout(() => reject(new Error('DiceBox roll timeout')), timeoutMs))
  ]);
}

/** Clamps/repairs a die value read from dice-box results (guards NaN/undefined/out-of-range from bad face reads). */
export function sanitizeDie(v, sides = 6) {
  v = parseInt(v, 10);
  return (Number.isInteger(v) && v >= 1 && v <= sides) ? v : (Math.floor(Math.random() * sides) + 1);
}
