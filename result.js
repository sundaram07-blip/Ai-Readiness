/**
 * AI Readiness Assessment - Results Page Logic
 * Displays results, charts, and personalized roadmap
 */

let chartInstances = {};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const latestResult = localStorage.getItem('latestResult');
    
    if (!latestResult) {
        alert('No assessment results found. Please take the assessment first.');
        window.location.href = 'assessment.html';
        return;
    }

    const results = JSON.parse(latestResult);
    displayResults(results);
    generateCharts(results);
    displayStrengthsAndImprovements(results);
    displayRoadmap(results);
});

// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(results) {
    // Display score
    document.getElementById('scoreValue').textContent = results.percentage;
    
    // Display readiness level and description
    const readinessLevel = results.readinessLevel;
    const descriptions = {
        'Novice': 'You are just beginning your AI journey. Focus on understanding AI fundamentals before moving to advanced topics.',
        'Beginner': 'You have a basic understanding of AI concepts. Continue learning to deepen your knowledge.',
        'Intermediate': 'You have solid AI knowledge across multiple domains. Keep building expertise in specialized areas.',
        'Advanced': 'You demonstrate strong AI knowledge and understanding. Consider taking on leadership roles in AI initiatives.',
        'Expert': 'Excellent! You have comprehensive AI knowledge. You could mentor others or lead advanced AI projects.'
    };
    
    document.getElementById('readinessLevel').textContent = readinessLevel;
    document.getElementById('readinessDesc').textContent = descriptions[readinessLevel] || descriptions['Beginner'];
    
    // Display answer stats
    document.getElementById('correctCount').textContent = results.correct;
    document.getElementById('correctPercent').textContent = 
        Math.round((results.correct / results.totalQuestions) * 100) + '%';
    
    document.getElementById('wrongCount').textContent = results.wrong;
    document.getElementById('wrongPercent').textContent = 
        Math.round((results.wrong / results.totalQuestions) * 100) + '%';
    
    document.getElementById('skippedCount').textContent = results.skipped;
    document.getElementById('skippedPercent').textContent = 
        Math.round((results.skipped / results.totalQuestions) * 100) + '%';
    
    // Display time spent
    const minutes = Math.floor(results.timeSpent / 60);
    const seconds = results.timeSpent % 60;
    document.getElementById('timeSpent').textContent = 
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Display category scores
    displayCategoryScores(results.categoryScores);
}

function displayCategoryScores(categoryScores) {
    const container = document.querySelector('.category-scores');
    container.innerHTML = '';
    
    Object.entries(categoryScores).forEach(([category, score]) => {
        const item = document.createElement('div');
        item.className = 'category-score-item';
        item.innerHTML = `
            <div class="category-score-label">${category}</div>
            <div class="category-score-bar">
                <div class="category-score-fill" style="width: 0%"></div>
            </div>
            <div class="category-score-percent">${score.percentage}%</div>
        `;
        container.appendChild(item);
        
        // Animate progress bar
        setTimeout(() => {
            item.querySelector('.category-score-fill').style.width = score.percentage + '%';
        }, 100);
    });
}

// ============================================================
// GENERATE CHARTS
// ============================================================

function generateCharts(results) {
    generateRadarChart(results);
    generateBarChart(results);
    generatePieChart(results);
}

function generateRadarChart(results) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    const labels = Object.keys(results.categoryScores);
    const data = labels.map(cat => results.categoryScores[cat].percentage);
    
    chartInstances.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance (%)',
                data: data,
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

function generateBarChart(results) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    const labels = Object.keys(results.difficultyScores);
    const correct = labels.map(diff => results.difficultyScores[diff].correct);
    const wrong = labels.map(diff => results.difficultyScores[diff].wrong);
    
    chartInstances.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Correct',
                    data: correct,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10B981',
                    borderWidth: 1,
                    borderRadius: 8
                },
                {
                    label: 'Wrong',
                    data: wrong,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: '#EF4444',
                    borderWidth: 1,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

function generatePieChart(results) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    chartInstances.pie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Wrong', 'Skipped'],
            datasets: [{
                data: [results.correct, results.wrong, results.skipped],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    '#10B981',
                    '#EF4444',
                    '#F59E0B'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 12 },
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// ============================================================
// DISPLAY STRENGTHS & IMPROVEMENTS
// ============================================================

function displayStrengthsAndImprovements(results) {
    displayStrengths(results);
    displayImprovements(results);
}

function displayStrengths(results) {
    const container = document.getElementById('strengthsList');
    container.innerHTML = '';
    
    if (results.strengths.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keep practicing to identify strengths!</p>';
        return;
    }
    
    results.strengths.forEach((strength, index) => {
        const score = results.categoryScores[strength];
        const item = document.createElement('div');
        item.className = 'strength-item';
        item.innerHTML = `
            <span class="item-name">✓ ${strength}</span>
            <span class="item-score">${score.percentage}% • ${score.correct}/${score.total} correct</span>
        `;
        container.appendChild(item);
    });
}

function displayImprovements(results) {
    const container = document.getElementById('improvementsList');
    container.innerHTML = '';
    
    if (results.improvements.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Excellent! No major areas to improve.</p>';
        return;
    }
    
    results.improvements.forEach((improvement, index) => {
        const score = results.categoryScores[improvement];
        const item = document.createElement('div');
        item.className = 'improvement-item';
        item.innerHTML = `
            <span class="item-name">→ ${improvement}</span>
            <span class="item-score">${score.percentage}% • ${score.correct}/${score.total} correct</span>
        `;
        container.appendChild(item);
    });
}

// ============================================================
// PERSONALIZED ROADMAP
// ============================================================

function displayRoadmap(results) {
    const roadmapData = [
        {
            week: 1,
            title: 'AI Fundamentals',
            hours: '4-6',
            difficulty: 'Beginner',
            goal: 'Understand basic AI concepts'
        },
        {
            week: 2,
            title: 'Prompt Engineering',
            hours: '4-6',
            difficulty: 'Intermediate',
            goal: 'Master effective prompting techniques'
        },
        {
            week: 3,
            title: 'Generative AI',
            hours: '4-6',
            difficulty: 'Intermediate',
            goal: 'Learn about LLMs and generative models'
        },
        {
            week: 4,
            title: 'Machine Learning',
            hours: '6-8',
            difficulty: 'Advanced',
            goal: 'Deep dive into ML algorithms'
        },
        {
            week: 5,
            title: 'Responsible AI',
            hours: '4-6',
            difficulty: 'Advanced',
            goal: 'Understand ethics and bias in AI'
        },
        {
            week: 6,
            title: 'Advanced Applications',
            hours: '6-8',
            difficulty: 'Expert',
            goal: 'Apply AI to real-world problems'
        }
    ];
    
    const container = document.getElementById('roadmapTimeline');
    container.innerHTML = '';
    
    roadmapData.forEach(item => {
        const weekCard = document.createElement('div');
        weekCard.className = 'roadmap-week';
        weekCard.innerHTML = `
            <span class="week-badge">Week ${item.week}</span>
            <h3 class="week-title">${item.title}</h3>
            <div class="week-details">
                <div class="detail-item">
                    <span class="detail-icon">🕐</span>
                    <span>${item.hours} hours</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📊</span>
                    <span>${item.difficulty}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🎯</span>
                    <span>${item.goal}</span>
                </div>
            </div>
        `;
        container.appendChild(weekCard);
    });
}

// ============================================================
// ACTION FUNCTIONS
// ============================================================

function retakeAssessment() {
    // Clear current assessment
    localStorage.removeItem('assessmentProgress');
    
    // Redirect to assessment
    window.location.href = 'assessment.html';
}

function downloadReport() {
    const latestResult = JSON.parse(localStorage.getItem('latestResult'));
    const userName = localStorage.getItem('userName');
    
    const content = `
AI READINESS ASSESSMENT REPORT
==============================

Name: ${userName}
Assessment Date: ${new Date(latestResult.timestamp).toLocaleDateString()}

OVERALL SCORE
=============
Score: ${latestResult.percentage}%
Readiness Level: ${latestResult.readinessLevel}
Time Spent: ${Math.floor(latestResult.timeSpent / 60)} minutes

PERFORMANCE BREAKDOWN
====================
Correct: ${latestResult.correct}/${latestResult.totalQuestions}
Wrong: ${latestResult.wrong}/${latestResult.totalQuestions}
Skipped: ${latestResult.skipped}/${latestResult.totalQuestions}

CATEGORY SCORES
===============
${Object.entries(latestResult.categoryScores)
    .map(([cat, score]) => `${cat}: ${score.percentage}% (${score.correct}/${score.total})`)
    .join('\n')}

STRENGTHS
=========
${latestResult.strengths.map(s => `• ${s}`).join('\n')}

AREAS TO IMPROVE
================
${latestResult.improvements.map(i => `• ${i}`).join('\n')}

Generated by AIAssess - AI Readiness Assessment Platform
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Readiness_Assessment_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
