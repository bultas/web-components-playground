// import { merge } from "https://unpkg.com/lodash-es@4.17.11/lodash.js";

// import merge from "https://unpkg.com/lodash-es@4.17.11/merge.js";
// Mock for offline
const merge = (obj, obj2) => ({ ...obj, ...obj2 });

customElements.define(
  "data-form",
  class extends HTMLElement {
    onChange({ id, value, type }) {
      this.data = merge(this.data, { [id]: { value, type } });
    }
    connectedCallback() {
      this.addEventListener("data-submit", e => {
        e.stopPropagation();

        this.dispatchEvent(
          new CustomEvent("data-submited", {
            bubbles: true,
            detail: {
              state: "init",
              data: this.data
            }
          })
        );
      });

      this.addEventListener("data-change", e => {
        const {
          detail: { id, value, type }
        } = e;
        // debugger;
        this.onChange({ id, value, type });
      });
    }
  }
);

customElements.define(
  "data-input",
  class extends HTMLElement {
    connectedCallback() {
      const value = this.getAttribute("value");
      const type = this.getAttribute("type");

      this.innerHTML = `
        <input 
          type="${type || ""}" 
          value="${value || ""}" 
        />
      `;

      this.addEventListener("change", e => {
        this.dispatchEvent(
          new CustomEvent("data-change", {
            bubbles: true,
            detail: {
              id: this.getAttribute("name"),
              value: e.target.value,
              type
            }
          })
        );
      });
    }
  }
);

customElements.define(
  "data-group",
  class extends HTMLElement {
    connectedCallback() {
      this.addEventListener("data-change", e => {
        if (e.target !== e.currentTarget) {
          e.stopPropagation();

          const {
            detail: { id, value, type }
          } = e;

          if (this.getAttribute("bubbles") !== "false") {
            this.dispatchEvent(
              new CustomEvent("data-change", {
                bubbles: true,
                detail: {
                  id: this.getAttribute("name"),
                  value: {
                    [id]: { value, type, id }
                  },
                  type: "group"
                }
              })
            );
          }
        }
      });
    }
  }
);

customElements.define(
  "data-submit",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <button>Submit</button>
      `;

      this.addEventListener("click", e => {
        this.dispatchEvent(
          new CustomEvent("data-submit", {
            bubbles: true
          })
        );
      });
    }
  }
);
