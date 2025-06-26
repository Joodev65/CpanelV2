
const session = JSON.parse(localStorage.getItem("login"));
if (!session || !session.email || !session.role) {
  location.href = "index.html";
}
