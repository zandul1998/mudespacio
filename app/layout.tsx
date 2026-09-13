import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
export async function generateMetadata():Promise<Metadata>{
 const h=await headers();const host=h.get('host')||'localhost:3000';const origin=(host.startsWith('localhost')?'http://':'https://')+host;
 return {title:'Mud Espacio · Cerámica en Wilde',description:'Un espacio para aprender, explorar y crear con las manos. Clases de cerámica en Wilde y merch propia por encargo.',openGraph:{title:'Mud Espacio · Un ratito para vos',description:'Las manos en el barro. Cerámica y merch en Wilde.',locale:'es_AR',images:[{url:origin+'/og.png',width:1733,height:908}]},twitter:{card:'summary_large_image',images:[origin+'/og.png']}};
}
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es-AR"><body>{children}</body></html>}

