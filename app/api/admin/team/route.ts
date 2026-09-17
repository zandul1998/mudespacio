import {bindings,guard,listTeamMembers} from '../../../server';
import {validateTeamMember} from '../../../validation';

export async function GET(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{return Response.json({members:await listTeamMembers()},{headers:{'Cache-Control':'no-store'}})}
  catch{return Response.json({error:'No pudimos cargar los accesos.'},{status:503})}
}

export async function POST(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    if(Number(request.headers.get('content-length')||0)>6000)return Response.json({error:'El contenido es demasiado largo.'},{status:413});
    const input=validateTeamMember(await request.json());
    const db=bindings().DB,id=input.id||crypto.randomUUID(),now=new Date().toISOString();
    const existingByEmail=await db.prepare('SELECT id FROM team_members WHERE email=? AND id!=? LIMIT 1').bind(input.email,id).first();
    if(existingByEmail)return Response.json({error:'Ese mail ya tiene un acceso cargado.'},{status:409});
    const existing=input.id?await db.prepare('SELECT id FROM team_members WHERE id=?').bind(id).first():null;
    if(input.id&&!existing)return Response.json({error:'Ese acceso ya no existe.'},{status:404});
    await db.prepare("INSERT INTO team_members (id,email,name,role,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name,role=excluded.role,active=excluded.active,updated_at=excluded.updated_at").bind(id,input.email,input.name,input.role,input.active,now,now).run();
    return Response.json({id});
  }catch(e){return Response.json({error:e instanceof TypeError?e.message:'No pudimos guardar el acceso.'},{status:e instanceof TypeError?400:500})}
}

export async function DELETE(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    const id=new URL(request.url).searchParams.get('id')||'';
    if(!/^[0-9a-f-]{36}$/.test(id))return Response.json({error:'Acceso inválido.'},{status:400});
    const result=await bindings().DB.prepare('DELETE FROM team_members WHERE id=?').bind(id).run();
    if(!result.meta.changes)return Response.json({error:'Ese acceso ya no existe.'},{status:404});
    return Response.json({ok:true});
  }catch{return Response.json({error:'No pudimos eliminar el acceso.'},{status:500})}
}
