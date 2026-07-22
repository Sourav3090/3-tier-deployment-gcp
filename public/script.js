let editId = null;
let users = [];

const form = document.getElementById("studentForm");
const search = document.getElementById("search");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (editId) {

        await fetch("/update/" + editId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email
            })
        });

        alert("Student Updated Successfully");

        editId = null;

        document.getElementById("saveBtn").innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Save Student';

    } else {

        await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email
            })
        });

        alert("Student Added Successfully");

    }

    form.reset();

    loadUsers();

});

async function loadUsers() {

    const res = await fetch("/users");

    users = await res.json();

    renderTable(users);

}

function renderTable(data) {

    let html = "";

    data.forEach(user => {

        html += `
        <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>

                <button class="btn btn-edit"
                onclick="editUser('${user._id}')">

                <i class="fa-solid fa-pen"></i>

                </button>

                <button class="btn btn-delete"
                onclick="deleteUser('${user._id}')">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("users").innerHTML = html;

    document.getElementById("totalStudents").innerText = data.length;

}

async function editUser(id) {

    const res = await fetch("/user/" + id);

    const user = await res.json();

    document.getElementById("name").value = user.name;

    document.getElementById("email").value = user.email;

    editId = id;

    document.getElementById("saveBtn").innerHTML =
        '<i class="fa-solid fa-pen"></i> Update Student';

}

async function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this student?"))
        return;

    await fetch("/delete/" + id, {
        method: "DELETE"
    });

    loadUsers();

}

search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );

    renderTable(filtered);

});

loadUsers();
