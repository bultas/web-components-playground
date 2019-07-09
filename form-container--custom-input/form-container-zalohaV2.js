export const FORM_CONTAINER_CHANGE = "form-container:change";
export const FORM_CONTAINER_SUBMIT = "form-container:submit";

export class FormContainer extends HTMLElement {
  constructor() {
    super();
  }

  getValidator() {
    const form = this.querySelector("form");
    const template = this.querySelector("template");
    return this.validator(form)(template);
  }

  getProcessor() {
    const form = this.querySelector("form");
    const template = this.querySelector("template");
    return this.processor(form)(template);
  }

  init() {
    this.addEventListener("submit", e => {
      e.preventDefault();

      const validator = this.getValidator();
      const processor = this.getProcessor();

      validator(
        data => mutations => {
          processor(mutations);

          this.dispatchEvent(
            new CustomEvent(FORM_CONTAINER_SUBMIT, {
              bubbles: true,
              detail: data
            })
          );
        },
        data => processor
      );
    });

    this.addEventListener("change", e => {
      e.preventDefault();

      const validator = this.getValidator();
      const processor = this.getProcessor();

      validator(
        data => mutations => {
          processor(mutations);

          this.dispatchEvent(
            new CustomEvent(FORM_CONTAINER_CHANGE, {
              bubbles: true,
              detail: data
            })
          );
        },
        data => processor
      );
    });

    this.addEventListener("reset", e => {
      this.reset(this);
    });
  }

  connectedCallback() {
    this.template = this.querySelector("template");
    this.appendChild(this.template.content.cloneNode(true));
    this.init();
  }
}
