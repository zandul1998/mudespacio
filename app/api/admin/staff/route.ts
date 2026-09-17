import {bindings,guard,listStaffMembers} from '../../../server';
import {validateStaffMember} from '../../../validation';

export async function GET(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{return Response.json({staff:await listStaffMembers(new URL(request.url).searchParams.get('kind')||undefined)},{headers:{'Cache-Control':'no-store'}})}
  catch{return Response.json({error:'No pudimos cargar el equipo.'},{status:503})}
}

export async function POST(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    if(Number(request.headers.get('content-length')||0)>9000)return Response.json({error:'El contenido es demasiado largo.'},{status:413});
    const input=validateStaffMember(await request.json()),db=bindings().DB,id=input.id||crypto.randomUUID(),now=new Date().toISOString();
    const existing=input.id?await db.prepare('SELECT id FROM staff_members WHERE id=?').bind(id).first():null;
    if(input.id&&!existing)return Response.json({error:'Esa persona ya no existe.'},{status:404});
    await db.prepare('INSERT INTO staff_members (id,name,email,phone,kind,status,pay_mode,hourly_rate,monthly_amount,percentage,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,phone=excluded.phone,kind=excluded.kind,status=excluded.status,pay_mode=excluded.pay_mode,hourly_rate=excluded.hourly_rate,monthly_amount=excluded.monthly_amount,percentage=excluded.percentage,notes=excluded.notes,updated_at=excluded.updated_at').bind(id,input.name,input.email,input.phone,input.kind,input.status,input.pay_mode,input.hourly_rate,input.monthly_amount,input.percentage,input.notes,now,now).run();
    return Response.json({id});
  }catch(e){return Response.json({error:e instanceof TypeError?e.message:'No pudimos guardar la ficha.'},{status:e instanceof TypeError?400:500})}
}

export async function DELETE(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    const id=new URL(request.url).searchParams.get('id')||'';if(!/^[0-9a-f-]{36}$/.test(id))return Response.json({error:'Persona inválida.'},{status:400});
    await bindings().DB.prepare('UPDATE schedules SET teacher_id=NULL WHERE teacher_id=?').bind(id).run();
    const result=await bindings().DB.prepare('DELETE FROM staff_members WHERE id=?').bind(id).run();
    if(!result.meta.changes)return Response.json({error:'Esa persona ya no existe.'},{status:404});
    return Response.json({ok:true});
  }catch{return Response.json({error:'No pudimos eliminar la ficha.'},{status:500})}
}
