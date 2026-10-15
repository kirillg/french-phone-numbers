import { createSession, cleanDigits, formatDigits, spokenNumber } from './numbers.js';
const app = document.querySelector('#app');
let numbers = [], index = 0, score = 0, digits = '', phase = 'start', deadline = 0, timer;
let speechGeneration = 0;
const brand = '<header class="brand">allô!<span><i class="flag"></i>French practice</span></header>';
const synth = window.speechSynthesis;
function speak(text, done, failed) {
  const generation = ++speechGeneration;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = .78;
  const voice = synth.getVoices().find(v => v.lang === 'fr-FR') || synth.getVoices().find(v => v.lang.startsWith('fr'));
  if (voice) utterance.voice = voice;
  let settled = false;
  const finish = callback => { if (settled || generation !== speechGeneration) return; settled = true; clearTimeout(watchdog); callback(); };
  const watchdog = setTimeout(() => finish(failed), 25000);
  utterance.onend = () => finish(done);
  utterance.onerror = () => finish(failed);
  synth.speak(utterance);
}
function startScreen(message = '') {
  clearInterval(timer); phase = 'start';
  app.innerHTML = `${brand}<section class="intro"><div class="illustration" aria-hidden="true"><div class="phone">☎</div><span class="spark">✦</span></div><p class="eyebrow">A little listening. A lot of learning.</p><h1>Listen in French.<br><em>Get the number.</em></h1><p class="description">Ten phone numbers. Thirty seconds each.<br>How many can you catch?</p><button class="primary" id="start">Start <b aria-hidden="true">→</b></button>${message ? `<p class="error" role="alert">${message}</p>` : ''}<div class="meta"><span>◷ &nbsp; 30 seconds</span><span>✦ &nbsp; 10 rounds</span></div></section><footer class="bottom-note">Listen closely. You’ve got this.</footer>`;
  document.querySelector('#start').onclick = () => {
    if (!synth || !window.SpeechSynthesisUtterance) return startScreen('This browser does not support spoken audio. Open this page in Safari on your iPhone.');
    numbers = createSession(); index = 0; score = 0; nextQuestion();
  };
}
function nextQuestion() {
  clearInterval(timer); digits = ''; phase = 'speaking';
  app.innerHTML = `${brand}<div class="session-top"><span class="progress-label">ROUND ${String(index + 1).padStart(2, '0')} / 10</span><div class="timer" role="timer" aria-label="Seconds remaining"><span id="seconds">30</span><small>sec</small></div></div><div class="progress" aria-hidden="true">${numbers.map((_, i) => `<i class="${i < index ? 'complete' : i === index ? 'current' : ''}"></i>`).join('')}</div><section class="exercise speaking"><div><div class="sound" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><h2 id="heading">Listen carefully…</h2><p class="hint" id="hint">Listen to five pairs in French.<br>Enter all 10 digits, including the first zero.</p></div><div id="answer"><label class="number-box"><input id="digits" name="listening-answer" aria-label="Ten-digit listening answer" type="text" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="__ __ __ __ __"></label><div class="helper"><button type="button" class="repeat" id="repeat" disabled aria-label="Repeat pronunciation">↻ Repeat</button><span><span id="count">0</span> / 10 digits</span></div></div><p class="feedback" id="feedback" aria-live="polite"></p><button class="primary" id="continue" hidden disabled>Continue <b aria-hidden="true">→</b></button></section><footer class="score"><span>YOUR SCORE</span><strong><span id="score">${score}</span> <small>/ 20</small></strong></footer>`;
  const input = document.querySelector('#digits');
  input.oninput = () => {
    digits = cleanDigits(input.value); input.value = formatDigits(digits);
    document.querySelector('#count').textContent = digits.length;
    if (phase === 'answering' && digits.length === 10) evaluate();
  };
  // Focus within the Start/Continue tap so iOS can open its numeric keyboard.
  input.focus({ preventScroll: true });
  document.querySelector('#continue').onclick = () => { if (phase === 'waiting') advance(); };
  const repeat = document.querySelector('#repeat');
  // Keep the numeric keyboard open when tapping Repeat.
  repeat.onpointerdown = event => event.preventDefault();
  repeat.onclick = repeatNumber;
  speak(spokenNumber(numbers[index]), () => beginAnswering(30000), audioFailed);
}
function beginAnswering(remaining) {
  phase = 'answering';
  document.querySelector('.exercise').classList.remove('speaking');
  document.querySelector('#heading').textContent = 'What did you hear?';
  document.querySelector('#repeat').disabled = false;
  document.querySelector('#repeat').textContent = '↻ Repeat';
  deadline = Date.now() + remaining;
  timer = setInterval(tick, 100); tick();
  // If all digits were typed during speech, check once it finishes.
  if (digits.length === 10) evaluate();
}
function repeatNumber() {
  if (phase !== 'answering') return;
  tick();
  if (phase !== 'answering') return;
  const remaining = Math.max(0, deadline - Date.now());
  clearInterval(timer);
  phase = 'speaking';
  document.querySelector('#digits').focus({ preventScroll: true });
  document.querySelector('.exercise').classList.add('speaking');
  document.querySelector('#heading').textContent = 'Listen again…';
  document.querySelector('#repeat').disabled = true;
  document.querySelector('#repeat').textContent = 'Playing…';
  speak(spokenNumber(numbers[index]), () => beginAnswering(remaining), () => {
    beginAnswering(remaining);
    if (phase === 'answering') {
      document.querySelector('#hint').textContent = 'Couldn’t replay audio. Tap Repeat to try again.';
    }
  });
}

function tick() {
  if (phase !== 'answering') return;
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  document.querySelector('#seconds').textContent = remaining;
  document.querySelector('.timer').classList.toggle('urgent', remaining <= 10);
  if (!remaining) evaluate(true);
}
function evaluate(timedOut = false) {
  if (phase !== 'answering') return;
  // A submission after the deadline counts as a timeout even if the tab's timer was suspended.
  timedOut ||= Date.now() >= deadline;
  phase = 'feedback'; clearInterval(timer);
  const correct = !timedOut && digits === numbers[index];
  if (correct) score += 2;
  document.querySelector('#score').textContent = score;
  document.querySelector('#digits').blur();
  document.querySelector('#digits').disabled = true;
  document.querySelector('#answer').hidden = true;
  document.querySelector('#continue').hidden = false;
  document.querySelector('#heading').textContent = correct ? 'Très bien!' : 'Keep practicing!';
  document.querySelector('#hint').textContent = 'Take your time. Continue when you’re ready.';
  const feedback = document.querySelector('#feedback');
  feedback.classList.toggle('wrong', !correct);
  feedback.textContent = correct ? 'Ta-Da, Bien! +2 points' : `${timedOut ? 'Time’s up! ' : 'Désolé! '}${formatDigits(numbers[index])}`;
  const readyToContinue = () => {
    phase = 'waiting';
    document.querySelector('#continue').disabled = false;
    document.querySelector('#continue').focus({ preventScroll: true });
  };
  speak(correct ? 'Ta-da ! Bien !' : 'Désolé.', readyToContinue, readyToContinue);
}
function advance() { index++; if (index === 10) finishScreen(); else nextQuestion(); }
function audioFailed() {
  ++speechGeneration; synth.cancel();
  startScreen('Audio could not play. Turn up your volume, check that a French voice is available in your iPhone settings, and tap Start to try again.');
}
function finishScreen() {
  phase = 'finished'; clearInterval(timer);
  app.innerHTML = `${brand}<section class="finish"><div class="illustration trophy" aria-hidden="true">✦</div><p class="eyebrow">Ten rounds. Très bien!</p><h1>Congratulations!</h1><div class="result">${score}<small> / 20</small></div><p class="description">${score === 20 ? 'A perfect score! Magnifique.' : 'Every listen is a step forward.<br>Keep practicing — you’ve got this.'}</p><button class="primary" id="done">Done <b aria-hidden="true">✓</b></button></section><footer class="bottom-note">A little more French, every day.</footer>`;
  document.querySelector('#done').onclick = () => startScreen();
}
// Check immediately on foregrounding so iOS background timer throttling cannot add time.
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
// Safari's keyboard reduces the visual viewport without changing 100svh.
// Track its usable height; focused-input styles keep the answer near the top.
function updateVisibleHeight() {
  const viewport = window.visualViewport;
  if (viewport && viewport.scale === 1) {
    app.style.setProperty('--visible-height', `${viewport.height}px`);
  }
}
window.visualViewport?.addEventListener('resize', updateVisibleHeight);
updateVisibleHeight();
startScreen();
