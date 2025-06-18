// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  doc, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZEVISZuRfn1iC3be5b7xTMQiCZubXyTU",
  authDo
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const alumnosRef = collection(db, "alumnos");

let modoEdicion = false;
let idActual = "";

// Guardar o actualizar alumno
const form = document.getElementById("alumnoForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: form.nombre.value,
    edad: parseInt(form.edad.value),
    carrera: form.carrera.value,
    materias: form.materias.value.split(",").map(m => m.trim()),
    contacto: {
      email: form.email.value,
      telefono: form.telefono.value
    }
  };

  if (modoEdicion) {
    const alumnoDoc = doc(db, "alumnos", idActual);
    await updateDoc(alumnoDoc, datos);
    modoEdicion = false;
    idActual = "";
    form.querySelector("button").textContent = "Guardar";
  } else {
    await addDoc(alumnosRef, datos);
  }

  form.reset();
  mostrarAlumnos();
});

// Mostrar alumnos
async function mostrarAlumnos() {
  const contenedor = document.getElementById("listaAlumnos");
  contenedor.innerHTML = "";
  const snapshot = await getDocs(alumnosRef);

  snapshot.forEach((docu) => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p><strong>Edad:</strong> ${data.edad}</p>
      <p><strong>Carrera:</strong> ${data.carrera}</p>
      <p><strong>Materias:</strong> ${data.materias.join(", ")}</p>
      <p><strong>Email:</strong> ${data.contacto.email}</p>
      <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
      <button onclick="editarAlumno('${docu.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">Editar</button>
      <button onclick="eliminarAlumno('${docu.id}')">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

// Eliminar
window.eliminarAlumno = async (id) => {
  await deleteDoc(doc(db, "alumnos", id));
  mostrarAlumnos();
};

// Editar
window.editarAlumno = (id, datos) => {
  form.nombre.value = datos.nombre;
  form.edad.value = datos.edad;
  form.carrera.value = datos.carrera;
  form.materias.value = datos.materias.join(", ");
  form.email.value = datos.contacto.email;
  form.telefono.value = datos.contacto.telefono;
  idActual = id;
  modoEdicion = true;
  form.querySelector("button").textContent = "Actualizar";
};

mostrarAlumnos();
