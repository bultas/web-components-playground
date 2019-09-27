const switchAriaState = ariaState => target => {
  const pressed = target.getAttribute(ariaState) === "true";
  target.setAttribute(ariaState, String(!pressed));
};

const addClickListenersToButtons = ariaState => button => {
  button.addEventListener("click", e => {
    const currentTarget = e.currentTarget;
    switchAriaState(ariaState)(currentTarget);
  });
};

const registerAriaButtonsListeners = ariaState =>
  document
    .querySelectorAll(`[${ariaState}]`)
    .forEach(addClickListenersToButtons(ariaState));

registerAriaButtonsListeners("aria-pressed");
registerAriaButtonsListeners("aria-expanded");
