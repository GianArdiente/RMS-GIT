/* Theme toggle + persistence for Apex Motors
   - Stores choice in localStorage under 'apex_theme'
   - Applies `data-theme="light"` to <html> for light mode
*/
(function(){
  const KEY = 'apex_theme';
  const html = document.documentElement;
  const TOGGLE_ID = 'theme-toggle';

  function applyTheme(theme){
    if(theme === 'light') html.setAttribute('data-theme','light');
    else html.removeAttribute('data-theme');

    const btn = document.getElementById(TOGGLE_ID);
    if(btn) btn.textContent = theme === 'light' ? '☀️' : '🌙';
    try { localStorage.setItem(KEY, theme); } catch(e) {}
  }

  function init(){
    const saved = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = saved || (prefersDark ? 'dark' : 'dark');
    applyTheme(defaultTheme);

    document.addEventListener('click', (e)=>{
      const t = e.target;
      if(!t) return;
      if(t.id === TOGGLE_ID){
        const cur = html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        applyTheme(cur === 'light' ? 'dark' : 'light');
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
