const addListenerToToggl = ariaState => toggle => {
  toggle.addEventListener("click", e => {
    const currentTarget = e.currentTarget;
    const pressed = currentTarget.getAttribute(ariaState) === "true";
    currentTarget.setAttribute(ariaState, String(!pressed));
  });
};

const registerAriaButtonsListeners = ariaState =>
  document
    .querySelectorAll(`[${ariaState}]`)
    .forEach(addListenerToToggl(ariaState));

registerAriaButtonsListeners("aria-pressed");
registerAriaButtonsListeners("aria-expanded");
