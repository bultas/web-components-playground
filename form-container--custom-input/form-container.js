export const FORM_CONTAINER_CHANGE = "form-container:change";
export const FORM_CONTAINER_SUBMIT = "form-container:submit";

const parse = form => {
  const fields = form.querySelectorAll(
    'input, textarea, select, [type="input"], input-group-templated'
  );

  return [...fields].reduce((map, field) => {
    switch (field.type) {
      case "radio":
        if (field.checked) {
          return map.set(field.name, {
            name: field.name,
            value: field.value,
            type: field.type,
            required: field.required
          });
        }

        return map;

      case "file": {
        return map.set(field.name, {
          name: field.name,
          value: field.files,
          type: field.type,
          required: field.required
        });
      }

      case "select-multiple": {
        const value = [...field.options]
          .filter(option => option.selected)
          .map(option => option.value);

        return map.set(field.name, {
          name: field.name,
          value,
          type: field.type,
          required: field.required
        });
      }

      default:
        return map.set(field.name, {
          name: field.name,
          value: field.value,
          type: field.type,
          required: field.required
        });
    }
  }, new Map());
};

export class FormContainer extends HTMLElement {
  constructor() {
    super();
    this.changeSet = new Set();
    this.mutationMap = new Map();
  }

  addToChangeSet(names) {
    names.forEach(name => {
      this.changeSet.add(name);
    });
    return this.changeSet;
  }

  updateMutationState(newState) {
    this.mutationMap = newState;
    return this.mutationMap;
  }

  clearStates() {
    this.changeSet.clear();
    this.mutationMap.clear();
  }

  handleEvent(successEventType, changeSet) {
    const form = this.querySelector("form");
    const dataMap = parse(form);
    const newChangeSet = this.addToChangeSet(changeSet || [...dataMap.keys()]); // TODO why convert to Array
    const validator = this.validator(newChangeSet)(dataMap);
    const processor = this.processor(this.mutationMap)(form);

    const ok = data => mutations => {
      this.updateMutationState(processor(mutations));

      this.dispatchEvent(
        new CustomEvent(successEventType, {
          bubbles: true,
          detail: data
        })
      );
    };

    const error = mutations => this.updateMutationState(processor(mutations));

    validator(ok, error);
  }

  init() {
    this.addEventListener("submit", e => {
      e.preventDefault();
      this.handleEvent(FORM_CONTAINER_SUBMIT);
    });

    this.addEventListener("change", e => {
      e.preventDefault();
      this.handleEvent(FORM_CONTAINER_CHANGE, [e.target.getAttribute("name")]);
    });

    // this.addEventListener("input", e => {
    //   e.preventDefault();
    //   this.handleEvent(FORM_CONTAINER_CHANGE, [e.target.getAttribute("name")]);
    // });

    // this.addEventListener("focusout", e => {
    //   e.preventDefault();
    //   this.handleEvent(FORM_CONTAINER_CHANGE, [e.target.getAttribute("name")]);
    // });

    this.addEventListener("reset", e => {
      this.replaceChild(
        this.querySelector("template").content.cloneNode(true),
        this.querySelector("form")
      );

      this.clearStates();
    });
  }

  connectedCallback() {
    this.template = this.querySelector("template");
    this.appendChild(this.template.content.cloneNode(true));
    this.init();
  }
}
