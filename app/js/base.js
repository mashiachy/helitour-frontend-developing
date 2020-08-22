export const questionsManager = () => {
  document.querySelectorAll('[data-question]').forEach(question => {
    const anchor = question.querySelector('[data-question-anchor]');
    const disActive = e => {
      e.parentNode.style.maxHeight = `${e.clientHeight}px`;
      e.removeAttribute('data-question-anchor-active', 'true');
    };
    const active = e => {
      e.parentNode.style.maxHeight = '1000px';
      e.setAttribute('data-question-anchor-active', true);
    };
    disActive(anchor);
    anchor.addEventListener('click', ({ target }) => {
      if (target.hasAttribute('data-question-anchor-active')) {
        disActive(target);
      } else {
        active(target);
      }
    });
  });
};