import {listProducts} from '../../server';
export async function GET(){try{return Response.json({products:await listProducts()},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'No pudimos cargar el catálogo.'},{status:503})}}
