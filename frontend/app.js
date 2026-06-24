// ==========================================
// 1. VIEW SWITCHING LOGIC
// ==========================================
function switchView(viewId) {
    const views = [
        'landing-view', 'login-view', 'register-view', 
        'dashboard-view', 'quiz-view', 'score-view', 
        'profile-view', 'leaderboard-view'
    ];
    
    views.forEach(view => {
        let el = document.getElementById(view);
        if (el) el.classList.add('hidden');
    });
    
    let target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
}

// ==========================================
// 2. NAVIGATION CONNECTIONS
// ==========================================
let startBtn = document.getElementById('startBtn');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        switchView('login-view');
    });
}

// ==========================================
// 3. AUTHENTICATION (REAL BACKEND)
// ==========================================

// Login Fetch Logic
let loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const msgEl = document.getElementById('login-message');

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (msgEl) {
                msgEl.classList.remove('hidden');
                if (response.ok) {
                    msgEl.className = "mt-2 text-center text-sm text-green-500 font-bold";
                    msgEl.textContent = "Login Successful!";
                    localStorage.setItem('userId', data.userId); // Save ID for progress tracking
                    setTimeout(() => switchView('dashboard-view'), 800);
                } else {
                    msgEl.className = "mt-2 text-center text-sm text-red-500 font-bold";
                    msgEl.textContent = data.message || "Login failed.";
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// Register Fetch Logic
let registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let username = document.getElementById('reg-username').value;
        let email = document.getElementById('reg-email').value;
        let password = document.getElementById('reg-password').value;
        let msgEl = document.getElementById('register-message');

        try {
            let response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            let data = await response.json();
            
            if (msgEl) {
                msgEl.classList.remove('hidden');
                if (response.ok) {
                    msgEl.className = "mt-2 text-center text-sm text-green-500 font-bold";
                    msgEl.textContent = "Account created! You can now log in.";
                    document.getElementById('registerForm').reset();
                    setTimeout(() => switchView('login-view'), 2000);
                } else {
                    msgEl.className = "mt-2 text-center text-sm text-red-500 font-bold";
                    msgEl.textContent = data.message || "Registration failed.";
                }
            }
        } catch (error) {
            msgEl.textContent = "Cannot connect to server.";
        }
    });
}

// ==========================================
// 4. QUIZ ENGINE LOGIC
// ==========================================
const quizData = [
    { question: "What does the len() function return for an empty list?", options: ["0", "None", "Error", "-1"], correctAnswerIndex: 0 },
    { question: "Which keyword is used to define a function in Python?", options: ["func", "def", "define", "function"], correctAnswerIndex: 1 },
    { question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "Error"], correctAnswerIndex: 1 },
    { question: "Which of these data types is immutable?", options: ["List", "Dictionary", "Set", "Tuple"], correctAnswerIndex: 3 },
    { question: "How do you start a single-line comment in Python?", options: ["//", "/*", "#", "None"], correctAnswerIndex: 2 }
];

let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

document.getElementById('python-basics-card').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
    switchView('quiz-view');
});

function loadQuestion() {
    hasAnswered = false;
    const currentQ = quizData[currentQuestionIndex];
    document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    document.getElementById('question-text').textContent = currentQ.question;
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    
    const container = document.getElementById('answers-container');
    container.innerHTML = '';
    currentQ.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "w-full bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-4 hover:border-[#2A64B7] transition text-left shadow-sm answer-btn";
        btn.innerHTML = `<div class="letter-circle h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-[#2A64B7] font-bold text-sm bg-white">${['A','B','C','D'][i]}</div><span>${opt}</span>`;
        btn.onclick = () => selectAnswer(i);
        container.appendChild(btn);
    });
    document.getElementById('nextQuestionBtn').classList.add('hidden');
}

function selectAnswer(i) {
    if (hasAnswered) return;
    hasAnswered = true;
    if (i === quizData[currentQuestionIndex].correctAnswerIndex) score++;
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        if (index === quizData[currentQuestionIndex].correctAnswerIndex) btn.className = "w-full bg-[#eefaf2] border border-green-500 rounded-xl p-4 flex items-center gap-4 text-left shadow-sm transition answer-btn";
        else if (index === i) btn.className = "w-full bg-[#fdf3f3] border border-red-400 rounded-xl p-4 flex items-center gap-4 text-left shadow-sm transition answer-btn";
    });
    document.getElementById('nextQuestionBtn').classList.remove('hidden');
}

document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showFinalScore();
    }
});

async function showFinalScore() {
    document.getElementById('final-score-text').textContent = `${score}/${quizData.length}`;
    document.getElementById('final-score-subtext').textContent = `You got ${score} correct!`;
    
    // Save progress to your backend
    try {
        await fetch('http://localhost:3000/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: localStorage.getItem('userId'), quizId: 1, isCompleted: true })
        });
    } catch (e) { console.error("Progress save failed"); }
    
    switchView('score-view');
}

// ==========================================
// 5. PROFILE & LOGOUT
// ==========================================
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userId');
    switchView('landing-view');
});