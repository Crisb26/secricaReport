const API_KEY = 'AIzaSyBfHC2hvJ45NvzgOwss7mamX7Jh8v_LSF8';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generarContenidoIA(textoUsuario) {
  const body = {
    contents: [
      { parts: [{ text: textoUsuario }] }
    ]
  };
  const url = `${BASE_URL}?key=${API_KEY}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  return data.candidates?.[0]?.output || 'Error al generar IA';
}
