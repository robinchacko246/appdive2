const contactForm = document.querySelector("#contact-form");
const contactBtn = document.querySelector("#contact-btn");
const contactStatus = document.querySelector("#contact-status");

function setStatus(color, message) {
  contactStatus.innerHTML =
    "<h3 style='color:" + color + "'>" + message + "</h3>";
}

function sendMail(name, email, subject, message) {
  fetch("https://formsubmit.co/ajax/peter@divernowapp.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      subject: subject,
      message: message,
    }),
  })
    .then(function (response) {
      response.json();
    })
    .then(function (data) {
      setStatus("lightgreen", "Message sent");
      contactBtn.removeAttribute("disabled");
    })
    .catch(function (error) {
      setStatus("red", "Unable to send message");
      contactBtn.removeAttribute("disabled");
    });
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  contactBtn.setAttribute("disabled", true);
  setStatus("cyan", "Sending message");
  const name = e.target.name.value;
  const email = e.target.email.value;
  const subject = e.target.subject.value;
  const message = e.target.message.value;

  if (name.length === 0) {
    contactBtn.removeAttribute("disabled");
    return setStatus("yellow", "Name is required");
  }
  if (email.length === 0) {
    contactBtn.removeAttribute("disabled");
    return setStatus("yellow", "Email is required");
  }
  if (subject.length === 0) {
    contactBtn.removeAttribute("disabled");
    return setStatus("yellow", "Subject is required");
  }
  if (message.length === 0) {
    contactBtn.removeAttribute("disabled");
    return setStatus("yellow", "Message is required");
  }

  return sendMail(name, email, subject, message);
});
