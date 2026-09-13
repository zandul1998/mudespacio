import {env} from 'cloudflare:workers';
import {getChatGPTUser} from './chatgpt-auth';
import type {Product} from './shared';
export function bindings(){return env as unknown as {DB:D1Database;PRODUCT_IMAGES:R2Bucket;ADMIN_EMAIL?:string}}
export async function isAdmin(){const user=await getChatGPTUser();const email=bindings().ADMIN_EMAIL;return !!(user&&email&&user.email.toLowerCase()===email.trim().toLowerCase())}
export async function guard(request:Request){if(!await isAdmin())return Response.json({error:'Necesitás ingresar con la cuenta administradora.'},{status:403});if(request.method!=='GET'&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origen no permitido.'},{status:403});return null}
export async function database(){const db=bindings().DB;if(!db)throw Error('Database unavailable');await db.prepare("CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', price INTEGER, variants TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'order', published INTEGER NOT NULL DEFAULT 0, image TEXT NOT NULL DEFAULT '', sort INTEGER NOT NULL DEFAULT 0)").run();return db}
export async function listProducts(admin=false){const db=await database();const {results}=await db.prepare(admin?'SELECT * FROM products ORDER BY sort, name':'SELECT * FROM products WHERE published=1 ORDER BY sort, name').all<Product>();return results}

