const INIT = "INIT";
const CHANGED = "CHANGED";
export const FORM_SUBMIT = "FORM_SUBMIT";

export const FORM_CONTAINER_CHANGE = "form-container:change";
export const FORM_CONTAINER_SUBMIT = "form-container:submit";

const observer = new MutationObserver(e => {
  console.log(e);
});

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

    this.addEventListener("submit", e => {
      e.preventDefault();
      this.saveFormElements();
      this.dispatchFormEvent(FORM_CONTAINER_SUBMIT, {
        form: this.getFormDetail()
      });
    });

    this.addEventListener("reset", e => {
      // e.preventDefault();
      // TODO how to wait to reset event callback (maybe Observe)
      setTimeout(() => {
        this.resetCustomInputs();
        this.saveFormElements();
      }, 0);
    });

    this.addEventListener("change", e => {
      // const name = e.target.name;
      // this.saveValue(name, e.target.value);
      // this.saveInputState(name, CHANGED);

      this.saveFormElements();

      this.dispatchFormEvent(FORM_CONTAINER_CHANGE, {
        form: this.getFormDetail(),
        input: {
          ...this.getFormData()[e.target.name]
        }
      });
    });
  }

  // saveValue(name, value) {
  //   const field = this.getFormData()[name];
  //   this.saveFormData({
  //     ...this.getFormData(),
  //     [name]: {
  //       ...field,
  //       value
  //     }
  //   });
  // }

  // saveInputState(name, state) {
  //   const field = this.getFormData()[name];
  //   this.saveFormData({
  //     ...this.getFormData(),
  //     [name]: {
  //       ...field,
  //       state
  //     }
  //   });
  // }

  getFormData() {
    return this.formData;
  }

  getFormDataIndex() {
    return this.formDataIndex;
  }

  saveFormData(newData) {
    this.formData = newData;
  }

  saveFormDataIndex(index) {
    this.formDataIndex = index;
  }

  getFormDetail() {
    return {
      node: this.form,
      data: this.getFormData(),
      index: this.getFormDataIndex()
    };
  }

  saveFormElements() {
    const fields = this.form.querySelectorAll(
      'input, textarea, select, [type="input"], input-group-templated'
    );
    const fieldsAsArr = [...fields];

    const formData = fieldsAsArr.reduce((acc, field) => {
      // observer.observe(field, { attributes: true });

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

    const formDataIndex = fieldsAsArr.map(({ name }) => name);

    this.saveFormData(formData);
    this.saveFormDataIndex(formDataIndex);
  }

  resetCustomInputs() {
    const data = this.getFormData();
    for (var key in data) {
      const field = data[key];
      if (field.type === "input") {
        field.node.value = field.node.getAttribute("value");
      }
    }
  }

  dispatchFormEvent(type, detail) {
    const event = new CustomEvent(type, {
      bubbles: true,
      detail
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.form = this.querySelector("form");
    // this.form.setAttribute("novalidate", "true");

    this.saveFormElements();
  }
}
