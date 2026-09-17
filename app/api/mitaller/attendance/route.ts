import {getChatGPTUser} from '../../../chatgpt-auth';
import {bindings,getWorkshopAccess} from '../../../server';

const scheduleLabel="(CASE s.day WHEN 1 THEN 'Lunes' WHEN 2 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 6 THEN 'Sábado' ELSE 'Domingo' END || ' ' || s.start || '-' || s.end)";
const writableRoles=['admin','assistant','team'];
const readableRoles=['admin','assistant','team','readonly'];
const validDate=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v);
const validPeriod=(v:string)=>/^\d{4}-\d{2}$/.test(v);
async function access(request:Request,write=false){
  const user=await getChatGPTUser();if(!user)return {error:Response.json({error:'Ingresá para continuar.'},{status:401})};
  const role=await getWorkshopAccess(user.email);if(!role||!(write?writableRoles:readableRoles).includes(role.role))return {error:Response.json({error:'Acceso no permitido.'},{status:403})};
  if(write&&request.headers.get('origin')!==new URL(request.url).origin)return {error:Response.json({error:'Origen no permitido.'},{status:403})};
  return {user,role};
}
async function ensureSessions(period:string){
  const db=bindings().DB,[year,month]=period.split('-').map(Number),now=new Date().toISOString();
  const {results:schedules}=await db.prepare('SELECT id,day FROM schedules WHERE published=1 ORDER BY day,start').all<{id:string;day:number}>();
  const {results:closures}=await db.prepare('SELECT date FROM closure_days WHERE date LIKE ?').bind(period+'%').all<{date:string}>();
  const closed=new Set(closures.map(c=>c.date)),days=new Date(year,month,0).getDate();
  for(let d=1;d<=days;d++){
    const date=`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if(closed.has(date))continue;
    const weekDay=new Date(year,month-1,d).getDay();
    for(const s of schedules.filter(s=>s.day===weekDay))await db.prepare("INSERT OR IGNORE INTO class_sessions (id,schedule_id,date,status,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").bind(crypto.randomUUID(),s.id,date,'scheduled','Generada automáticamente para planilla de Mi Taller.',now,now).run();
  }
}
export async function GET(request:Request){
  const a=await access(request);if(a.error)return a.error;
  const url=new URL(request.url),period=url.searchParams.get('period')||new Date().toISOString().slice(0,7);
  if(!validPeriod(period))return Response.json({error:'Mes inválido.'},{status:400});
  const db=bindings().DB;await ensureSessions(period);
  const {results:sessions}=await db.prepare(`SELECT cs.*, ${scheduleLabel} AS schedule_label, st.name AS teacher_name, s.start, s.end FROM class_sessions cs JOIN schedules s ON s.id=cs.schedule_id LEFT JOIN staff_members st ON st.id=s.teacher_id WHERE cs.date LIKE ? AND cs.status!='cancelled' ORDER BY cs.date,s.day,s.start`).bind(period+'%').all<any>();
  const scheduleIds=[...new Set(sessions.map(s=>s.schedule_id))];
  if(!scheduleIds.length)return Response.json({period,classes:[]},{headers:{'Cache-Control':'no-store'}});
  const marks=scheduleIds.map(()=>'?').join(',');
  const {results:students}=await db.prepare(`SELECT ss.schedule_id, stu.id, stu.name, stu.status FROM student_schedules ss JOIN students stu ON stu.id=ss.student_id WHERE ss.schedule_id IN (${marks}) AND stu.status!='inactive' ORDER BY stu.name`).bind(...scheduleIds).all<any>();
  const sessionIds=sessions.map(s=>s.id),sessionMarks=sessionIds.map(()=>'?').join(',');
  const {results:records}=sessionIds.length?await db.prepare(`SELECT * FROM attendance_records WHERE session_id IN (${sessionMarks})`).bind(...sessionIds).all<any>():{results:[] as any[]};
  const bySchedule=Object.groupBy(students,s=>s.schedule_id),bySessionStudent=new Map(records.map(r=>[r.session_id+'|'+r.student_id,r]));
  return Response.json({period,canWrite:writableRoles.includes(a.role!.role),role:a.role!.role,classes:sessions.map(s=>({...s,students:(bySchedule[s.schedule_id]||[]).map(st=>({...st,attendance:bySessionStudent.get(s.id+'|'+st.id)||null}))}))},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request){
  const a=await access(request,true);if(a.error)return a.error;
  try{
    const p=await request.json() as {session_id?:string;student_id?:string;status?:string;grant_credit?:boolean;notes?:string};
    if(!p.session_id||!p.student_id||!/^[0-9a-f-]{36}$/.test(p.session_id)||!/^[0-9a-f-]{36}$/.test(p.student_id))return Response.json({error:'Registro inválido.'},{status:400});
    if(!['present','absent','notice','late','cancelled'].includes(p.status||''))return Response.json({error:'Estado inválido.'},{status:400});
    const db=bindings().DB,now=new Date().toISOString();
    const session=await db.prepare('SELECT cs.date,s.start FROM class_sessions cs JOIN schedules s ON s.id=cs.schedule_id JOIN student_schedules ss ON ss.schedule_id=s.id WHERE cs.id=? AND ss.student_id=? LIMIT 1').bind(p.session_id,p.student_id).first<{date:string;start:string}>();
    if(!session)return Response.json({error:'La alumna no pertenece a esa clase.'},{status:404});
    const existing=await db.prepare('SELECT id,credit_id FROM attendance_records WHERE session_id=? AND student_id=? LIMIT 1').bind(p.session_id,p.student_id).first<{id:string;credit_id:string|null}>();
    const id=existing?.id||crypto.randomUUID();let creditId=existing?.credit_id||null;
    if(p.grant_credit&&p.status!=='present'&&p.status!=='cancelled'&&!creditId){
      creditId=crypto.randomUUID();
      const expires=new Date(new Date(`${session.date}T${session.start}:00`).getTime()+60*24*36e5).toISOString().slice(0,10);
      await db.prepare("INSERT INTO recovery_credits (id,student_id,source_attendance_id,status,expires_at,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)").bind(creditId,p.student_id,id,'available',validDate(expires)?expires:'','Crédito otorgado manualmente desde Mi Taller.',now,now).run();
    }
    if((!p.grant_credit||p.status==='present'||p.status==='cancelled')&&creditId){
      await db.prepare("UPDATE recovery_credits SET status='void',updated_at=? WHERE id=? AND status='available'").bind(now,creditId).run();
      creditId=null;
    }
    await db.prepare('INSERT INTO attendance_records (id,session_id,student_id,status,notice_at,credit_id,recovery_credit_used_id,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,notice_at=excluded.notice_at,credit_id=excluded.credit_id,notes=excluded.notes,updated_at=excluded.updated_at').bind(id,p.session_id,p.student_id,p.status,now,creditId,null,(p.notes||'').slice(0,800),now,now).run();
    return Response.json({id,credit_id:creditId});
  }catch{return Response.json({error:'No pudimos guardar la asistencia.'},{status:500})}
}
