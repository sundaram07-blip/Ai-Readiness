// assessment.js (module)
import QUESTIONS from './questions.js'; // NOTE: for browsers, questions.js defines global QUESTIONS. We'll handle fallback.

(function(){
  // If import isn't supported or QUESTIONS is global, adapt:
  const ALL_QUESTIONS = (typeof QUESTIONS !== 'undefined') ? QUESTIONS : window.QUESTIONS || [];

  // Config
  const TOTAL = Math.min(ALL_QUESTIONS.length, 30); // use up to 30
  const TIME_SECONDS = 20 * 60; // 20 minutes

  // State
  let currentIndex = 0;
  let answers = []; // array of selected index or null
  let timer = null;
  let remaining = TIME_SECONDS;
  let autoSubmitTimer = null;
  let startedAt = null;

  // Elements
  const instructionsEl = document.getElementById('instructions');
  const quizEl = document.getElementById('quiz');
  const startBtn = document.getElementById('startBtn');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');

  const qProgressText = document.getElementById('qProgressText');
  const qProgressBar = document.getElementById('qProgressBar');
  const categoryBadge = document.getElementById('categoryBadge');
  const difficultyBadge = document.getElementById('difficultyBadge');
  const timerDisplay = document.getElementById('timerDisplay');

  const questionText = document.getElementById('questionText');
  const optionsEl = document.getElementById('options');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const submittingOverlay = document.getElementById('submittingOverlay');

  // LocalStorage helpers
  const LS_USER = 'aiassess_user';
  const LS_ATTEMPTS = 'aiassess_attempts';
  const LS_INPROGRESS = 'aiassess_inprogress';

  function saveUser(name,email){
    if(!name) return;
    localStorage.setItem(LS_USER, JSON.stringify({name:name,email:email}));
  }
  function getUser(){
    try{ return JSON.parse(localStorage.getItem(LS_USER) || 'null'); }catch(e){return null;}
  }

  // Initialize from saved user
  (function initUser(){
    const u = getUser();
    if(u){
      userNameInput.value = u.name || '';
      userEmailInput.value = u.email || '';
    }
  })();

  // Use first TOTAL questions
  const QUESTIONS = ALL_QUESTIONS.slice(0, TOTAL);

  // Initialize answers (try restore in-progress)
  (function restoreInProgress(){
    try{
      const raw = localStorage.getItem(LS_INPROGRESS);
      if(raw){
        const obj = JSON.parse(raw);
        if(obj && obj.answers && obj.answers.length === QUESTIONS.length){
          answers = obj.answers;
          remaining = obj.remaining || TIME_SECONDS;
          currentIndex = obj.currentIndex || 0;
          // set user name/email from inprogress if present
          if(obj.user){
            userNameInput.value = obj.user.name || '';
            userEmailInput.value = obj.user.email || '';
          }
        } else {
          answers = Array(QUESTIONS.length).fill(null);
        }
      } else {
        answers = Array(QUESTIONS.length).fill(null);
      }
    }catch(e){
      answers = Array(QUESTIONS.length).fill(null);
    }
  })();

  // UI functions
  function showInstructions(){ instructionsEl.classList.remove('hidden'); quizEl.classList.add('hidden'); }
  function showQuiz(){ instructionsEl.classList.add('hidden'); quizEl.classList.remove('hidden'); }

  function formatTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function renderQuestion(index){
    const q = QUESTIONS[index];
    if(!q) return;
    qProgressText.textContent = `Question ${index+1} of ${QUESTIONS.length}`;
    const pct = Math.round(((index)/QUESTIONS.length) * 100);
    qProgressBar.style.width = `${pct}%`;

    categoryBadge.textContent = q.category;
    difficultyBadge.textContent = q.difficulty;

    questionText.textContent = q.question;
    // render options
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.setAttribute('role','listitem');
      btn.setAttribute('data-index', i);
      btn.tabIndex = 0;
      btn.innerHTML = `
        <div class="opt-letter">${String.fromCharCode(65+i)}</div>
        <div class="opt-text">${opt}</div>
      `;
      btn.addEventListener('click', ()=>selectOption(index,i));
      // keyboard support
      btn.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); selectOption(index,i); }
      });

      // mark selected
      if(answers[index] === i) btn.classList.add('selected');
      optionsEl.appendChild(btn);
    });

    // update previous/next button labels
    prevBtn.disabled = (index === 0);
    if(index === QUESTIONS.length -1){
      nextBtn.textContent = 'Submit Assessment';
    } else {
      nextBtn.textContent = 'Next';
    }

    // Save progress snapshot
    saveInProgress();
  }

  function selectOption(qIndex, optIndex){
    answers[qIndex] = optIndex;
    // visually update options for that question
    const nodes = optionsEl.querySelectorAll('.option');
    nodes.forEach(n => n.classList.remove('selected'));
    const chosen = optionsEl.querySelector(`.option[data-index="${optIndex}"]`);
    if(chosen) chosen.classList.add('selected');

    // small info
    document.getElementById('bookmarkInfo').textContent = 'Answer saved locally';

    // auto-advance small delay to next
    setTimeout(()=>{ if(qIndex < QUESTIONS.length -1) goNext(); }, 250);

    saveInProgress();
  }

  function goNext(){
    if(currentIndex < QUESTIONS.length -1){
      currentIndex++;
      renderQuestion(currentIndex);
    } else {
      // submit
      submitAssessment();
    }
  }

  function goPrev(){
    if(currentIndex > 0){
      currentIndex--;
      renderQuestion(currentIndex);
    }
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  // Timer
  function startTimer(){
    // clear if exists
    if(timer) clearInterval(timer);
    timer = setInterval(()=>{
      remaining--;
      updateTimerUI();
      if(remaining <= 0){
        clearInterval(timer);
        autoSubmit();
      }
      saveInProgress();
    },1000);
  }

  function updateTimerUI(){
    timerDisplay.textContent = formatTime(remaining);
    // progress color shift (nice touch)
    const pct = Math.round((remaining/TIME_SECONDS)*100);
    if(pct > 50){
      timerDisplay.style.color = '#064e3b';
    } else if(pct > 20){
      timerDisplay.style.color = '#92400e';
    } else {
      timerDisplay.style.color = '#b91c1c';
    }
  }

  function autoSubmit(){
    showOverlay(true, 'Time is up — submitting your assessment');
    setTimeout(()=> submitAssessment(), 800);
  }

  // Save in-progress
  function saveInProgress(){
    const user = {name: userNameInput.value.trim(), email: userEmailInput.value.trim()};
    const payload = {
      user,
      answers,
      remaining,
      currentIndex,
      startedAt
    };
    localStorage.setItem(LS_INPROGRESS, JSON.stringify(payload));
  }

  // Clear in-progress
  function clearInProgress(){
    localStorage.removeItem(LS_INPROGRESS);
  }

  // Submission & scoring
  function submitAssessment(){
    // prevent double submit
    showOverlay(true,'Submitting...');
    // finalize time & stop timer
    if(timer) clearInterval(timer);
    const finishedAt = Date.now();
    const duration = startedAt ? Math.max(0, Math.floor((finishedAt - startedAt)/1000)) : (TIME_SECONDS - remaining);
    // compute stats
    const total = QUESTIONS.length;
    let correct = 0, wrong = 0, skipped = 0;
    const categoryMap = {};
    QUESTIONS.forEach((q, idx)=>{
      const chosen = answers[idx];
      if(!(q.category in categoryMap)) categoryMap[q.category] = {total:0,correct:0};
      categoryMap[q.category].total++;
      if(chosen === null || chosen === undefined){
        skipped++;
      } else if(chosen === q.correctAnswer){
        correct++;
        categoryMap[q.category].correct++;
      } else {
        wrong++;
      }
    });
    const percentage = Math.round((correct/total)*100);
    // build category scores
    const categories = Object.keys(categoryMap).map(cat=>{
      const c = categoryMap[cat];
      return {category:cat,score: Math.round((c.correct/c.total)*100),correct:c.correct,total:c.total};
    });

    // attempt object
    const attempt = {
      id: 'attempt_' + Date.now(),
      user: {name: userNameInput.value.trim(), email: userEmailInput.value.trim()},
      meta: {total, durationSeconds: duration, timestamp: Date.now()},
      answers: answers.slice(),
      correct, wrong, skipped, percentage,
      categories
    };

    // save to attempts list
    const raw = localStorage.getItem(LS_ATTEMPTS);
    let arr = [];
    try{ arr = raw ? JSON.parse(raw) : []; }catch(e){ arr = [];}
    arr.push(attempt);
    localStorage.setItem(LS_ATTEMPTS, JSON.stringify(arr));
    // save user
    saveUser(attempt.user.name, attempt.user.email);
    // cleanup inprogress
    clearInProgress();

    // navigate to results (use query param id)
    window.location.href = `result.html?attempt=${encodeURIComponent(attempt.id)}`;
  }

  function showOverlay(show, message=''){
    if(show){
      submittingOverlay.classList.remove('hidden');
      if(message) submittingOverlay.querySelector('h3').textContent = message;
    } else {
      submittingOverlay.classList.add('hidden');
    }
  }

  // Start assessment from instructions
  startBtn.addEventListener('click', ()=>{
    const uname = userNameInput.value.trim();
    const uemail = userEmailInput.value.trim();
    if(!uname || !uemail){
      alert('Please enter your name and email to continue.');
      userNameInput.focus();
      return;
    }
    // show quiz
    showQuiz();
    // init timer and state
    if(!startedAt) startedAt = Date.now();
    startTimer();
    renderQuestion(currentIndex);
  });

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(quizEl.classList.contains('hidden')) return;
    if(e.key === 'ArrowRight') goNext();
    if(e.key === 'ArrowLeft') goPrev();
  });

  // expose retake/restore options via window for debugging if needed
  window.aiAssess = {
    QUESTIONS,
    getState: ()=>({currentIndex,answers,remaining}),
    submitAssessment
  };

  // initial render of instructions
  showInstructions();

})();