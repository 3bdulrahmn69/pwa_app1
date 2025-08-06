document.addEventListener('DOMContentLoaded', () => {
  const reactionBox = document.getElementById('reaction-box');
  const reactionTime = document.getElementById('reaction-time');
  const bestTime = document.getElementById('best-time');
  const result = document.getElementById('result');
  const startBtn = document.getElementById('start-btn');

  let start = 0;
  let timeoutId = null;
  let best = localStorage.getItem('bestReactionTime') || 0;
  bestTime.textContent = best > 0 ? best + 's' : '0.00s';

  // Start button
  startBtn.addEventListener('click', startGame);

  // Click reaction box
  reactionBox.addEventListener('click', () => {
    if (reactionBox.classList.contains('go')) {
      // Valid click
      const elapsed = Date.now() - start;
      const seconds = elapsed / 1000;

      reactionTime.textContent = seconds.toFixed(2);
      reactionBox.classList.remove('go');
      reactionBox.innerHTML = '<p>Nice! Click Start to try again</p>';

      result.textContent = `Reaction Time: ${seconds.toFixed(2)} seconds`;
      result.style.color = '#27ae60';
      result.classList.add('pulse');

      // Update best time
      if (best === 0 || seconds < best) {
        best = seconds;
        bestTime.textContent = best.toFixed(2) + 's';
        localStorage.setItem('bestReactionTime', best);
      }
    } else if (reactionBox.classList.contains('ready')) {
      // Clicked too soon
      reactionBox.classList.remove('ready');
      reactionBox.innerHTML = '<p>Too soon! Wait for green</p>';
      reactionBox.style.backgroundColor = '#e74c3c';

      result.textContent = 'Too early! Try again';
      result.style.color = '#e74c3c';

      clearTimeout(timeoutId);
    }
  });

  function startGame() {
    // Reset state
    reactionBox.innerHTML = '<p>Get ready...</p>';
    reactionBox.style.backgroundColor = '#333';
    reactionTime.textContent = '0.00';
    result.textContent = '';
    result.classList.remove('pulse');

    // Wait for random time between 2-5 seconds
    const waitTime = Math.floor(Math.random() * 3000) + 2000;

    // Set ready state
    timeoutId = setTimeout(() => {
      reactionBox.classList.add('ready');
      reactionBox.innerHTML = '<p>Wait for green...</p>';
      reactionBox.style.backgroundColor = '#c0392b';

      // Set go state after random time
      timeoutId = setTimeout(() => {
        reactionBox.classList.remove('ready');
        reactionBox.classList.add('go');
        reactionBox.innerHTML = '<p>CLICK NOW!</p>';
        reactionBox.style.backgroundColor = '#27ae60';
        start = Date.now();
      }, Math.floor(Math.random() * 2000) + 1000);
    }, waitTime);
  }
});
