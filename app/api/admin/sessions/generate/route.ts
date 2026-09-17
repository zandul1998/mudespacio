import {bindings,guard} from '../../../../server';

const validDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value);
export async function POST(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{
    const body=await request.json() as {period?:string;skip_dates?:string[];published_only?:boolean};
    const period=(body.period||'').trim();
    if(!/^\d{4}-\d{2}$/.test(period))return Response.json({error:'Elegí un mes válido.'},{status:400});
    const skip=new Set((body.skip_dates||[]).filter(validDate));
    const [year,month]=period.split('-').map(Number),db=bindings().DB,now=new Date().toISOString();
    const {results:schedules}=await db.prepare(`${body.published_only===false?'SELECT id,day FROM schedules':'SELECT id,day FROM schedules WHERE published=1'} ORDER BY day,start`).all<{id:string;day:number}>();
    let created=0,skipped=0;
    const days=new Date(year,month,0).getDate();
    for(let day=1;day<=days;day++){
      const local=new Date(year,month-1,day),date=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if(skip.has(date)){skipped++;continue}
      const weekDay=local.getDay();
      for(const schedule of schedules.filter(s=>s.day===weekDay)){
        const id=crypto.randomUUID();
        const result=await db.prepare("INSERT OR IGNORE INTO class_sessions (id,schedule_id,date,status,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").bind(id,schedule.id,date,'scheduled','Generada automáticamente desde la grilla fija.',now,now).run();
        if(result.meta.changes)created++;
      }
    }
    return Response.json({created,skipped_days:skipped});
  }catch{return Response.json({error:'No pudimos generar las clases del mes.'},{status:500})}
}
