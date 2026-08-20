// Universal BoardBots Logger
(function() {
    window.appLogs = JSON.parse(localStorage.getItem('boardbots_logs') || '[]');
    if (!Array.isArray(window.appLogs)) window.appLogs = [];

    window.logEvent = function(msg) {
        const time = new Date().toISOString().split('T')[1].slice(0, -1);
        const entry = `[${time}] ${msg}`;
        window.appLogs.push(entry);
        if (window.appLogs.length > 500) window.appLogs.shift();
        try {
            localStorage.setItem('boardbots_logs', JSON.stringify(window.appLogs));
        } catch(e) {
            // Ignore quota exceeded
        }
        console.log('[DEBUG]', msg);
    };

    window.addEventListener('error', function(e) {
        window.logEvent('ERROR: ' + e.message + ' @ ' + e.filename + ':' + e.lineno);
    });

    window.addEventListener('unhandledrejection', function(e) {
        window.logEvent('PROMISE REJECT: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
    });

    
    // Auto-track state changes (saveState)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        if (key !== 'boardbots_logs' && !key.includes('dice_presets')) {
            // Truncate if too huge, but usually bot states are small JSONs
            let logVal = value;
            if (logVal.length > 300) logVal = logVal.substring(0, 300) + '...';
            window.logEvent('STATE_SAVE [' + key + ']: ' + logVal);
        }
        originalSetItem.apply(this, arguments);
    };

    // Auto-track user clicks on actionable items
    document.addEventListener('click', function(e) {
        const path = e.composedPath ? e.composedPath() : [];
        for (let el of path) {
            if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList?.contains('action-btn')) {
                const actionText = (el.innerText || el.textContent || '').trim().substring(0, 30).replace(/\n/g, ' ');
                const actionId = el.id ? '#' + el.id : '';
                const onclickAttr = el.getAttribute('onclick') ? ' -> ' + el.getAttribute('onclick') : '';
                if (actionText || actionId) {
                    window.logEvent('USER_CLICK: ' + el.tagName + actionId + ' "' + actionText + '"' + onclickAttr);
                }
                break;
            }
        }
    }, true); // use capture phase to get it before anything stops propagation

    
    // Auto-track user inputs and dropdowns
    document.addEventListener('change', function(e) {
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
            const elId = e.target.id ? '#' + e.target.id : '';
            window.logEvent('USER_INPUT: ' + e.target.tagName + elId + ' changed to "' + e.target.value + '"');
        }
    }, true);

    // Hidden trigger: 7 rapid clicks/taps anywhere on the screen
    let tapCount = 0;
    let tapTimeout;
    document.addEventListener('click', function() {
        tapCount++;
        clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => tapCount = 0, 400);
        
        if (tapCount >= 7) {
            tapCount = 0;
            const logStr = window.appLogs.join('\n');
            navigator.clipboard.writeText(logStr).catch(e => console.error(e));
            
            // Create visual feedback
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#10b981; color:white; padding:10px 20px; border-radius:8px; z-index:99999; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5);';
            toast.innerText = 'Logs copiados para a área de transferência!';
            document.body.appendChild(toast);
            
            // Also show an alert with the last few lines for manual copying on older phones
            setTimeout(() => {
                const recentLogs = window.appLogs.slice(-20).join('\n');
                alert("ÚLTIMOS LOGS (Copiados para área de transferência):\n\n" + recentLogs);
                toast.remove();
            }, 100);
        }
    });
})();
