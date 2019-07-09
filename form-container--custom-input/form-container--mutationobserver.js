const INIT = "INIT";
const CHANGED = "CHANGED";
export const FORM_SUBMIT = "FORM_SUBMIT";

export const FORM_CONTAINER_CHANGE = "form-container:change";
export const FORM_CONTAINER_SUBMIT = "form-container:submit";

// const ok = value => ({
//   type: "OK",
//   value
// });

// const error = value => ({
//   type: "ERROR",
//   value
// });

const createFieldInfo = (field, value) => ({
  [field.name]: {
    name: field.name,
    value: value || field.value,
    type: field.type,
    node: field
    // state: INIT
  }
});

export class FormContainer extends HTMLElement {
  constructor() {
    super();
  }

  saveFormElements() {
    const fields = this.querySelectorAll(
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
  }

  ok(data) {
    this.dispatchEvent(
      new CustomEvent(FORM_CONTAINER_SUBMIT, {
        bubbles: true,
        detail: data
      })
    );
  }

  init() {
    this.addEventListener("submit", e => {
      e.preventDefault();

      this.validate(this.ok.bind(this), this.apply)(this.saveFormElements())(
        this.template
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
