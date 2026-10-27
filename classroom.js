const words = [
  ['un stylo','a pen'],['un crayon','a pencil'],['une gomme','an eraser'],
  ['une règle','a ruler'],['un cahier','a notebook'],['une trousse','a pencil case'],
  ['des ciseaux','scissors'],['un tableau','a board'],['une feuille de papier','a sheet of paper'],
  ['une classe','a classroom'],['une table','a table'],['une chaise','a chair'],
  ['un livre','a book'],['un marqueur','a marker']
];
export function showClassroomQuiz(app, brand, home) {
  let round = 0, score = 0, questions = [];
  const shuffled = [...words].sort(() => Math.random() - .5);
  questions = shuffled.slice(0,10).map((pair,i) => ({pair, reverse:i>=5}));
  function render() {
    if (round === 10) {
      app.innerHTML = `${brand}<section class="finish"><p class="eyebrow">Classroom objects</p><h1>Très bien!</h1><div class="result">${score}<small> / 10</small></div><p class="description">Keep practicing your French vocabulary!</p><button class="primary" id="home">Back to quizzes →</button></section>`;
      app.querySelector('#home').onclick=home; return;
    }
    const {pair,reverse}=questions[round];
    const answer=reverse?pair[0]:pair[1], prompt=reverse?pair[1]:pair[0];
    const alternatives=words.map(p=>reverse?p[0]:p[1]).filter(x=>x!==answer).sort(()=>Math.random()-.5).slice(0,3);
    const choices=[answer,...alternatives].sort(()=>Math.random()-.5);
    app.innerHTML=`${brand}<div class="session-top"><button class="back-link" id="home">← Quizzes</button><span class="progress-label">ROUND ${round+1} / 10</span></div><div class="progress">${questions.map((_,i)=>`<i class="${i<round?'complete':i===round?'current':''}"></i>`).join('')}</div><section class="exercise"><p class="eyebrow">${reverse?'English → French':'French → English'}</p><h2>${prompt}</h2><p class="hint">Choose the correct translation.</p><div class="classroom-options">${choices.map((choice,i)=>`<button class="answer-option" data-choice="${i}">${choice}</button>`).join('')}</div><p class="feedback" id="feedback" aria-live="polite"></p><button class="primary" id="next" hidden>Continue →</button></section><footer class="score"><span>YOUR SCORE</span><strong>${score} <small>/ 10</small></strong></footer>`;
    app.querySelector('#home').onclick=home;
    app.querySelectorAll('.answer-option').forEach((button,i)=>button.onclick=()=>{
      const correct=choices[i]===answer;
      if(correct)score++;
      app.querySelectorAll('.answer-option').forEach(b=>b.disabled=true);
      button.classList.add(correct?'correct':'incorrect');
      app.querySelector('#feedback').textContent=correct?'Très bien!':`Correct answer: ${answer}`;
      app.querySelector('#feedback').classList.toggle('wrong',!correct);
      app.querySelector('#next').hidden=false;
    });
    app.querySelector('#next').onclick=()=>{round++;render();};
  }
  render();
}
