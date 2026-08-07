/**
 * AI Readiness Assessment - Quiz Logic
 * Handles assessment flow, timer, scoring, and navigation
 */

// ============================================================
// STATE MANAGEMENT
// ============================================================

const assessmentState = {
    currentQuestion: 0,
    answers: [],
    startTime: null,
    endTime: null,
    timerInterval: null,
    timeRemaining: 20 * 60, // 20 minutes in seconds
    submitted: false,
    categoryStats: {
        'Prompt Engineering': 0,
        'AI Fundamentals': 0,
        'Machine Learning': 0,
        'Responsible AI': 0,
        'Generative AI': 0,
        'Critical Thinking': 0
    }
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName') || 'Guest';
    document.getElementById('headerUserName').textContent = userName;
    
    // Initialize answers array
    assessmentState.answers = new Array(ASSESSMENT_QUESTIONS.length).fill(null);
    
    // Load saved progress if exists
    loadProgress();
});

// ============================================================
// INSTRUCTIONS PAGE
// ============================================================

function startAssessment() {
    // Validate user data
    const userName = localStorage.getItem('userName');
    if (!userName) {
        alert('Please go back and provide your information');
        window.location.href = 'index.html';
        return;
    }

    // Hide instructions, show quiz
    document.getElementById('instructionsPage').classList.remove('active');
    document.getElementById('quizPage').classList.add('active');

    // Initialize quiz
    initializeQuiz();
}

// ============================================================
// QUIZ INITIALIZATION
// ============================================================

function initializeQuiz() {
    assessmentState.startTime = Date.now();
    assessmentState.timeRemaining = 20 * 60;

    // Render first question
    renderQuestion();

    // Initialize category breakdown
    initializeCategoryList();

    // Start timer
    startTimer();

    // Calculate difficulty breakdown
    calculateDifficultyBreakdown();
}

function initializeCategoryList() {
    const categories = [...new Set(ASSESSMENT_QUESTIONS.map(q => q.category))];
    const categoryList = document.getElementById('categoryList');
    
    categoryList.innerHTML = categories.map(cat => {
        const count = ASSESSMENT_QUESTIONS.filter(q => q.category === cat).length;
        return `<div class="category-item" data-category="${cat}">${cat} (${count})</div>`;
    }).join('');

    updateActiveCategory();
}

function calculateDifficultyBreakdown() {
    const easyCount = ASSESSMENT_QUESTIONS.filter(q => q.difficulty === 'Easy').length;
    const mediumCount = ASSESSMENT_QUESTIONS.filter(q => q.difficulty === 'Medium').length;
    const hardCount = ASSESSMENT_QUESTIONS.filter(q => q.difficulty === 'Hard').length;

    document.getElementById('easyCount').textContent = easyCount;
    document.getElementById('mediumCount').textContent = mediumCount;
    document.getElementById('hardCount').textContent = hardCount;
}

// ============================================================
// QUESTION RENDERING
// ============================================================

function renderQuestion() {
    const question = ASSESSMENT_QUESTIONS[assessmentState.currentQuestion];
    
    // Update header info
    document.getElementById('questionNumber').textContent = 
        `Question ${assessmentState.currentQuestion + 1} of ${ASSESSMENT_QUESTIONS.length}`;
    
    document.getElementById('categoryBadge').textContent = question.category;
    
    const diffBadge = document.getElementById('difficultyBadge');
    diffBadge.textContent = question.difficulty;
    diffBadge.className = `badge badge-difficulty ${question.difficulty.toLowerCase()}`;
    
    // Update progress bar
    const progress = ((assessmentState.currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    document.getElementById('questionProgressBar').style.width = progress + '%';
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Update question counter
    document.getElementById('questionCounter').textContent = 
        `${assessmentState.currentQuestion + 1}/30`;
    
    // Update progress stats
    const answered = assessmentState.answers.filter(a => a !== null).length;
    document.getElementById('answeredCount').textContent = answered;
    document.getElementById('remainingCount').textContent = 30 - answered;
    
    // Render question text
    document.getElementById('questionText').textContent = question.question;
    
    // Render options
    renderOptions(question);
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update active category
    updateActiveCategory();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function renderOptions(question) {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.innerHTML = `<span class="option-text">${option}</span>`;
        
        // Check if this option was previously selected
        if (assessmentState.answers[assessmentState.currentQuestion] === index) {
            optionCard.classList.add('selected');
        }
        
        optionCard.addEventListener('click', () => selectAnswer(index));
        container.appendChild(optionCard);
    });
}

function selectAnswer(optionIndex) {
    // Update state
    assessmentState.answers[assessmentState.currentQuestion] = optionIndex;
    
    // Save to localStorage
    saveProgress();
    
    // Re-render to show selection
    renderQuestion();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Show/hide previous button
    if (assessmentState.currentQuestion === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // Change last button to submit
    if (assessmentState.currentQuestion === ASSESSMENT_QUESTIONS.length - 1) {
        nextBtn.textContent = 'Submit Assessment';
        nextBtn.onclick = submitAssessment;
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.onclick = nextQuestion;
    }
}

function updateActiveCategory() {
    const question = ASSESSMENT_QUESTIONS[assessmentState.currentQuestion];
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === question.category) {
            item.classList.add('active');
        }
    });
}

// ============================================================
// NAVIGATION
// ============================================================

function nextQuestion() {
    if (assessmentState.currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        assessmentState.currentQuestion++;
        renderQuestion();
    }
}

function previousQuestion() {
    if (assessmentState.currentQuestion > 0) {
        assessmentState.currentQuestion--;
        renderQuestion();
    }
}

// ============================================================
// TIMER
// ============================================================

function startTimer() {
    assessmentState.timerInterval = setInterval(() => {
        assessmentState.timeRemaining--;
        updateTimerDisplay();
        
        if (assessmentState.timeRemaining <= 0) {
            clearInterval(assessmentState.timerInterval);
            submitAssessment();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(assessmentState.timeRemaining / 60);
    const seconds = assessmentState.timeRemaining % 60;
    const display = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    document.getElementById('timerDisplay').textContent = display;
    
    const timerElement = document.querySelector('.timer');
    if (assessmentState.timeRemaining <= 120) { // 2 minutes or less
        timerElement.classList.add('low-time');
    } else {
        timerElement.classList.remove('low-time');
    }
}

// ============================================================
// ASSESSMENT SUBMISSION
// ============================================================

function submitAssessment() {
    // Check if all questions are answered
    const unanswered = assessmentState.answers.filter(a => a === null).length;
    if (unanswered > 0) {
        const proceed = confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`);
        if (!proceed) return;
    }
    
    // Stop timer
    clearInterval(assessmentState.timerInterval);
    
    // Show modal
    document.getElementById('successModal').classList.add('active');
    
    // Calculate results
    const results = calculateResults();
    
    // Save results to localStorage
    saveResults(results);
    
    // Redirect after 3 seconds
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 3000);
}

// ============================================================
// SCORING & CALCULATION
// ============================================================

function calculateResults() {
    const results = {
        timestamp: new Date().toISOString(),
        totalQuestions: ASSESSMENT_QUESTIONS.length,
        timeStarted: assessmentState.startTime,
        timeEnded: Date.now(),
        timeSpent: Math.floor((Date.now() - assessmentState.startTime) / 1000),
        answers: assessmentState.answers,
        categoryScores: {},
        difficultyScores: {},
        correct: 0,
        wrong: 0,
        skipped: 0
    };
    
    // Calculate overall scores
    ASSESSMENT_QUESTIONS.forEach((question, index) => {
        const userAnswer = assessmentState.answers[index];
        
        if (userAnswer === null) {
            results.skipped++;
        } else if (userAnswer === question.correctAnswer) {
            results.correct++;
        } else {
            results.wrong++;
        }
        
        // Category scores
        if (!results.categoryScores[question.category]) {
            results.categoryScores[question.category] = {
                total: 0,
                correct: 0,
                percentage: 0
            };
        }
        
        results.categoryScores[question.category].total++;
        if (userAnswer === question.correctAnswer) {
            results.categoryScores[question.category].correct++;
        }
        
        // Difficulty scores
        if (!results.difficultyScores[question.difficulty]) {
            results.difficultyScores[question.difficulty] = {
                total: 0,
                correct: 0,
                percentage: 0
            };
        }
        
        results.difficultyScores[question.difficulty].total++;
        if (userAnswer === question.correctAnswer) {
            results.difficultyScores[question.difficulty].correct++;
        }
    });
    
    // Calculate percentages
    results.percentage = Math.round((results.correct / results.totalQuestions) * 100);
    
    Object.keys(results.categoryScores).forEach(category => {
        const score = results.categoryScores[category];
        score.percentage = Math.round((score.correct / score.total) * 100);
    });
    
    Object.keys(results.difficultyScores).forEach(difficulty => {
        const score = results.difficultyScores[difficulty];
        score.percentage = Math.round((score.correct / score.total) * 100);
    });
    
    // Determine readiness level
    results.readinessLevel = getReadinessLevel(results.percentage);
    
    // Identify strengths and areas to improve
    results.strengths = Object.keys(results.categoryScores)
        .filter(cat => results.categoryScores[cat].percentage >= 75)
        .sort((a, b) => results.categoryScores[b].percentage - results.categoryScores[a].percentage);
    
    results.improvements = Object.keys(results.categoryScores)
        .filter(cat => results.categoryScores[cat].percentage < 75)
        .sort((a, b) => results.categoryScores[a].percentage - results.categoryScores[b].percentage);
    
    return results;
}

function getReadinessLevel(percentage) {
    if (percentage >= 90) return 'Expert';
    if (percentage >= 80) return 'Advanced';
    if (percentage >= 70) return 'Intermediate';
    if (percentage >= 60) return 'Beginner';
    return 'Novice';
}

// ============================================================
// LOCAL STORAGE
// ============================================================

function saveProgress() {
    const progress = {
        currentQuestion: assessmentState.currentQuestion,
        answers: assessmentState.answers,
        startTime: assessmentState.startTime,
        timeRemaining: assessmentState.timeRemaining
    };
    localStorage.setItem('assessmentProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('assessmentProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        assessmentState.currentQuestion = progress.currentQuestion || 0;
        assessmentState.answers = progress.answers || new Array(ASSESSMENT_QUESTIONS.length).fill(null);
        assessmentState.startTime = progress.startTime || Date.now();
        assessmentState.timeRemaining = progress.timeRemaining || 20 * 60;
    }
}

function saveResults(results) {
    // Save latest result
    localStorage.setItem('latestResult', JSON.stringify(results));
    
    // Add to history
    let history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    history.push(results);
    
    // Keep only last 10 assessments
    if (history.length > 10) {
        history = history.slice(-10);
    }
    
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    // Update attempt count
    const attemptCount = history.length;
    localStorage.setItem('attemptCount', attemptCount.toString());
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
}
