'use server'
import { redirect } from "next/navigation";
import { deleteCookie, setCookie } from "@/lib/cookies";
import fs from 'fs/promises';
import path from 'path';

// Ruta CORREGIDA al archivo users.json
const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

export async function login(formData) {
  const LOGIN_URL = '/'

  // Obtener usuario datos del formulario
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('key') // El campo se llama 'key' en el formulario
  const callbackUrl = formData.get('callbackUrl') || LOGIN_URL

  try {
    // Leer el archivo users.json
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const usuarios = JSON.parse(usersData);

    // Comprobar si credenciales son válidas
    const usuarioEncontrado = usuarios.find(usuario => 
      usuario.nombre === name && 
      usuario.password === password
    )

    if (!usuarioEncontrado) {
      console.log('Credenciales incorrectas');
      return; // No redirige, muestra el mismo formulario
    }

    // Si hay autenticación correcta, creamos cookie de sesión
    await setCookie('session', { 
      name: usuarioEncontrado.nombre, 
      email: usuarioEncontrado.email 
    })

    redirect(callbackUrl);
    
  } catch (error) {
    console.error('Error en login:', error);
    return; // En caso de error, no redirige
  }
}

// El logout permanece igual
export async function logout() {
  deleteCookie('session')
  redirect('/?' + Math.random())
}