const dropButtons = document.querySelectorAll(
  "button[aria-haspopup='true'][aria-expanded]"
);

const droplists = document.querySelectorAll(
  "[aria-haspopup='true'][aria-expanded] + [role='menu']"
);

const handleHideContent = target => {
  if (target.getAttribute("aria-expanded") === "true") {
    switchAriaState("aria-expanded")(target);
  }
};

dropButtons.forEach(button => {
  button.addEventListener("click", e => {
    if (e.currentTarget.getAttribute("aria-expanded") === "false") {
      e.currentTarget.setAttribute("aria-expanded", "true");
      e.currentTarget.nextElementSibling.focus();
      return;
    }

    if (e.currentTarget.getAttribute("aria-expanded") === "true") {
      e.currentTarget.setAttribute("aria-expanded", "false");
      e.currentTarget.focus();
      return;
    }
  });
});

droplists.forEach(list => {
  list.addEventListener("blur", e => {
    setTimeout(() => {
      e.target.previousElementSibling.setAttribute("aria-expanded", false);
      e.target.previousElementSibling.focus();
    }, 300);
  });
  list.addEventListener("keydown", e => {
    if (e.code === "Escape") {
      e.target.previousElementSibling.setAttribute("aria-expanded", false);
      e.target.previousElementSibling.focus();
    }
  });
});
