import {
  FormContainer,
  FORM_CONTAINER_CHANGE,
  FORM_CONTAINER_SUBMIT
} from "./form-container.js";

const validate = e => {
  const eventDetail = e.detail;
  const formData = eventDetail.form.data;

  console.log(formData);

  for (var key in formData) {
    const field = formData[key];
    if (field.node.hasAttribute("required") && field.value == false) {
      field.node.classList.add("invalid");
      field.node.focus();
    } else {
      field.node.classList.remove("invalid");
    }
  }
};

const validateSingl = e => {
  const field = e.detail.input;
  if (field.node.hasAttribute("required") && field.value == false) {
    field.node.classList.add("invalid");
  } else {
    field.node.classList.remove("invalid");
  }
};

class CustomInput extends HTMLElement {
  connectedCallback() {
    this.value = this.getAttribute("value");
    this.name = this.getAttribute("name");
    this.type = this.getAttribute("type");

    this.addEventListener("click", e => {
      e.preventDefault(); // prevent Button to submit form
      this.value = e.target.value;
      this.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    });
  }
}

class InputGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    const form = document.createElement("form");
    form.appendChild(slot);
    this.shadowRoot.appendChild(form);
  }
  connectedCallback() {
    this.value = this.getAttribute("value");
    this.name = this.getAttribute("name");
    this.type = this.getAttribute("type");

    this.shadowRoot.addEventListener("change", e => {
      // const form = this.shadowRoot.querySelector("form");
      e.preventDefault();
      e.stopPropagation();
      console.log("input-group", e);
    });
  }
}

class InputGroupTemplated extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const formContainer = document.createElement("form-container");
    const form = document.createElement("form");

    // const button = document.createElement("button");
    // button.innerText = "Add";

    const template = this.querySelector("template");
    const templateContent = template.content;

    form.appendChild(templateContent);
    formContainer.appendChild(form);

    this.shadowRoot.appendChild(formContainer);

    // button.addEventListener("click", () => {
    //   const template = this.querySelector("template");
    //   const templateContent = template.content;
    //   this.shadowRoot.appendChild(templateContent);
    // });

    // this.shadowRoot.appendChild(slot);
    // this.shadowRoot.appendChild(button);
  }
  connectedCallback() {
    this.value = this.getAttribute("value");
    this.name = this.getAttribute("name");
    this.type = this.getAttribute("type");

    this.shadowRoot.addEventListener(FORM_CONTAINER_CHANGE, e => {
      // const form = this.shadowRoot.querySelector("form");
      // const formData = [...new FormData(form)];
      // console.log("input-group", formData);
      // console.log(e.detail.form.data);
      this.value = e.detail.form.data;
      this.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    });
  }
}

class FormDataPreview extends HTMLElement {
  constructor() {
    super();
    window.addEventListener(FORM_CONTAINER_SUBMIT, e => {
      this.innerHTML = JSON.stringify(e.detail.form.data);
    });
  }
  connectedCallback() {}
}

customElements.define("custom-input", CustomInput);
customElements.define("input-group", InputGroup);
customElements.define("input-group-templated", InputGroupTemplated);
customElements.define("form-data-preview", FormDataPreview);
customElements.define("form-container", FormContainer); // TODO FIX have to be defined after custom elements.. to receive value, name props

window.addEventListener(FORM_CONTAINER_SUBMIT, validate);
window.addEventListener(FORM_CONTAINER_CHANGE, validateSingl);

window.addEventListener("reset", () => {
  console.log("should remove validations");
});

window.addEventListener("change", e => {
  console.log("window", e);
});

window.addEventListener("click", e => {
  switch (e.target.getAttribute("type")) {
    case "add":
      const input = document.createElement("input");
      input.required = true;
      input.name = Date.now();
      e.target.parentNode.appendChild(input);
    default:
      break;
  }
});
