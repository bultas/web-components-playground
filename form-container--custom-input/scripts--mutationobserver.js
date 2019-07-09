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

customElements.define("custom-input", CustomInput);
customElements.define("form-data-preview", FormDataPreview);
customElements.define("form-container", FormContainer); // TODO FIX have to be defined after custom elements.. to receive value, name props

// window.addEventListener("reset", () => {
//   console.log("should remove validations");
// });

// window.addEventListener("change", e => {
//   console.log("window", e);
// });

my_form.validate = (ok, error) => data => template => {
  // return data.email.value
  //   ? ok(data)
  //   : error({ email: { message: "Pass valid email", node: data.email.node } });

  if (data.email.value) {
    ok(data);
  } else {
    const node = document.importNode(template.content, true);

    const observer = new MutationObserver(error);

    observer.observe(node, {
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      childList: true,
      subtree: true
    });

    node.querySelector('[name="email"]').classList.add("invalid");
    node.querySelector('[name="readonly"]').classList.add("invalid");
  }
};

my_form.apply = e => {
  console.log(e);
};

my_form.reset = container => {
  container.replaceChild(
    container.template.content.cloneNode(true),
    container.querySelector("form")
  );
};
