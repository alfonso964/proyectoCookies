'use server'
import { redirect } from "next/navigation";
import { deleteCookie, setCookie } from "@/lib/cookies";
import fs from 'fs/promises';
import path from 'path';


const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

export async function login(formData) {
  const LOGIN_URL = '/'

  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('key') 
  const callbackUrl = formData.get('callbackUrl') || LOGIN_URL

  try {
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const usuarios = JSON.parse(usersData);

    // Comprobar si credenciales son válidas
    const usuarioEncontrado = usuarios.find(usuario => 
      usuario.nombre === name && 
      usuario.password === password
    )

    if (!usuarioEncontrado) {
      console.log('Credenciales incorrectas');
      return; 
    }

    // Si hay autenticación correcta, creamos cookie de sesión
    await setCookie('session', { 
      name: usuarioEncontrado.nombre, 
      email: usuarioEncontrado.email 
    })

    redirect(callbackUrl);
    
  } catch (error) {
    console.error('Error en login:', error);
    return; 
  }
}


export async function logout() {
  await deleteCookie('session')
  redirect('/?' + Math.random())
}