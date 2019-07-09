window.addEventListener("form-submit", e => {
  console.log("form-submit", e.detail);
  document.getElementById("preview").innerHTML = JSON.stringify(e.detail);
});

window.addEventListener("form-change", e => {
  console.log("form-change", e.detail);
});
