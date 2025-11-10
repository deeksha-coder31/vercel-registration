const statusEl = document.getElementById("status");
const btn = document.getElementById("submitBtn");

function setError(id, msg) {
  document.getElementById(id).textContent = msg || "";
}

function validate() {
  let ok = true;

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const course = document.getElementById("course").value.trim();

  setError("err-fullname", "");
  setError("err-email", "");
  setError("err-phone", "");
  setError("err-course", "");

  if (fullname.length < 2) { setError("err-fullname","Enter a valid name"); ok=false; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setError("err-email","Enter a valid email"); ok=false; }
  if (!/^\d{10}$/.test(phone)) { setError("err-phone","Enter 10-digit phone"); ok=false; }
  if (!course) { setError("err-course","Select a course"); ok=false; }

  return ok;
}

document.getElementById("regForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  if (!validate()) return;

  btn.disabled = true;
  btn.textContent = "Submitting...";

  const payload = {
    fullname: document.getElementById("fullname").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    course: document.getElementById("course").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      statusEl.style.color = "#065f46";
      statusEl.textContent = "Submitted! Your registration is saved ✅";
      e.target.reset();
    } else {
      statusEl.style.color = "#b91c1c";
      statusEl.textContent = data.error || "Submission failed";
    }
  } catch (err) {
    statusEl.style.color = "#b91c1c";
    statusEl.textContent = "Network error. Try again.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit";
  }
});
