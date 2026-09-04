/*
 * Boardbots shared theme kit — JS helpers (Phase 0, see plan_diegetic_next_level.md).
 *
 * Small, presentation-only helpers for DOM patterns that are copy-pasted
 * identically across bots today. Game/audio logic itself (oscillator frequencies,
 * gain envelopes, etc.) stays per-bot since it's intentionally different per theme —
 * only the icon-swap/label DOM bookkeeping is shared here.
 *
 * Usage: <script src="../assets/theme-kit.js"></script> before the bot's own
 * inline <script>, then call window.ThemeKit.* from the bot's own handlers.
 */
(function (global) {
  'use strict';

  /**
   * Toggles the on/off icon pair + label text used by every bot's ambient-sound
   * button. Expects the standard IDs: #icon-ambient-off, #icon-ambient-on,
   * #ambient-label (all present in the bot's own HTML).
   * @param {boolean} active - true when ambient sound was just turned ON.
   * @param {string} labelText - already-translated label to show (e.g. S().btnAmbientOn).
   */
  function setAmbientIcon(active, labelText) {
    const off = document.getElementById('icon-ambient-off');
    const on = document.getElementById('icon-ambient-on');
    const label = document.getElementById('ambient-label');
    if (off) off.classList.toggle('hidden', active);
    if (on) on.classList.toggle('hidden', !active);
    if (label && labelText != null) label.innerText = labelText;
  }

  // Base path resolution for shared and game-specific SFX assets
  let sfxRootUrl = '../assets/sfx/';
  let sfxBaseUrl = '../assets/sfx/shared/';
  try {
    const currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      sfxRootUrl = currentScript.src.replace(/theme-kit\.js(\?.*)?$/, 'sfx/');
      sfxBaseUrl = sfxRootUrl + 'shared/';
    } else if (typeof window !== 'undefined' && window.location) {
      const p = window.location.pathname || '';
      const isSub = p.includes('/bots/') || p.includes('/tools/');
      sfxRootUrl = isSub ? '../assets/sfx/' : 'assets/sfx/';
      sfxBaseUrl = sfxRootUrl + 'shared/';
    }
  } catch (_) {}

  const SFX_MAP = {
    'dice-roll': 'dice-roll.mp3',
    'dice-tray': 'dice-tray.mp3',
    'card-flip': 'card-flip.mp3',
    'card-draw': 'card-draw.mp3',
    'card-shuffle': 'card-shuffle.mp3',
    'token-place': 'token-place.mp3',
    'ui-click': 'ui-click.mp3',
    'turn-notify': 'turn-notify.mp3'
  };

  const audioPool = new Map(); // url -> Array<HTMLAudioElement>
  const MAX_POOL_PER_SOUND = 4;

  function getSfxUrl(key) {
    if (!key || typeof key !== 'string') return '';
    if (SFX_MAP[key]) return sfxBaseUrl + SFX_MAP[key];
    if (key.startsWith('../') || key.startsWith('/') || key.startsWith('http://') || key.startsWith('https://')) {
      return key;
    }
    const ext = (key.endsWith('.mp3') || key.endsWith('.ogg') || key.endsWith('.wav')) ? '' : '.mp3';
    if (key.includes('/')) {
      return sfxRootUrl + key + ext;
    }
    if (key.includes(':')) {
      return sfxRootUrl + key.replace(':', '/') + ext;
    }
    return sfxBaseUrl + key + ext;
  }

  function isSfxMuted() {
    try {
      return localStorage.getItem('boardbots_sfx_muted') === 'true';
    } catch (_) {
      return false;
    }
  }

  function setSfxMuted(muted) {
    try {
      localStorage.setItem('boardbots_sfx_muted', muted ? 'true' : 'false');
    } catch (_) {}
  }

  function toggleSfx() {
    const next = !isSfxMuted();
    setSfxMuted(next);
    return !next;
  }

  /**
   * Preloads one or more sound effects into the audio pool for instant playback.
   * @param {string|string[]} keys - SFX key or array of keys
   */
  function preloadSfx(keys) {
    if (typeof Audio === 'undefined') return;
    const list = Array.isArray(keys) ? keys : [keys];
    list.forEach(function (k) {
      const url = getSfxUrl(k);
      if (!audioPool.has(k)) {
        try {
          const a = new Audio();
          a.preload = 'auto';
          a.src = url;
          audioPool.set(k, [a]);
        } catch (_) {}
      }
    });
  }

  /**
   * Plays a sound effect safely with pooling, volume control, and error handling.
   * @param {string} key - e.g. 'dice-roll', 'dice-tray', 'card-flip', 'token-place', 'ui-click'
   * @param {object} [opts]
   * @param {number} [opts.volume=0.5] - 0.0 to 1.0
   * @param {number} [opts.rate=1.0] - playback speed
   * @returns {HTMLAudioElement|null}
   */
  function playSfx(key, opts) {
    if (typeof Audio === 'undefined' || isSfxMuted()) return null;
    const options = opts || {};
    const vol = typeof options.volume === 'number' ? Math.max(0, Math.min(1, options.volume)) : 0.5;
    const rate = typeof options.rate === 'number' ? options.rate : 1.0;
    const url = getSfxUrl(key);

    let pool = audioPool.get(key);
    if (!pool) {
      pool = [];
      audioPool.set(key, pool);
    }

    let audio = null;
    for (let i = 0; i < pool.length; i++) {
      if (pool[i].paused || pool[i].ended) {
        audio = pool[i];
        break;
      }
    }

    if (!audio) {
      if (pool.length < MAX_POOL_PER_SOUND) {
        try {
          audio = new Audio(url);
          pool.push(audio);
        } catch (_) {
          return null;
        }
      } else {
        audio = pool[0]; // reuse oldest
      }
    }

    try {
      audio.volume = vol;
      audio.playbackRate = rate;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          // Autoplay restricted or interaction required — safely ignore
        });
      }
      return audio;
    } catch (_) {
      return null;
    }
  }

  global.ThemeKit = {
    setAmbientIcon,
    playSfx,
    preloadSfx,
    isSfxMuted,
    setSfxMuted,
    toggleSfx
  };
})(window);

