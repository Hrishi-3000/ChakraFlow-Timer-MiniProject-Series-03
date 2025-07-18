document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const sessionTypeDisplay = document.getElementById('session-type');
    const progressFill = document.getElementById('progress-fill');
    const notification = document.getElementById('notification');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const themeSwitcher = document.getElementById('theme-switcher');
    const html = document.documentElement;
    
    // Timer variables
    let timer;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;
    let isWorkSession = true;
    
    // Initialize timer
    function initTimer() {
        const duration = isWorkSession ? workDurationInput.value : breakDurationInput.value;
        totalSeconds = duration * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
        updateProgressBar();
        updateThemeColors();
    }
    
    // Update display
    function updateDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update progress bar
    function updateProgressBar() {
        const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Update theme colors based on session
    function updateThemeColors() {
        if (isWorkSession) {
            progressFill.style.background = 'linear-gradient(90deg, var(--work), #ff8e53)';
            document.body.style.background = 'linear-gradient(135deg, var(--bg) 0%, #ffd3d3 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, var(--break), #6dd5ed)';
            document.body.style.background = 'linear-gradient(135deg, var(--bg) 0%, #d4f5f5 100%)';
        }
    }
    
    // Start timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            
            // If timer was reset or just initialized
            if (remainingSeconds === totalSeconds) {
                showNotification(`Session started: ${isWorkSession ? 'Work' : 'Break'}`);
            }
            
            timer = setInterval(() => {
                if (remainingSeconds <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    switchSession();
                    return;
                }
                
                remainingSeconds--;
                updateDisplay();
                updateProgressBar();
                
            }, 1000);
        }
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        showNotification('Timer paused');
    }
    
    // Reset timer
    function resetTimer() {
        pauseTimer();
        isWorkSession = true;
        sessionTypeDisplay.textContent = 'Work';
        sessionTypeDisplay.classList.remove('session-switch');
        initTimer();
    }
    
    // Switch between work and break sessions
    function switchSession() {
        // Add animation class
        sessionTypeDisplay.classList.add('session-switch');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            sessionTypeDisplay.classList.remove('session-switch');
        }, 500);
        
        isWorkSession = !isWorkSession;
        sessionTypeDisplay.textContent = isWorkSession ? 'Work' : 'Break';
        
        // Show notification
        const message = isWorkSession ? 
            'Break finished! Time to work.' : 
            'Work session completed! Take a break.';
        showNotification(message);
        
        // Initialize new session
        initTimer();
        startTimer();
    }
    
    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeColors();
    }
    
    // Event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    themeSwitcher.addEventListener('click', toggleTheme);
    
    // Settings change listeners
    workDurationInput.addEventListener('change', () => {
        if (!isRunning && isWorkSession) {
            initTimer();
        }
    });
    
    breakDurationInput.addEventListener('change', () => {
        if (!isRunning && !isWorkSession) {
            initTimer();
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    // Initialize on load
    initTimer();
});