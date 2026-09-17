import {getChatGPTUser} from '../../../chatgpt-auth';
import {bindings,getWorkshopAccess,listWorkLogsForEmail,staffMemberForEmail} from '../../../server';
import {validateWorkLog} from '../../../validation';

export async function GET(){
  const user=await getChatGPTUser();if(!user)return Response.json({error:'Ingresá para continuar.'},{status:401});
  const access=await getWorkshopAccess(user.email);if(!access||!['admin','assistant'].includes(access.role))return Response.json({error:'Acceso no permitido.'},{status:403});
  return Response.json({logs:await listWorkLogsForEmail(user.email)},{headers:{'Cache-Control':'no-store'}});
}

export async function POST(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:'Ingresá para continuar.'},{status:401});
  const access=await getWorkshopAccess(user.email);if(!access||!['admin','assistant'].includes(access.role))return Response.json({error:'Acceso no permitido.'},{status:403});
  const staff=await staffMemberForEmail(user.email);if(!staff)return Response.json({error:'Tu mail todavía no está vinculado a una ficha de equipo.'},{status:400});
  try{const input=validateWorkLog({...await request.json(),staff_id:staff.id,status:'pending'}),now=new Date().toISOString(),id=crypto.randomUUID();await bindings().DB.prepare('INSERT INTO work_logs (id,staff_id,work_date,start_time,end_time,hours,hourly_rate,status,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(id,staff.id,input.work_date,input.start_time,input.end_time,input.hours,input.hourly_rate,'pending',input.notes,now,now).run();return Response.json({id})}catch(e){return Response.json({error:e instanceof TypeError?e.message:'No pudimos guardar tus horas.'},{status:e instanceof TypeError?400:500})}
}
