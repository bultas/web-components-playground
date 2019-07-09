const INIT = "INIT";
const CHANGED = "CHANGED";
export const FORM_SUBMIT = "FORM_SUBMIT";
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_INIT = "INPUT_INIT";

export const FORM_CONTAINER_CHANGE = "form-container:change";
export const FORM_CONTAINER_SUBMIT = "form-container:submit";

const ok = value => ({
  status: "OK",
  value
});

const error = value => ({
  status: "ERROR",
  value
});

const convertFormData = formData =>
  formData.reduce((acc, [key, val]) => {
    return {
      ...acc,
      [key]: val
    };
  }, {});

const createFormChangeEvent = (id, name, value) =>
  new CustomEvent(FORM_CONTAINER_CHANGE, {
    bubbles: true,
    detail: {
      // id: this.querySelector("form").id,
      // id: e.target.form.id, // not works with custom-input
      id,
      data: {
        [name]: value
      }
    }
  });

export const createFormClass = validate =>
  class extends HTMLElement {
    constructor() {
      super();
      const formID = this.querySelector("form").id;
      const form = this.querySelector(`#${formID}`);
      this.form = form;
      this.valid = null;
    }

    saveValue(name, value) {
      this.formData = { ...this.formData, [name]: value };
    }

    saveReference(name, target) {
      this.references = { ...this.references, [name]: target };
    }

    saveInputState(name, state) {
      this.inputStates = {
        ...this.inputStates,
        [name]: state
      };
    }

    getInputStates() {
      return this.inputStates;
    }

    getFormData() {
      return this.formData;
    }

    getRefereces() {
      return this.references;
    }

    initNativeFormElements(data) {
      this.formData = data;
    }

    validate(event) {
      this.valid = validate(this.getRefereces())(this.getFormData())(
        this.getInputStates()
      )(event);
      return this.valid;
    }

    connectedCallback() {
      this.form.setAttribute("novalidate", "true");
      this.initNativeFormElements(
        convertFormData([...new FormData(this.form)])
      );

      this.addEventListener("submit", e => {
        e.preventDefault();

        if (this.validate(FORM_SUBMIT)) {
          const event = new CustomEvent(FORM_CONTAINER_SUBMIT, {
            bubbles: true,
            detail: { id: e.target.id, data: this.getFormData() }
          });
          this.dispatchEvent(event);
        }
      });

      this.addEventListener("custom-input-init", e => {
        this.saveValue(e.detail.name, e.detail.value);
        this.saveReference(e.detail.name, e.target);
        this.saveInputState(e.detail.name, INIT);
        this.validate(INPUT_INIT);
      });

      this.addEventListener("change", e => {
        this.saveValue(e.target.name, e.target.value);
        // this.saveReference(e.target.name, e.target);
        this.saveInputState(e.target.name, CHANGED);
        this.validate(INPUT_CHANGE);
        this.dispatchEvent(
          createFormChangeEvent(this.form.id, e.target.name, e.target.value)
        );
        // e.target.classList.add("changed");
      });

      // TODO couldn't custom-element trigger same Event as InputEvent?
      this.addEventListener("custom-input-change", e => {
        this.saveValue(e.detail.name, e.detail.value);
        this.saveInputState(e.detail.name, CHANGED);
        this.validate(INPUT_CHANGE);
        this.dispatchEvent(
          createFormChangeEvent(this.form.id, e.detail.name, e.detail.value)
        );
        // e.target.classList.add("changed");
      });
    }
  };
