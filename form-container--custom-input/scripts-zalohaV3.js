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

my_form.parser = form => {
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

let changeList = [];

const validateInput = node => {
  if (node.required && !node.value) {
    return false;
  }
  return true;
};

const getValidations = cond => data => {
  let obj = {};
  for (const key in data) {
    obj = {
      ...obj,
      [key]: cond(key) ? validateInput(data[key].node) : true
    };
  }

  return obj;
};

const validateInputs = template => validityState => {
  for (const name in validityState) {
    if (!validityState[name]) {
      template.querySelector(`[name="${name}"]`).classList.add("invalid");
    }
  }
};

const isValid = validityState => {
  let valid = true;
  for (const name in validityState) {
    if (!validityState[name]) {
      valid = false;
    }
  }
  return valid;
};

my_form.validator = data => template => event => (ok, error) => {
  const observer = new MutationObserver(error);
  observer.observe(template, {
    attributes: true,
    attributeOldValue: true,
    subtree: true
  });

  switch (event.type) {
    case "change":
      const name = event.target.getAttribute("name");
      changeList = [...changeList, name];
      console.log(changeList);

      const cond = key => changeList.includes(key);
      const validityState = getValidations(cond)(data);
      console.log(validityState);

      validateInputs(template)(validityState);

      if (isValid(validityState)) {
        ok(data)([]);
      }

      break;

    case "submit": {
      const validityState = getValidations(() => true)(data);
      validateInputs(template)(validityState);

      if (isValid(validityState)) {
        ok(data)([]);
      }

      break;
    }

    default:
      console.warn("undefined event");
      break;
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

my_form.processor = form => mutations => {
  const newState = mutations.reduce(mutationReducer, {});
  const process = processor(form);

  if (!state) {
    process(newState);
  } else {
    process(state, true);
    process(newState);
  }

  console.log(newState);

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

window.addEventListener(FORM_CONTAINER_CHANGE, e => {
  console.log(FORM_CONTAINER_CHANGE, e);
});
