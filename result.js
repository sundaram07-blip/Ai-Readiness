// result.js
(function(){
  const LS_ATTEMPTS = 'aiassess_attempts';
  // parse attempt id from query or pick last
  const urlParams = new URLSearchParams(window.location.search);
  const attemptId = urlParams.get('attempt');

  function getAttempts(){
    try{ return JSON.parse(localStorage.getItem(LS_ATTEMPTS) || '[]'); }catch(e){return [];}
  }
  const attempts = getAttempts();
  let attempt = null;
  if(attemptId){
    attempt = attempts.find(a=>a.id === attemptId) || attempts[attempts.length-1];
  } else {
    attempt = attempts[attempts.length-1];
  }
  if(!attempt){
    document.body.innerHTML = '<main style="padding:40px">No attempt found. <a href="assessment.html">Take assessment</a></main>';
    throw new Error('No attempt found');
  }

  // DOM elements
  const scoreNumber = document.getElementById('scoreNumber');
  const scoreLabel = document.getElementById('scoreLabel');
  const scoreDescription = document.getElementById('scoreDescription');
  const statCorrect = document.getElementById('statCorrect');
  const statWrong = document.getElementById('statWrong');
  const statSkipped = document.getElementById('statSkipped');
  const statTime = document.getElementById('statTime');

  // compute level label
  function levelFromScore(pct){
    if(pct >= 85) return 'Expert';
    if(pct >= 70) return 'Advanced';
    if(pct >= 50) return 'Intermediate';
    return 'Beginner';
  }

  // show basic stats
  scoreNumber.textContent = attempt.percentage;
  scoreLabel.textContent = levelFromScore(attempt.percentage);
  scoreDescription.textContent = getDescription(attempt.percentage);
  statCorrect.textContent = attempt.correct;
  statWrong.textContent = attempt.wrong;
  statSkipped.textContent = attempt.skipped || 0;
  statTime.textContent = formatDuration(attempt.meta.durationSeconds || 0);

  function formatDuration(sec){
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  function getDescription(pct){
    if(pct >= 85) return 'Outstanding comprehension of AI topics. Consider sharing your knowledge!';
    if(pct >= 70) return 'Excellent understanding of AI concepts with room to improve in a few areas.';
    if(pct >= 50) return 'Solid foundation. Focus on strengthening Responsible AI and ML fundamentals.';
    return 'Good start. Consider the roadmap below to build foundational knowledge.';
  }

  // Charts
  // Circular progress for score
  const scoreCtx = document.getElementById('scoreCircle').getContext('2d');
  const scoreChart = new Chart(scoreCtx, {
    type: 'doughnut',
    data: {
      labels: ['Score','Remaining'],
      datasets: [{data: [attempt.percentage, 100-attempt.percentage], backgroundColor:['#0b63ff','#e6eefc'], borderWidth:0}]
    },
    options: {
      cutout: '75%',
      rotation: -90,
      circumference: 360,
      plugins: {legend:{display:false},tooltip:{enabled:false}}
    }
  });

  // Radar chart: category scores
  const radarCtx = document.getElementById('radarChart').getContext('2d');
  const cats = attempt.categories.map(c=>c.category);
  const catScores = attempt.categories.map(c=>c.score);
  const radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: cats,
      datasets: [{
        label: 'Category score',
        data: catScores,
        backgroundColor: 'rgba(11,99,255,0.12)',
        borderColor: '#0b63ff',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#0b63ff',
        pointRadius:4
      }]
    },
    options: {
      scales:{r:{beginAtZero:true,max:100,grid:{color:'#eef3ff'}}},
      plugins:{legend:{display:false}}
    }
  });

  // Bar chart: correct/wrong/skipped
  const barCtx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {labels:['Correct','Wrong','Skipped'], datasets:[{data:[attempt.correct,attempt.wrong,attempt.skipped],backgroundColor:['#10b981','#ef4444','#f59e0b']}]},
    options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,precision:0}}}
  });

  // Pie chart: improvement distribution (top 3 strengths vs weaknesses)
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const sortedCats = [...attempt.categories].sort((a,b)=>b.score-a.score);
  const strengths = sortedCats.slice(0,3).map(s=>s.category);
  const strengthsValues = sortedCats.slice(0,3).map(s=>s.score);
  const pieChart = new Chart(pieCtx,{
    type:'pie',
    data:{labels:strengths, datasets:[{data:strengthsValues, backgroundColor:['#0b63ff','#7c3aed','#06b6d4']}]},
    options:{plugins:{legend:{position:'bottom'}}}
  });

  // Strengths & improvements lists
  const strengthList = document.getElementById('strengthList');
  const improveList = document.getElementById('improveList');

  // Determine strengths (>70) and improvements (<60)
  attempt.categories.forEach(c=>{
    if(c.score >= 70) {
      const li = document.createElement('li'); li.textContent = `✓ ${c.category}`; strengthList.appendChild(li);
    } else if(c.score < 60) {
      const li = document.createElement('li'); li.textContent = c.category; improveList.appendChild(li);
    }
  });

  // Roadmap timeline (6 weeks)
  const roadmapTimeline = document.getElementById('roadmapTimeline');
  const roadmap = [
    {week:1,title:'AI Fundamentals',hours:6,difficulty:'Easy',goal:'Understand core AI terminology and datasets.'},
    {week:2,title:'Prompt Engineering',hours:5,difficulty:'Easy',goal:'Build prompts that produce predictable outputs.'},
    {week:3,title:'Generative AI',hours:6,difficulty:'Medium',goal:'Learn about LLMs and generation safety.'},
    {week:4,title:'Machine Learning',hours:8,difficulty:'Medium',goal:'Practice supervised learning basics and evaluation.'},
    {week:5,title:'Responsible AI',hours:6,difficulty:'Hard',goal:'Study bias, privacy, and governance.'},
    {week:6,title:'Advanced Applications',hours:8,difficulty:'Hard',goal:'Apply AI to workflows and production patterns.'},
  ];
  roadmap.forEach(r=>{
    const el = document.createElement('div'); el.className='step';
    el.innerHTML = `<div style="width:64px;"><strong>Week ${r.week}</strong></div>
      <div class="meta">
        <div style="font-weight:800">${r.title}</div>
        <div class="small">${r.hours} hrs — ${r.difficulty}</div>
        <div class="small">${r.goal}</div>
      </div>`;
    roadmapTimeline.appendChild(el);
  });

  // Recommended resources
  const resources = [
    {title:'Prompt Engineering Guide',desc:'Practical guide to writing effective prompts',link:'#'},
    {title:'Google AI Essentials',desc:'Foundational AI resources by Google',link:'#'},
    {title:'Microsoft AI Skills',desc:'Learning paths for AI by Microsoft',link:'#'},
    {title:'OpenAI Prompt Guide',desc:'Best practices for interacting with LLMs',link:'#'},
    {title:'Machine Learning Basics',desc:'Intro courses to ML',link:'#'},
    {title:'Responsible AI Resources',desc:'Privacy, fairness and governance',link:'#'},
  ];
  const resourcesGrid = document.getElementById('resourcesGrid');
  resources.forEach(r=>{
    const c = document.createElement('div'); c.className='resource-card';
    c.innerHTML = `<div style="font-weight:800">${r.title}</div><div class="small">${r.desc}</div><div style="margin-top:8px"><a href="${r.link}" class="small">Open</a></div>`;
    resourcesGrid.appendChild(c);
  });

  // Retake button
  document.getElementById('retakeBtn').addEventListener('click', ()=>{
    // Reset in-progress and navigate to assessment
    localStorage.removeItem('aiassess_inprogress');
    window.location.href = 'assessment.html';
  });

  // decorative: animate score number from 0 to percentage
  animateValue(0, attempt.percentage, 900, (v)=>scoreNumber.textContent = v);

  // helper animate
  function animateValue(start,end,duration,cb){
    const startTime = performance.now();
    function step(ts){
      const t = Math.min(1,(ts-startTime)/duration);
      const val = Math.round(start + (end-start) * easeOutCubic(t));
      cb(val);
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function easeOutCubic(t){ return 1 - Math.pow(1-t,3); }
})();