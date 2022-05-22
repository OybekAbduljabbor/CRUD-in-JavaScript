const QUERY = (param) => document.querySelector(param);

const Send = QUERY("#form-add");
const DataStudents = QUERY("#card-students");
const surname = QUERY("#surname");
const ism = QUERY("#name");
const tel = QUERY("#tel");
const grup = QUERY("#grup");
const img = QUERY("#img");
const message = QUERY("#alert-message");
const ServerMessage = QUERY("#message-is-server");
const loading = QUERY("#loading");
const submit_btn = QUERY("#submit-btn");

GetStudents();

const Data = [];
let studentID = 0;

console.log(Data);

Send.addEventListener("submit", (e) => {
  e.preventDefault();

  loading.classList.add("show-loading");

  const MyData = {
    id: studentID,
    surname: surname.value,
    name: ism.value,
    tel: tel.value,
    grup: grup.value,
    data: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  if (submit_btn.value === "Add Student") {
    const formData = new FormData();
    formData.append("img", img.files[0]);
    formData.append("data", JSON.stringify(MyData));

    axios("https://uitc.my-api.uz/students", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        loading.classList.remove("show-loading");
        if (res.data.status) {
          ServerMessage.innerHTML = res.data.message;
          message.classList.add("show-alert");
          ServerMessage.innerHTML = res.data.message;
          GetStudents();
        } else {
          ServerMessage.innerHTML = res.data.message;
          message.classList.add("show-alert");
        }
        setTimeout(() => {
          message.classList.remove("show-alert");
        }, 3500);
      })
      .catch((err) => {
        console.log(err);
        ServerMessage.innerHTML = res.data.message;
        setTimeout(() => {
          message.classList.remove("show-alert");
        }, 3500);
      });
    ClearValueInput();
  } else {
    axios("https://uitc.my-api.uz/update_student", {
      method: "POST",
      data: MyData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.data.status) {
          ServerMessage.innerHTML = res.data.message;
          message.classList.add("show-alert");
          GetStudents();
        } else {
          ServerMessage.innerHTML = res.data.message;
          message.classList.add("show-alert");
        }
        loading.classList.remove("show-loading");
        setTimeout(() => {
          message.classList.remove("show-alert");
        }, 3500);
      })
      .catch((err) => {
        console.log(err);
      });
    ClearValueInput();
  }
});

function DeleteStudent(id) {
  loading.classList.add("show-loading");
  axios("https://uitc.my-api.uz/delete_student", {
    method: "POST",
    data: { id: id },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.data.status) {
        message.classList.add("show-alert");
        ServerMessage.innerHTML = res.data.message;
        setTimeout(() => {
          GetStudents();
        }, 300);
        loading.classList.remove("show-loading");
        setTimeout(() => {
          message.classList.remove("show-alert");
        }, 3500);
      } else {
        message.classList.add("show-alert");
        ServerMessage.innerHTML = res.data.message;
        loading.classList.remove("show-loading");
        setTimeout(() => {
          message.classList.remove("show-alert");
        }, 3500);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function UpdateStudent(id) {
  loading.classList.add("show-loading");
  Data.map((item) => {
    if (item.id == id) {
      surname.value = item.surname;
      ism.value = item.name;
      tel.value = item.tel;
      grup.value = item.grup;
    }
  });

  studentID = id;

  submit_btn.value = "Update";
  setTimeout(() => {
    loading.classList.remove("show-loading");
  }, 400);
}

function Students(params) {
  return params.map((item, index) => {
    return `
     <div id="student">
        <figure>
          <img src=${item.img} alt="" />
        </figure>
        <div id="student-info">
          <div id="student-about">
            <h3>
              <span>${item.name}</span>
              <span>${item.surname}</span>
            </h3>
            <h4>${item.grup}</h4>
            <h4>${item.tel}</h4>
          </div>
          <div id="student-edit">
            <button onclick="DeleteStudent('${item.id}')">Delete</button>
            <button onclick="UpdateStudent('${item.id}')">Update</button>
          </div>
        </div>
      </div>
    `;
  });
}

function GetStudents() {
  fetch("https://uitc.my-api.uz/students")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      DataStudents.innerHTML = Students(data).join("");
      Data.push(...data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function ClearValueInput() {
  surname.value = "";
  ism.value = "";
  tel.value = "";
  grup.value = "";
  img.value = "";
  submit_btn.value = "Add Student";
}
