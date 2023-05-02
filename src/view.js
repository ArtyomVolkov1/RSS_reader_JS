// eslint-disable-next-line import/no-extraneous-dependencies
import onChange from 'on-change';

const render = (state, i18n, elements) => {
  const { input, form, feedback } = elements;
  input.focus();
  form.reset();
  const handleError = () => {
    if (state.form.error === null) {
      input.style.border = null;
    } else {
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.style.border = '$danger';
      feedback.textContent = state.form.error;
    }
  };
  const renderAdded = () => {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('already.successfully');
    input.style.border = null;
  };
  const clearErrors = () => {
    feedback.textContent = '';
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        handleError();
        break;
      case 'form.valid':
        clearErrors();
        renderAdded();
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default render;
