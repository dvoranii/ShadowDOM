// create namespace for template element
const template = document.createElement("template");

// HTML content of template
template.innerHTML = `
<link rel="stylesheet" href="index.css">
<style>
#toggle:hover, #greet:hover{
    cursor: pointer;
}
#toggle, #greet{
    transition: all 0.5s ease;
}

#toggle:hover{
    background-color:black;
}
#greet:hover{
    background-color:purple;
}
</style>
<div class="pet-card">
    <div class="avatar">
        <img/>
    </div>
    <div class="details">
    <h2></h2>
    <div class="info">
        <p>Breed: <slot name="breed"/></p>
        <p>Age: <slot name="age"/></p>
    </div>
    <div class="actions">
        <button id="greet">Say Hi!</button>
        <button id="toggle">View Details</button>
    </div>
    </div>
</div>


`;

class PetCard extends HTMLElement {
  constructor() {
    super();
    this.showInfo = false;
    // allows us to update the shadow DOM
    this.attachShadow({ mode: "open" });
    // get content of template, clone it and append to shadow root
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // in order to make sure we always get updated data from the attributeChangeCallback function we need to use a static getter

  static get observedAttributes() {
    return ["name", "avatar"];
  }

  //   setting the template content with shadowroot
  attributeChangedCallback(name, oldVal, newVal) {
    this.shadowRoot.querySelector(".details h2").innerText =
      this.getAttribute("name");
    this.shadowRoot.querySelector(".avatar img").src =
      this.getAttribute("avatar");
    this.shadowRoot.querySelector(".avatar img").alt =
      this.getAttribute("name");
  }

  //   in order to add event listeners to our button we need to ensure that our custom element is completely mounted into our DOM

  toggleInfo = () => {
    this.showInfo = !this.showInfo;
    this.shadowRoot.querySelector(".info").style.display = this.showInfo
      ? "block"
      : "none";
    this.shadowRoot.querySelector("#toggle").innerHTML = this.showInfo
      ? "Hide Details"
      : "Show Details";

    //   hover state for buttons are handled in the style tag of the template
  };

  //   handles the actual events

  connectedCallback() {
    this.shadowRoot
      .querySelector("#toggle")
      .addEventListener("click", this.toggleInfo);
    this.shadowRoot.querySelector("#greet").addEventListener("click", () => {
      alert("Hi there " + this.getAttribute("name"));
    });
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#toggle")
      .removeEventListener("click", this.toggle);
    this.shadowRoot.querySelector("#greet").removeEventListener("click");
  }
}

window.customElements.define("pet-card", PetCard);
