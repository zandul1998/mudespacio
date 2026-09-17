import {bindings,guard,listStudents} from '../../../server';
import {validateStudent} from '../../../validation';
async function passwordHash(password:string,id:string){const bytes=new TextEncoder().encode(id+':'+password),hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')}

export async function GET(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{return Response.json({students:await listStudents()},{headers:{'Cache-Control':'no-store'}})}
  catch{return Response.json({error:'No pudimos cargar alumnas.'},{status:503})}
}

export async function POST(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    if(Number(request.headers.get('content-length')||0)>9000)return Response.json({error:'El contenido es demasiado largo.'},{status:413});
    const input=validateStudent(await request.json()),db=bindings().DB,id=input.id||crypto.randomUUID(),now=new Date().toISOString();
    const existing=input.id?await db.prepare('SELECT id FROM students WHERE id=?').bind(id).first():null;
    if(input.id&&!existing)return Response.json({error:'Esa alumna ya no existe.'},{status:404});
    const hash=input.portal_password?await passwordHash(input.portal_password,id):null;
    await db.prepare('INSERT INTO students (id,name,contact,email,instagram,family_group,status,notes,password_hash,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,contact=excluded.contact,email=excluded.email,instagram=excluded.instagram,family_group=excluded.family_group,status=excluded.status,notes=excluded.notes,password_hash=CASE WHEN excluded.password_hash!="" THEN excluded.password_hash ELSE students.password_hash END,updated_at=excluded.updated_at').bind(id,input.name,input.contact,input.email,input.instagram,input.family_group,input.status,input.notes,hash||'',now,now).run();
    await db.prepare('DELETE FROM student_schedules WHERE student_id=?').bind(id).run();
    for(const scheduleId of input.schedule_ids)await db.prepare('INSERT OR IGNORE INTO student_schedules (student_id,schedule_id,created_at) VALUES (?,?,?)').bind(id,scheduleId,now).run();
    return Response.json({id});
  }catch(e){return Response.json({error:e instanceof TypeError?e.message:'No pudimos guardar la alumna.'},{status:e instanceof TypeError?400:500})}
}

export async function DELETE(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    const id=new URL(request.url).searchParams.get('id')||'';if(!/^[0-9a-f-]{36}$/.test(id))return Response.json({error:'Alumna inválida.'},{status:400});
    await bindings().DB.prepare('DELETE FROM student_schedules WHERE student_id=?').bind(id).run();
    const result=await bindings().DB.prepare('DELETE FROM students WHERE id=?').bind(id).run();
    if(!result.meta.changes)return Response.json({error:'Esa alumna ya no existe.'},{status:404});
    return Response.json({ok:true});
  }catch{return Response.json({error:'No pudimos eliminar la alumna.'},{status:500})}
}
