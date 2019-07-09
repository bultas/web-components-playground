import {
  createFormClass,
  FORM_SUBMIT,
  FORM_CONTAINER_CHANGE,
  FORM_CONTAINER_SUBMIT
} from "./form-container.js";

window.addEventListener(FORM_CONTAINER_SUBMIT, e => {
  console.log(FORM_CONTAINER_SUBMIT, e.detail);
  document.getElementById("preview").innerHTML = JSON.stringify(e.detail);
});

window.addEventListener(FORM_CONTAINER_CHANGE, e => {
  console.log(FORM_CONTAINER_CHANGE, e.detail);
});

const validate = references => data => inputStates => event => {
  if (event === FORM_SUBMIT) {
    console.table(event);
    console.table(references);
    console.table(data);
    console.table(inputStates);
  }

  return false;
  // TODO return ok()/error() to pass message
};

class CustomInput extends HTMLElement {
  constructor() {
    super(); // TODO Why?
  }
  connectedCallback() {
    const initEvent = new CustomEvent("custom-input-init", {
      bubbles: true,
      detail: {
        name: this.getAttribute("name"),
        value: ""
      }
    });
    this.dispatchEvent(initEvent);

    this.addEventListener("click", e => {
      e.preventDefault(); // prevent Button to submit form
      const event = new CustomEvent("custom-input-change", {
        bubbles: true,
        detail: {
          name: this.getAttribute("name"),
          value: e.target.value
          // value: [e.target.value, 123]
        }
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define("form-container", createFormClass(validate));
customElements.define("custom-input", CustomInput);
