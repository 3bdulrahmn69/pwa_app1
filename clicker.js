document.addEventListener('DOMContentLoaded', () => {
  const clickTarget = document.getElementById('click-target');
  const clickCount = document.getElementById('click-count');
  const timer = document.getElementById('timer');
  const result = document.getElementById('result');
  const resetBtn = document.getElementById('reset-btn');

  let count = 0;
  let startTime = 0;
  let timerInterval = null;

  // Start the game
  clickTarget.addEventListener('click', startClicker);

  // Reset button
  resetBtn.addEventListener('click', resetGame);

  function startClicker() {
    if (count === 0) {
      // First click - start the timer
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 10);
      result.textContent = '';
      clickTarget.textContent = 'KEEP CLICKING!';
    }

    count++;
    clickCount.textContent = count;

    if (count === 10) {
      // Game finished
      clearInterval(timerInterval);
      const elapsedTime = (Date.now() - startTime) / 1000;

      if (elapsedTime <= 2) {
        result.textContent = `🎉 YOU WIN! 🎉 Time: ${elapsedTime.toFixed(2)}s`;
        result.style.color = '#27ae60';
      } else {
        result.textContent = `Time: ${elapsedTime.toFixed(
          2
        )}s - Too slow! Try again!`;
        result.style.color = '#e74c3c';
      }

      result.classList.add('pulse');
      clickTarget.textContent = 'GAME OVER';
      clickTarget.disabled = true;
    }
  }

  function updateTimer() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    timer.textContent = elapsedTime.toFixed(2);

    // Update color based on time
    if (elapsedTime > 1.5) {
      timer.style.color = '#e74c3c';
    } else if (elapsedTime > 1) {
      timer.style.color = '#f39c12';
    } else {
      timer.style.color = '#fff';
    }
  }

  function resetGame() {
    clearInterval(timerInterval);
    count = 0;
    startTime = 0;
    clickCount.textContent = '0';
    timer.textContent = '0.00';
    timer.style.color = '#fff';
    result.textContent = '';
    result.classList.remove('pulse');
    clickTarget.textContent = 'CLICK ME!';
    clickTarget.disabled = false;
  }
});
