(() => {
  const codeHash = '6760b09e74faf12491e936059e7663f9e6b0a73cc96c9d099f502568c008f8c6';
  async function matchesCode(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('') === codeHash;
  }
  const key = 'wedding-planner-unlocked';
  const gate = document.getElementById('accessGate');
  const app = document.getElementById('plannerApp');
  let loaded = false;
  function unlock() {
    gate.hidden = true;
    app.hidden = false;
    if (!loaded) {
      loaded = true;
      const script = document.createElement('script');
      script.src = 'app.js';
      document.body.append(script);
    }
  }
  let remembered = false;
  try { remembered = sessionStorage.getItem(key) === 'yes'; } catch {}
  if (remembered) unlock();
  document.getElementById('accessForm').onsubmit = async event => {
    event.preventDefault();
    const input = document.getElementById('accessCode');
    let valid;
    try { valid = await matchesCode(input.value); } catch {
      document.getElementById('accessError').textContent = 'Բացեք կայքը HTTPS հասցեով կամ localhost-ով։';
      return;
    }
    if (!valid) {
      document.getElementById('accessError').textContent = 'Կոդը սխալ է։ Փորձեք կրկին։';
      input.select();
      return;
    }
    try { sessionStorage.setItem(key, 'yes'); } catch {}
    input.value = '';
    document.getElementById('accessError').textContent = '';
    unlock();
  };
  document.getElementById('lockPlanner').onclick = () => {
    try { sessionStorage.removeItem(key); } catch {}
    app.hidden = true;
    gate.hidden = false;
    document.getElementById('accessCode').focus();
  };
})();
