import {
  FormContainer,
  FORM_CONTAINER_SUBMIT,
  FORM_CONTAINER_CHANGE
} from "./form-container.js";

class CustomInput extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.value = this.getAttribute("value");
    this.name = this.getAttribute("name");
    this.type = this.getAttribute("type");

    const buttons = this.querySelectorAll("button").forEach(node => {
      node.addEventListener("click", e => {
        e.preventDefault(); // prevent Button to submit form
        this.value = e.target.value;
        e.target.classList.add("superinput");
        this.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );
      });
    });
  }
}

class FormDataPreview extends HTMLElement {
  constructor() {
    super();
    window.addEventListener(FORM_CONTAINER_SUBMIT, e => {
      console.log(e.detail);

      this.innerHTML = JSON.stringify(e.detail.get("name"));
    });
  }
  connectedCallback() {}
}

const isValid = inputData => !(inputData.required && !inputData.value);

my_form.validator = changeSet => dataMap => (ok, error) => {
  const errorMap = new Map();

  changeSet.forEach(name => {
    const inputData = dataMap.get(name);

    if (!isValid(inputData))
      errorMap.set(name, {
        name,
        type: "class",
        value: "invalid"
      });
  });

  if (errorMap.size === 0) {
    ok(dataMap)(errorMap);
  } else {
    error(errorMap);
  }
};

const applyMutations = form => (mutations, reversed) => {
  mutations.forEach((value, name) => {
    const node = form.querySelector(`[name="${name}"]`);
    const classList = node.classList;
    classList[reversed ? "remove" : "add"](value);
  });
};

my_form.processor = mutationMap => form => newMutations => {
  const apply = applyMutations(form);

  const newMutationMap = new Map();
  newMutations.forEach(({ name, type, value }) => {
    newMutationMap.set(name, value);
  });

  if (mutationMap.size === 0) {
    apply(newMutationMap);
  } else {
    apply(mutationMap, true);
    apply(newMutationMap);
  }

  return newMutationMap;
};

customElements.define("custom-input", CustomInput);
customElements.define("form-data-preview", FormDataPreview);
customElements.define("form-container", FormContainer); // TODO FIX have to be defined after custom elements.. to receive value, name props

window.addEventListener(FORM_CONTAINER_CHANGE, e => {
  console.log(FORM_CONTAINER_CHANGE, e);
});
