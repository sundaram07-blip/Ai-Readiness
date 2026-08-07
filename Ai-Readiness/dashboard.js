/**
 * AI Readiness Assessment - Dashboard Logic
 * Displays user analytics, progress, and achievement tracking
 */

let chartInstances = {};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const userName = localStorage.getItem('userName') || 'User';
    document.getElementById('userName').textContent = `Welcome, ${userName}!`;

    // Load and display data
    loadDashboardData();
});

// ============================================================
// LOAD DASHBOARD DATA
// ============================================================

function loadDashboardData() {
    const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    
    if (history.length === 0) {
        // No assessments yet
        document.getElementById('overallScore').textContent = '--';
        document.getElementById('bestScore').textContent = '--';
        document.getElementById('averageScore').textContent = '--';
        return;
    }

    // Display quick stats
    displayQuickStats(history);
    
    // Generate charts
    generateDashboardCharts(history);
    
    // Display achievements
    displayAchievements(history);
    
    // Display recent assessments
    displayRecentAssessments(history);
    
    // Display performance by difficulty
    displayDifficultyPerformance(history);
}

// ============================================================
// QUICK STATS
// ============================================================

function displayQuickStats(history) {
    const latestResult = history[history.length - 1];
    
    // Overall Score (latest)
    document.getElementById('overallScore').textContent = latestResult.percentage + '%';
    
    // Best Score
    const bestScore = Math.max(...history.map(r => r.percentage));
    document.getElementById('bestScore').textContent = bestScore + '%';
    
    // Average Score
    const averageScore = Math.round(
        history.reduce((sum, r) => sum + r.percentage, 0) / history.length
    );
    document.getElementById('averageScore').textContent = averageScore + '%';
    
    // Attempt Count
    document.getElementById('attemptCount').textContent = history.length;
}

// ============================================================
// GENERATE CHARTS
// ============================================================

function generateDashboardCharts(history) {
    generateProgressChart(history);
    generateCategoryChart(history);
    generateSkillsChart(history);
}

function generateProgressChart(history) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    const labels = history.map((result, idx) => `Attempt ${idx + 1}`);
    const scores = history.map(result => result.percentage);
    
    chartInstances.progress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (%)',
                data: scores,
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
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
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

function generateCategoryChart(history) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Get all categories
    const categories = ['Prompt Engineering', 'AI Fundamentals', 'Machine Learning', 
                       'Responsible AI', 'Generative AI', 'Critical Thinking'];
    
    // Calculate average percentage for each category across all attempts
    const averageScores = categories.map(cat => {
        const scores = history.map(result => result.categoryScores[cat]?.percentage || 0);
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });
    
    chartInstances.category = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Average Performance (%)',
                data: averageScores,
                backgroundColor: [
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
    
    // Display performance list
    const performanceList = document.getElementById('performanceList');
    performanceList.innerHTML = categories.map((cat, idx) => `
        <div class="performance-item">
            <div class="performance-item-label">${cat}</div>
            <div class="performance-item-value">${averageScores[idx]}%</div>
        </div>
    `).join('');
}

function generateSkillsChart(history) {
    const ctx = document.getElementById('skillsChart').getContext('2d');
    
    const latestResult = history[history.length - 1];
    const categories = Object.keys(latestResult.categoryScores);
    const scores = categories.map(cat => latestResult.categoryScores[cat].percentage);
    
    chartInstances.skills = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Current Skills',
                data: scores,
                borderColor: '#14B8A6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#14B8A6',
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
                        stepSize: 25,
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

function displayAchievements(history) {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    
    const achievements = getAchievements(history);
    
    if (achievements.length === 0) {
        container.innerHTML = '<p style="text-align: center; font-size: 13px; color: var(--text-secondary);">Complete more assessments to unlock achievements!</p>';
        return;
    }
    
    achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <div class="badge-icon">${achievement.icon}</div>
            <div>${achievement.name}</div>
        `;
        container.appendChild(badge);
    });
}

function getAchievements(history) {
    const achievements = [];
    
    // First Assessment
    if (history.length >= 1) {
        achievements.push({
            name: 'First Step',
            icon: '🎯'
        });
    }
    
    // Perfect Score
    const hasPerfect = history.some(r => r.percentage === 100);
    if (hasPerfect) {
        achievements.push({
            name: 'Perfect Score',
            icon: '⭐'
        });
    }
    
    // Improving
    if (history.length >= 2) {
        const improved = history[history.length - 1].percentage > history[0].percentage;
        if (improved) {
            achievements.push({
                name: 'Improving',
                icon: '📈'
            });
        }
    }
    
    // Expert
    const average = history.reduce((sum, r) => sum + r.percentage, 0) / history.length;
    if (average >= 85) {
        achievements.push({
            name: 'AI Expert',
            icon: '🔬'
        });
    }
    
    // Consistent
    if (history.length >= 3) {
        const recentScores = history.slice(-3).map(r => r.percentage);
        const consistent = recentScores.every(s => s >= 75);
        if (consistent) {
            achievements.push({
                name: 'Consistent',
                icon: '💪'
            });
        }
    }
    
    // Quick Learner
    const avgTime = history.reduce((sum, r) => sum + r.timeSpent, 0) / history.length;
    if (avgTime < 10 * 60 && average >= 70) { // Less than 10 minutes average
        achievements.push({
            name: 'Quick Learner',
            icon: '⚡'
        });
    }
    
    // Dedicated
    if (history.length >= 5) {
        achievements.push({
            name: 'Dedicated',
            icon: '🏆'
        });
    }
    
    return achievements;
}

// ============================================================
// RECENT ASSESSMENTS
// ============================================================

function displayRecentAssessments(history) {
    const container = document.getElementById('assessmentsList');
    container.innerHTML = '';
    
    // Show last 5 assessments in reverse order (most recent first)
    const recent = history.slice().reverse().slice(0, 5);
    
    recent.forEach((result, idx) => {
        const date = new Date(result.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const item = document.createElement('div');
        item.className = 'assessment-item';
        item.innerHTML = `
            <div class="assessment-info">
                <div class="assessment-date">${formattedDate}</div>
                <div class="assessment-score">${result.percentage}% • ${result.readinessLevel}</div>
            </div>
            <div class="assessment-actions">
                <button class="assessment-view" onclick="viewAssessmentDetails(this)">View Details</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function viewAssessmentDetails(button) {
    // In a full app, this would navigate to detailed results
    alert('Detailed results view would open here');
}

// ============================================================
// DIFFICULTY PERFORMANCE
// ============================================================

function displayDifficultyPerformance(history) {
    const container = document.getElementById('difficultyStats');
    container.innerHTML = '';
    
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    difficulties.forEach(difficulty => {
        // Calculate average performance for this difficulty across all attempts
        const scores = history.map(result => {
            const diff = result.difficultyScores[difficulty];
            return diff ? diff.percentage : 0;
        });
        
        const avgPercentage = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        
        const item = document.createElement('div');
        item.className = 'difficulty-item';
        item.innerHTML = `
            <div class="difficulty-name">${difficulty} Questions</div>
            <div class="difficulty-bar">
                <div class="difficulty-fill" style="width: 0%">${avgPercentage}%</div>
            </div>
        `;
        container.appendChild(item);
        
        // Animate bar
        setTimeout(() => {
            item.querySelector('.difficulty-fill').style.width = avgPercentage + '%';
        }, 100);
    });
}

// ============================================================
// ACTION FUNCTIONS
// ============================================================

function retakeAssessment() {
    // Clear current assessment progress
    localStorage.removeItem('assessmentProgress');
    
    // Redirect to assessment
    window.location.href = 'assessment.html';
}

function downloadDashboardReport() {
    const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    const userName = localStorage.getItem('userName');
    
    if (history.length === 0) {
        alert('No assessments to report on yet.');
        return;
    }
    
    let content = `AI READINESS ASSESSMENT - DASHBOARD REPORT
============================================

User: ${userName}
Generated: ${new Date().toLocaleDateString()}

SUMMARY
=======
Total Assessments: ${history.length}
Best Score: ${Math.max(...history.map(r => r.percentage))}%
Average Score: ${Math.round(history.reduce((sum, r) => sum + r.percentage, 0) / history.length)}%
Latest Score: ${history[history.length - 1].percentage}%

ASSESSMENT HISTORY
==================
`;
    
    history.forEach((result, idx) => {
        const date = new Date(result.timestamp).toLocaleDateString();
        content += `\nAttempt ${idx + 1} (${date})
Score: ${result.percentage}% (${result.readinessLevel})
Time: ${Math.floor(result.timeSpent / 60)}m${result.timeSpent % 60}s
Correct: ${result.correct}/${result.totalQuestions}
`;
    });
    
    content += `\n\nCATEGORY PERFORMANCE (Average)
=============================
`;
    
    const latestResult = history[history.length - 1];
    Object.entries(latestResult.categoryScores).forEach(([cat, score]) => {
        content += `${cat}: ${score.percentage}%\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dashboard_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}
