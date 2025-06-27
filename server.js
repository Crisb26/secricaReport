const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const usuariosFile = "./usuarios.json";

// Ruta para obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
    fs.readFile(usuariosFile, "utf8", (err, data) => {
        if (err) {
            console.error("Error leyendo usuarios.json", err);
            return res.status(500).json({ error: "No se pudo cargar la lista de usuarios" });
        }

        const usuarios = JSON.parse(data);
        res.json(usuarios);
    });
});

// Ruta para login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usuariosFile, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer usuarios.json", err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        const usuarios = JSON.parse(data).usuarios;
        const usuario = usuarios.find(u => u.email === email);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const claveValida = password === usuario.password || bcrypt.compareSync(password, usuario.password);

        if (!claveValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        return res.json({ usuario: usuario.username });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
