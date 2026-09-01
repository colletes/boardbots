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

  global.ThemeKit = { setAmbientIcon };
})(window);
