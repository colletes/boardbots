// Board Bots — visitor count + per-bot like/dislike, backed by CounterAPI v1
// (https://docs.counterapi.dev/api/endpoints/v1/ — free, public, no-auth counters).
// Note: since these counters are fully public/no-auth, anyone who knows the
// namespace+name could inflate them — treat these as fun vanity stats, not
// rigorous analytics (use GoatCounter for that).
const COUNTER_BASE = 'https://api.counterapi.dev/v1';
const COUNTER_NS = 'colletes-boardbots';
const VOTE_KEY_PREFIX = 'boardbots_vote_';

async function counterRequest(name, action){
  const path = action ? `${name}/${action}` : `${name}/`;
  const res = await fetch(`${COUNTER_BASE}/${COUNTER_NS}/${path}`);
  if (res.status === 400) {
    // "record not found" = counter never incremented yet, safe to treat as zero.
    // Any other message is a real backend error (this free service is occasionally
    // unstable) and should surface as an error rather than a fake zero.
    const body = await res.json().catch(() => null);
    if (body && body.message === 'record not found') return 0;
    throw new Error('counter backend error: ' + (body?.message || res.status));
  }
  if (!res.ok) throw new Error('counter request failed: ' + res.status);
  const data = await res.json();
  return data.count;
}

function formatCount(n){
  const lang = localStorage.getItem('boardbots_lang') || 'pt';
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR').format(n);
}

async function initVisitCounter(){
  const badge = document.getElementById('visitBadge');
  const el = document.getElementById('visitCount');
  if (!el) return;
  try {
    const count = await counterRequest('site-visits', 'up');
    el.textContent = formatCount(count);
  } catch (e) {
    badge?.classList.add('hidden');
  }
}

async function castVote(bot, choice, likeBtn, dislikeBtn, likeCountEl, dislikeCountEl){
  const votedKey = VOTE_KEY_PREFIX + bot;
  const current = localStorage.getItem(votedKey);
  if (current === choice) return;

  likeBtn.disabled = true;
  dislikeBtn.disabled = true;
  try {
    if (current) {
      const undoCount = await counterRequest(`${current}-${bot}`, 'down');
      (current === 'like' ? likeCountEl : dislikeCountEl).textContent = formatCount(undoCount);
    }
    const newCount = await counterRequest(`${choice}-${bot}`, 'up');
    (choice === 'like' ? likeCountEl : dislikeCountEl).textContent = formatCount(newCount);
    localStorage.setItem(votedKey, choice);
    likeBtn.classList.toggle('voted', choice === 'like');
    dislikeBtn.classList.toggle('voted', choice === 'dislike');
  } catch (e) {
    console.warn('Board Bots: vote request failed', e);
  } finally {
    likeBtn.disabled = false;
    dislikeBtn.disabled = false;
  }
}

async function initVoteButtons(){
  const groups = document.querySelectorAll('.game-card-actions[data-bot]');
  for (const group of groups) {
    const bot = group.dataset.bot;
    const likeBtn = group.querySelector('.vote-btn.like');
    const dislikeBtn = group.querySelector('.vote-btn.dislike');
    const likeCountEl = group.querySelector('.like-count');
    const dislikeCountEl = group.querySelector('.dislike-count');
    const voted = localStorage.getItem(VOTE_KEY_PREFIX + bot);

    try {
      const [likeCount, dislikeCount] = await Promise.all([
        counterRequest(`like-${bot}`),
        counterRequest(`dislike-${bot}`)
      ]);
      likeCountEl.textContent = formatCount(likeCount);
      dislikeCountEl.textContent = formatCount(dislikeCount);
    } catch (e) {
      likeCountEl.textContent = '–';
      dislikeCountEl.textContent = '–';
    }

    if (voted === 'like') likeBtn.classList.add('voted');
    if (voted === 'dislike') dislikeBtn.classList.add('voted');

    likeBtn.addEventListener('click', () => castVote(bot, 'like', likeBtn, dislikeBtn, likeCountEl, dislikeCountEl));
    dislikeBtn.addEventListener('click', () => castVote(bot, 'dislike', likeBtn, dislikeBtn, likeCountEl, dislikeCountEl));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initVisitCounter();
  initVoteButtons();
});
