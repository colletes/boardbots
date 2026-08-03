// Board Bots — rolling "latest supporters" marquee.
//
// This is a manually-curated list (no backend/database — keeps things 100%
// free). Whenever BuyMeACoffee emails about a new supporter, add one entry
// below (newest first) and the marquee updates automatically on next visit.
//
// type: 'coffee' | 'commission' | 'membership' | 'recurring'
// count: only used for type 'coffee' (number of coffees in that purchase)
// level: only used for type 'membership' (membership tier name)
const SUPPORTERS = [
  // { name: 'Alex', type: 'coffee', count: 1 },
  // { name: 'Sam', type: 'membership', level: 'Gold' },
];

const MAX_SHOWN = 12;

function s(){
  return (typeof SITE_I18N !== 'undefined')
    ? SITE_I18N[localStorage.getItem('boardbots_lang') || 'pt']
    : {};
}

function describe(supporter){
  const t = s();
  const name = supporter.name || 'Anonymous';
  switch (supporter.type) {
    case 'donation.created':
    case 'extra_purchase.created':
    case 'wishlist_payment.created': {
      const count = supporter.coffeeCount || 1;
      const tpl = count === 1 ? t.supporter_coffee_one : t.supporter_coffee_many;
      return (tpl || '{name}').replace('{name}', name).replace('{count}', count);
    }
    case 'commission_order.created':
      return (t.supporter_commission || '{name}').replace('{name}', name);
    case 'membership.started':
      return (t.supporter_membership || '{name}').replace('{name}', name).replace('{level}', supporter.membershipLevel || '');
    case 'recurring_donation.started':
      return (t.supporter_recurring || '{name}').replace('{name}', name);
    default:
      return name;
  }
}

function heartIcon(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-10-9.2C.4 8 1.9 4.5 5.3 3.6c2-.5 4 .3 5 2 .9 1.6.7 1.6 1.7 0 1-1.7 3-2.5 5-2 3.4.9 4.9 4.4 3.3 7.7-2.5 4.6-10 9.2-10 9.2Z"/></svg>';
}

function render(list){
  const wrap = document.getElementById('supportersMarquee');
  const empty = document.getElementById('supportersEmpty');
  if (!wrap) return;

  if (!list.length) {
    wrap.classList.add('hidden');
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  wrap.classList.remove('hidden');

  const chips = list.map(sup => `<span class="supporter-chip">${heartIcon()}${describe(sup)}</span>`).join('');
  // Content is duplicated so the CSS marquee (translateX -50%) loops seamlessly.
  wrap.innerHTML = `<div class="supporters-track">${chips}${chips}</div>`;
}

function init(){
  render(SUPPORTERS.slice(0, MAX_SHOWN));
}

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('boardbots:langchange', () => init());
