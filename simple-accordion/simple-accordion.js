customElements.define(
  "simple-accordion",
  class extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <style>
          :host {
            --background-color: transparent;
            --padding: none;
            
            display: block;
          }

          input, slot {
            display: none; 
          }

          label {
            display: block;
            cursor: pointer;
            background: var(--background-color);
            padding: var(--padding);
          }

          input:checked ~ slot {
            display: block;
          }
          
          label::before {
            content: '+';
            margin-right: .4em;
          }

          input:checked ~ label::before {
            content: '-';
            margin-right: .4em;
          }


          slot {
            padding: var(--padding);
          }
        </style>

        <input 
          id="checkbox" 
          type="checkbox" 
          ${this.getAttribute("open") === "true" ? "checked" : ""} 
        />
        <label for="checkbox">${this.getAttribute("name")}</label>
        <slot id="content"></slot>
      `;
    }
  }
);
