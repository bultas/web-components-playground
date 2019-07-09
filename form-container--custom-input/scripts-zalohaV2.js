import { FormContainer, FORM_CONTAINER_SUBMIT } from "./form-container.js";

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
      this.innerHTML = JSON.stringify(e.detail);
    });
  }
  connectedCallback() {}
}

const createFieldInfo = (field, value) => ({
  [field.name]: {
    name: field.name,
    value: value || field.value,
    type: field.type,
    node: field
    // state: INIT
  }
});

const parseInputs = form => {
  const fields = form.querySelectorAll(
    'input, textarea, select, [type="input"], input-group-templated'
  );
  const fieldsAsArr = [...fields];

  const formData = fieldsAsArr.reduce((acc, field) => {
    switch (field.type) {
      case "radio":
        if (field.checked) {
          return { ...acc, ...createFieldInfo(field) };
        }
        return acc;

      case "file": {
        return { ...acc, ...createFieldInfo(field, field.files) };
      }

      case "select-multiple": {
        const value = [...field.options]
          .filter(option => option.selected)
          .map(option => option.value);
        return { ...acc, ...createFieldInfo(field, value) };
      }

      default:
        return { ...acc, ...createFieldInfo(field) };
    }
  }, {});

  return formData;
};

my_form.validator = form => template => (ok, error) => {
  const data = parseInputs(form);

  debugger;

  if (data.email.value) {
    ok(data)([]);
  } else {
    const node = document.importNode(template.content, true);

    const observer = new MutationObserver(error(data));
    observer.observe(node, {
      attributes: true,
      attributeOldValue: true,
      subtree: true
    });

    node.querySelector('[name="email"]').classList.add("invalid");
    node
      .querySelector('[name="email"]')
      .setAttribute("data-validation", "Please insert valid email");
  }
};

let state = null;

const mutationReducer = (acc, mutation) => {
  if (mutation.type === "attributes") {
    const record = [
      mutation.target.getAttribute("name"),
      mutation.attributeName,
      mutation.oldValue,
      mutation.target.getAttribute(mutation.attributeName)
    ];

    const [name, attribute, oldValue, newValue] = record;

    return {
      ...acc,
      [name]: {
        ...acc[name],
        [attribute]: [newValue, oldValue]
      }
    };
  }
};

const processor = form => (state, reversed) => {
  for (const name in state) {
    for (const attr in state[name]) {
      const attribute = state[name][attr];
      form
        .querySelector(`[name="${name}"]`)
        .setAttribute(attr, attribute[reversed ? 1 : 0]);
    }
  }
};

my_form.processor = form => template => mutations => {
  const newState = mutations.reduce(mutationReducer, {});
  const process = processor(form);
  if (!state) {
    process(newState);
  } else {
    process(state, true);
    process(newState);
  }

  state = newState;
};

my_form.reset = container => {
  container.replaceChild(
    container.querySelector("template").content.cloneNode(true),
    container.querySelector("form")
  );
};

// my_form.reset = container => {
//   const data = container.saveFormElements();
//   for (var key in data) {
//     const field = data[key];
//     if (field.type === "input") {
//       field.node.value = field.node.getAttribute("value");
//     }
//   }
// };

customElements.define("custom-input", CustomInput);
customElements.define("form-data-preview", FormDataPreview);
customElements.define("form-container", FormContainer); // TODO FIX have to be defined after custom elements.. to receive value, name props
