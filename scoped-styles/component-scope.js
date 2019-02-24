export class CustomElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./component-scope.css";
    shadow.appendChild(link);

    // const slot = document.createElement("slot");
    // shadow.appendChild(slot);
  }

  connectedCallback() {
    for (const child of this.children) {
      this.shadowRoot.appendChild(child.cloneNode(true));
    }
  }
}

customElements.define("component-scope", CustomElement);
