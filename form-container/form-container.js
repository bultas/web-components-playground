customElements.define(
  "form-container",
  class extends HTMLElement {
    connectedCallback() {
      this.addEventListener("submit", e => {
        e.preventDefault();

        const data = [...new FormData(e.target)].reduce((acc, [key, val]) => {
          return {
            ...acc,
            [key]: val
          };
        }, {});

        const event = new CustomEvent("form-submit", {
          bubbles: true,
          detail: { id: e.target.id, data }
        });
        this.dispatchEvent(event);
      });

      this.addEventListener("change", e => {
        // TODO type="checkbox" have different behaviour
        // translate to [value, 'true'] || [value, 'false']

        const event = new CustomEvent("form-change", {
          bubbles: true,
          detail: {
            id: e.target.form.id,
            data: {
              [e.target.name]: e.target.value
            }
          }
        });
        this.dispatchEvent(event);

        e.target.classList.add("changed");
      });
    }
  }
);
