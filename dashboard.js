// dashboard.js
(function(){
  const LS_ATTEMPTS = 'aiassess_attempts';
  function getAttempts(){ try{ return JSON.parse(localStorage.getItem(LS_ATTEMPTS) || '[]'); }catch(e){return [];} }
  const attempts = getAttempts();

  const bestScoreEl = document.getElementById('bestScore');
  const avgScoreEl = document.getElementById('avgScore');
  const countAttemptsEl = document.getElementById('countAttempts');
  const recentScoreEl = document.getElementById('recentScore');
  const attemptListEl = document.getElementById('attemptList');
  const badgesEl = document.getElementById('badges');

  const startBtn = document.getElementById('startAssess');
  const resetBtn = document.getElementById('resetBtn');

  function renderSummary(){
    if(attempts.length === 0){
      bestScoreEl.textContent = '-';
      avgScoreEl.textContent = '-';
      countAttemptsEl.textContent = '0';
      recentScoreEl.textContent = '-';
      attemptListEl.innerHTML = '<div class="muted">No attempts yet. Start your first assessment.</div>';
      badgesEl.innerHTML = '';
      return;
    }
    const scores = attempts.map(a=>a.percentage);
    const best = Math.max(...scores);
    const avg = Math.round(scores.reduce((s,v)=>s+v,0)/scores.length);
    const recent = attempts[attempts.length-1].percentage;
    bestScoreEl.textContent = `${best}%`;
    avgScoreEl.textContent = `${avg}%`;
    countAttemptsEl.textContent = `${attempts.length}`;
    recentScoreEl.textContent = `${recent}%`;

    // list attempts
    attemptListEl.innerHTML = '';
    attempts.slice().reverse().forEach(a=>{
      const node = document.createElement('div'); node.className='attempt-item';
      const d = new Date(a.meta.timestamp);
      node.innerHTML = `<div class="meta">${a.user.name || 'User'} — ${a.percentage}%</div>
        <div class="small muted">${d.toLocaleString()}</div>`;
      node.addEventListener('click', ()=>{ window.location.href = `result.html?attempt=${encodeURIComponent(a.id)}`; });
      attemptListEl.appendChild(node);
    });

    // badges generation: simple heuristics
    const earned = new Set();
    if(best >= 85) earned.add('Generative AI Expert');
    if(scores.some(s=>s>=75)) earned.add('Prompt Master');
    if(avg >= 60) earned.add('AI Explorer');
    if(attempts.length >= 3) earned.add('AI Learner');
    if(attempts.some(a=>a.categories.some(c=>c.category === 'Responsible AI' && c.score >= 70))) earned.add('Responsible AI Learner');
    badgesEl.innerHTML = '';
    earned.forEach(b=>{
      const el = document.createElement('div'); el.className='badge'; el.textContent = b;
      badgesEl.appendChild(el);
    });

    // history chart
    renderHistoryChart(scores);
  }

  function renderHistoryChart(scores){
    const ctx = document.getElementById('historyChart').getContext('2d');
    if(window._historyChart) window._historyChart.destroy();
    window._historyChart = new Chart(ctx, {
      type:'line',
      data:{
        labels: attempts.map(a=>new Date(a.meta.timestamp).toLocaleDateString()),
        datasets:[{
          label:'Score',
          data:scores,
          borderColor:'#0b63ff',
          backgroundColor:'rgba(11,99,255,0.08)',
          fill:true,
          tension:0.3,
          pointRadius:6
        }]
      },
      options:{scales:{y:{beginAtZero:true,max:100}}}
    });
  }

  startBtn.addEventListener('click', ()=>{ window.location.href = 'assessment.html'; });
  resetBtn.addEventListener('click', ()=>{
    if(!confirm('Delete all saved attempts and reset dashboard?')) return;
    localStorage.removeItem(LS_ATTEMPTS);
    localStorage.removeItem('aiassess_user');
    localStorage.removeItem('aiassess_inprogress');
    location.reload();
  });

  renderSummary();
})();