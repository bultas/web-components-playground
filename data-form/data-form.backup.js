customElements.define(
  "data-form",
  class extends HTMLElement {
    onChange({ id, value }) {
      this.data = {
        ...this.data,
        [id]: value
      };
    }
    onInit(input) {
      this.onChange(input);
    }
    connectedCallback() {
      this.addEventListener("data-submit", e => {
        // e.stopPropagation();
        // console.log("data-submit", this.data);

        this.dispatchEvent(
          new CustomEvent("data-change", {
            bubbles: true,
            detail: {
              id: this.getAttribute("name"),
              value: this.data
            }
          })
        );
      });

      this.addEventListener("data-change", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();

        // console.log("data-change", { id, value });
        this.onChange({ id, value });
      });

      this.addEventListener("data-init", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();

        // console.log("data-init", { id, value });
        this.onInit({ id, value });
      });
    }
  }
);

customElements.define(
  "data-input",
  class extends HTMLElement {
    connectedCallback() {
      this.dispatchEvent(
        new CustomEvent("data-init", {
          bubbles: true,
          detail: {
            id: this.getAttribute("name"),
            value: this.getAttribute("value")
          }
        })
      );

      this.innerHTML = `
        <input />
      `;

      this.addEventListener("change", e => {
        const event = new CustomEvent("data-change", {
          bubbles: true,
          detail: {
            id: this.getAttribute("name"),
            value: e.target.value
          }
        });
        this.dispatchEvent(event);
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
        const event = new CustomEvent("data-submit", {
          bubbles: true
        });
        this.dispatchEvent(event);
      });
    }
  }
);

customElements.define(
  "data-form",
  class extends HTMLElement {
    onChange({ id, value }) {
      this._data = {
        ...this._data,
        [id]: value
      };
    }
    onInit(input) {
      this.onChange(input);
    }
    getData() {
      return this._data;
    }
    connectedCallback() {
      // const shadow = this.attachShadow({ mode: "open" });

      // shadow.innerHTML = `
      //   <slot></slot>
      // `;

      // this.addEventListener("data-submit", () => {
      //   console.log(this._data);
      // });

      this.addEventListener("data-submit", e => {
        // e.stopPropagation();
        // console.log("data-submit", this._data);

        this.dispatchEvent(
          new CustomEvent("data-submited", {
            bubbles: true,
            detail: {
              id: this.id,
              value: this.getData()
            }
          })
        );
      });

      this.addEventListener("data-change", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();
        // console.log("data-change", { id, value });
        this.onChange({ id, value });
      });

      this.addEventListener("data-init", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();
        // console.log("data-init", { id, value });
        this.onInit({ id, value });
      });
    }
  }
);

customElements.define(
  "data-input",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <input 
          type="${this.getAttribute("type") || ""}" 
          value="${this.getAttribute("value") || ""}" 
        />
      `;

      this.addEventListener("change", e => {
        const event = new CustomEvent("data-change", {
          bubbles: true,
          detail: {
            id: this.getAttribute("name"),
            value: e.target.value
          }
        });
        this.dispatchEvent(event);
      });

      this.dispatchEvent(
        new CustomEvent("data-init", {
          bubbles: true,
          detail: {
            id: this.getAttribute("name"),
            value: this.getAttribute("value") || ""
          }
        })
      );
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
        const event = new CustomEvent("data-submit", {
          bubbles: true
        });
        this.dispatchEvent(event);
      });
    }
  }
);

customElements.define(
  "data-group",
  class extends HTMLElement {
    onChange({ id, value }) {
      this._data = {
        ...this._data,
        [id]: value
      };
    }
    onInit(input) {
      this.onChange(input);
    }
    getData() {
      return this._data;
    }
    connectedCallback() {
      window.addEventListener("data-init", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();
        console.log("data-init", { id, value });
        this.onInit({ id, value });
      });

      this.addEventListener("data-change", e => {
        if (e.target !== e.currentTarget) {
          e.stopPropagation();

          const {
            detail: { id, value }
          } = e;

          this.onChange({ id, value });

          if (this.getAttribute("bubbles") !== "false") {
            const event = new CustomEvent("data-change", {
              bubbles: true,
              detail: {
                id: this.getAttribute("name"),
                value: this.getData()
              }
            });
            this.dispatchEvent(event);
          }
        }

        // console.log("data-change", { id, value });
      });
    }
  }
);

///

customElements.define(
  "data-input",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <input 
          type="${this.getAttribute("type") || ""}" 
          value="${this.getAttribute("value") || ""}" 
        />
      `;

      this.addEventListener("change", e => {
        const event = new CustomEvent("data-change", {
          bubbles: true,
          detail: {
            id: this.getAttribute("name"),
            value: e.target.value
          }
        });
        this.dispatchEvent(event);
      });

      const event = new CustomEvent("data-init", {
        bubbles: true,
        detail: {
          id: this.getAttribute("name"),
          value: this.getAttribute("value") || ""
        }
      });

      this.dispatchEvent(event);
    }
  }
);

customElements.define(
  "data-group",
  class extends HTMLElement {
    onChange({ id, value }) {
      this._data = {
        ...this._data,
        [id]: value
      };
    }
    onInit(input) {
      this.onChange(input);
    }
    getData() {
      return this._data;
    }
    connectedCallback() {
      this.addEventListener("data-init", e => {
        const {
          detail: { id, value }
        } = e;

        // e.stopPropagation();
        console.log("data-init", { id, value });
        this.onInit({ id, value });
      });

      this.addEventListener("data-change", e => {
        if (e.target !== e.currentTarget) {
          e.stopPropagation();

          const {
            detail: { id, value }
          } = e;

          this.onChange({ id, value });

          if (this.getAttribute("bubbles") !== "false") {
            const event = new CustomEvent("data-change", {
              bubbles: true,
              detail: {
                id: this.getAttribute("name"),
                value: this.getData()
              }
            });
            this.dispatchEvent(event);
          }
        }

        // console.log("data-change", { id, value });
      });
    }
  }
);

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
