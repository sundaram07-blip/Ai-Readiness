// assessment.js
// Enhanced: question animations, aggressive autosave, optional server upload
(function () {
  // QUESTIONS is defined in questions.js; fallback to window.QUESTIONS
  const ALL_QUESTIONS = (typeof QUESTIONS !== 'undefined') ? QUESTIONS : window.QUESTIONS || [];

  // CONFIG
  const TOTAL = Math.min(ALL_QUESTIONS.length, 30);
  const TIME_SECONDS = 20 * 60;
  // Server URL (Google Apps Script web app) - set to provided URL
  const SERVER_URL = 'https://script.google.com/macros/s/AKfycbwiF_pVKSn2emElUhlWs6QBlYR7DYJFCQp9Ugzs9Q6oUyAGzi2YCr1-TQDh1REPbf2s/exec';

  // STATE
  let currentIndex = 0;
  let answers = [];
  let timer = null;
  let remaining = TIME_SECONDS;
  let startedAt = null;

  // Autosave snapshot history
  const SNAPSHOT_KEY = 'aiassess_snapshots';
  const INPROGRESS_KEY = 'aiassess_inprogress';
  const ATTEMPTS_KEY = 'aiassess_attempts';
  let snapshotInterval = null;

  // DOM
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

  const questionCard = document.getElementById('questionCard');
  const questionText = document.getElementById('questionText');
  const optionsEl = document.getElementById('options');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const autosaveStatus = document.getElementById('autosaveStatus');
  const submittingOverlay = document.getElementById('submittingOverlay');

  // Init user from localStorage
  const USER_KEY = 'aiassess_user';
  (function loadUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u.name) userNameInput.value = u.name;
        if (u.email) userEmailInput.value = u.email;
      }
    } catch (e) { /* ignore */ }
  })();

  // QUESTIONS used in assessment
  const QUESTIONS = ALL_QUESTIONS.slice(0, TOTAL);

  // restore in-progress if present
  (function restore() {
    try {
      const raw = localStorage.getItem(INPROGRESS_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && Array.isArray(obj.answers) && obj.answers.length === QUESTIONS.length) {
          answers = obj.answers;
          remaining = obj.remaining || TIME_SECONDS;
          currentIndex = obj.currentIndex || 0;
          startedAt = obj.startedAt || null;
          if (obj.user) {
            userNameInput.value = obj.user.name || '';
            userEmailInput.value = obj.user.email || '';
          }
        } else {
          answers = Array(QUESTIONS.length).fill(null);
        }
      } else {
        answers = Array(QUESTIONS.length).fill(null);
      }
    } catch (e) {
      answers = Array(QUESTIONS.length).fill(null);
    }
  })();

  // UI helpers
  function showInstructions() {
    instructionsEl.classList.remove('hidden');
    quizEl.classList.add('hidden');
  }
  function showQuiz() {
    instructionsEl.classList.add('hidden');
    quizEl.classList.remove('hidden');
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Fade helper: animate question transition
  function fadeToQuestion(renderFn) {
    const el = questionCard;
    let current = el.querySelector('.fade-item');
    if (!current) {
      const wrapper = document.createElement('div');
      wrapper.className = 'fade-item';
      while (el.firstChild) wrapper.appendChild(el.firstChild);
      el.appendChild(wrapper);
      current = wrapper;
    }

    const incoming = current.cloneNode(false);
    incoming.classList.add('fade-out');
    el.appendChild(incoming);
    renderFn(incoming);

    requestAnimationFrame(() => {
      current.classList.add('fade-out');
      incoming.classList.remove('fade-out');
      incoming.classList.add('fade-in');
      setTimeout(() => {
        if (current && current.parentNode) current.parentNode.removeChild(current);
      }, 350);
    });
  }

  function populateQuestionInto(wrapper, index) {
    const q = QUESTIONS[index];
    wrapper.innerHTML = '';
    const qTitle = document.createElement('h2');
    qTitle.id = 'questionText';
    qTitle.className = 'question-text';
    qTitle.textContent = q.question;
    wrapper.appendChild(qTitle);

    const opts = document.createElement('div');
    opts.id = 'options';
    opts.className = 'options-grid';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.setAttribute('data-index', i);
      btn.innerHTML = `<div class="opt-letter">${String.fromCharCode(65 + i)}</div>
        <div class="opt-text">${opt}</div>`;
      btn.addEventListener('click', () => selectOption(index, i));
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectOption(index, i);
        }
      });
      if (answers[index] === i) btn.classList.add('selected');
      opts.appendChild(btn);
    });
    wrapper.appendChild(opts);
  }

  function renderQuestion(index) {
    const q = QUESTIONS[index];
    if (!q) return;
    qProgressText.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
    const pct = Math.round(((index) / QUESTIONS.length) * 100);
    qProgressBar.style.width = `${pct}%`;

    categoryBadge.textContent = q.category;
    difficultyBadge.textContent = q.difficulty;

    fadeToQuestion((incomingWrapper) => populateQuestionInto(incomingWrapper, index));

    prevBtn.disabled = (index === 0);
    nextBtn.textContent = (index === QUESTIONS.length - 1) ? 'Submit Assessment' : 'Next';

    saveInProgress();
  }

  function selectOption(qIndex, optIndex) {
    answers[qIndex] = optIndex;
    const optsContainer = questionCard.querySelector('.options-grid');
    if (optsContainer) {
      const nodes = optsContainer.querySelectorAll('.option');
      nodes.forEach(n => n.classList.remove('selected'));
      const chosen = optsContainer.querySelector(`.option[data-index="${optIndex}"]`);
      if (chosen) chosen.classList.add('selected');
    }

    const info = document.getElementById('bookmarkInfo');
    if (info) info.textContent = 'Answer saved locally';

    saveInProgress(true);

    if (qIndex < QUESTIONS.length - 1) {
      setTimeout(() => goNext(), 240);
    }
  }

  function goNext() {
    if (currentIndex < QUESTIONS.length - 1) {
      currentIndex++;
      renderQuestion(currentIndex);
    } else {
      submitAssessment();
    }
  }
  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion(currentIndex);
    }
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  // Timer
  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      remaining--;
      updateTimerUI();
      if (remaining <= 0) {
        clearInterval(timer);
        autoSubmit();
      }
      saveInProgress(false);
    }, 1000);
  }
  function updateTimerUI() {
    timerDisplay.textContent = formatTime(remaining);
    const pct = Math.round((remaining / TIME_SECONDS) * 100);
    if (pct > 50) timerDisplay.style.color = '#064e3b';
    else if (pct > 20) timerDisplay.style.color = '#92400e';
    else timerDisplay.style.color = '#b91c1c';
  }
  function autoSubmit() {
    showOverlay(true, 'Time is up — submitting your assessment');
    setTimeout(() => submitAssessment(), 800);
  }

  // SAVE: aggressive autosave & snapshot
  function saveInProgress(pulse = false) {
    const user = { name: userNameInput.value.trim(), email: userEmailInput.value.trim() };
    const payload = {
      user,
      answers,
      remaining,
      currentIndex,
      startedAt: startedAt || Date.now()
    };
    localStorage.setItem(INPROGRESS_KEY, JSON.stringify(payload));

    if (pulse) {
      indicateAutosave('Saving…', true);
    } else {
      indicateAutosave('Autosave: Idle', false);
    }

    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ ts: Date.now(), state: payload });
      while (arr.length > 10) arr.shift();
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(arr));
    } catch (e) { /* ignore */ }
  }

  function indicateAutosave(text, saving) {
    if (!autosaveStatus) return;
    autosaveStatus.textContent = saving ? 'Autosave: Saving…' : text;
    autosaveStatus.classList.toggle('autosave-pulse', true);
    autosaveStatus.classList.toggle('saving', saving);
    if (saving) {
      setTimeout(() => {
        autosaveStatus.textContent = 'Autosave: Done';
        autosaveStatus.classList.remove('saving');
        setTimeout(() => { autosaveStatus.textContent = 'Autosave: Idle'; }, 1200);
      }, 600);
    }
  }

  function startSnapshotInterval() {
    if (snapshotInterval) clearInterval(snapshotInterval);
    snapshotInterval = setInterval(() => {
      saveInProgress(false);
    }, 5000);
  }
  function stopSnapshotInterval() {
    if (snapshotInterval) clearInterval(snapshotInterval);
    snapshotInterval = null;
  }

  function clearInProgress() {
    localStorage.removeItem(INPROGRESS_KEY);
  }

  // SUBMIT: compute score, save attempt, optionally send to server
  async function submitAssessment() {
    showOverlay(true, 'Submitting...');
    if (timer) clearInterval(timer);
    stopSnapshotInterval();

    const finishedAt = Date.now();
    const duration = startedAt ? Math.max(0, Math.floor((finishedAt - startedAt) / 1000)) : (TIME_SECONDS - remaining);
    const total = QUESTIONS.length;
    let correct = 0, wrong = 0, skipped = 0;
    const categoryMap = {};
    QUESTIONS.forEach((q, idx) => {
      const chosen = answers[idx];
      categoryMap[q.category] = categoryMap[q.category] || { total: 0, correct: 0 };
      categoryMap[q.category].total++;
      if (chosen === null || chosen === undefined) skipped++;
      else if (chosen === q.correctAnswer) { correct++; categoryMap[q.category].correct++; }
      else wrong++;
    });
    const percentage = Math.round((correct / total) * 100);
    const categories = Object.keys(categoryMap).map(cat => {
      const c = categoryMap[cat];
      return { category: cat, score: Math.round((c.correct / c.total) * 100), correct: c.correct, total: c.total };
    });

    const attempt = {
      id: 'attempt_' + Date.now(),
      user: { name: userNameInput.value.trim(), email: userEmailInput.value.trim() },
      meta: { total, durationSeconds: duration, timestamp: Date.now() },
      answers: answers.slice(),
      correct, wrong, skipped, percentage,
      categories
    };

    // push to local attempts list
    try {
      const raw = localStorage.getItem(ATTEMPTS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(attempt);
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('Failed to save attempt locally', e);
    }

    try { localStorage.setItem(USER_KEY, JSON.stringify(attempt.user)); } catch (e) { /* ignore */ }

    clearInProgress();

    if (SERVER_URL && SERVER_URL.length > 0) {
      try {
        await sendAttemptToServerWithTimeout(attempt, 6000);
      } catch (err) {
        console.warn('Server save failed or timed out', err);
      }
    }

    window.location.href = `result.html?attempt=${encodeURIComponent(attempt.id)}`;
  }

  async function sendAttemptToServerWithTimeout(attempt, timeoutMs = 6000) {
    const controller = new AbortController();
    const signal = controller.signal;
    const timerId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt),
        signal
      });
      clearTimeout(timerId);
      if (!resp.ok) throw new Error('Server returned ' + resp.status);
      const data = await resp.json().catch(() => null);
      return data;
    } finally {
      clearTimeout(timerId);
    }
  }

  function showOverlay(show, message = '') {
    if (!submittingOverlay) return;
    if (show) {
      submittingOverlay.classList.remove('hidden');
      if (message) submittingOverlay.querySelector('h3').textContent = message;
    } else submittingOverlay.classList.add('hidden');
  }

  // Start button
  startBtn.addEventListener('click', () => {
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    if (!name || !email) {
      alert('Please enter your name and email to continue.');
      userNameInput.focus();
      return;
    }
    startedAt = startedAt || Date.now();
    showQuiz();
    renderQuestion(currentIndex);
    startTimer();
    startSnapshotInterval();
  });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (quizEl.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // expose for debugging
  window.aiAssess = {
    QUESTIONS,
    getState: () => ({ currentIndex, answers, remaining }),
    submitAssessment
  };

  // initial render
  showInstructions();
})();
