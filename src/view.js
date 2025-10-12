const renderFormStatus = (elements, status, error) => {
  const { input, feedback, submitButton } = elements;

  switch (status) {
    case 'filling':
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      feedback.classList.remove('text-danger', 'text-success');
      submitButton.disabled = false;
      break;

    case 'processing':
      submitButton.disabled = true;
      break;

    case 'success':
      input.classList.remove('is-invalid');
      feedback.textContent = 'RSS успешно загружен';
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      submitButton.disabled = false;
      break;

    case 'error':
      input.classList.add('is-invalid');
      feedback.textContent = error;
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      submitButton.disabled = false;
      break;

    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

export default (elements, state, path) => {
  const { form } = state;

  if (path === 'form.status' || path === 'form.error') {
    renderFormStatus(elements, form.status, form.error);
  }
};
