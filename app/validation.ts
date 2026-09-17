export function validateProduct(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;
const string=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const name=string('name',100);if(!name)throw new TypeError('Completá el nombre.');
const id=string('id',36);if(id&&!/^[0-9a-f-]{36}$/.test(id))throw new TypeError('Producto inválido.');
const description=string('description',2000),variants=string('variants',300),image=string('image',80),status=string('status',20);
if(image&&!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(image))throw new TypeError('Foto inválida.');
if(!['available','order','soldout'].includes(status))throw new TypeError('Elegí una disponibilidad.');
if(p.price!==null&&(!Number.isSafeInteger(p.price)||(p.price as number)<0||(p.price as number)>10000000000))throw new TypeError('Ingresá un precio válido.');
if(!Number.isSafeInteger(p.sort)||(p.sort as number)<0||(p.sort as number)>9999)throw new TypeError('El orden debe estar entre 0 y 9999.');
if(p.published!==0&&p.published!==1)throw new TypeError('Visibilidad inválida.');
return {id,name,description,variants,image,status,price:p.price as number|null,sort:p.sort as number,published:p.published as number};
}
export function imageType(bytes:Uint8Array){if(bytes.length<12)return null;if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return {ext:'jpg',mime:'image/jpeg'};if([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return {ext:'png',mime:'image/png'};if(String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return {ext:'webp',mime:'image/webp'};return null}
export function validateSchedule(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36);if(id&&!/^[0-9a-f-]{36}$/.test(id))throw new TypeError('Horario inválido.');
const start=str('start',5),end=str('end',5),status=str('status',20),note=str('note',160),teacher_id=typeof p.teacher_id==='string'?(p.teacher_id as string).trim():'';if(teacher_id&&!/^[0-9a-f-]{36}$/.test(teacher_id))throw new TypeError('Profe inválida.');
if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(end)||start>=end)throw new TypeError('Revisá el horario de inicio y fin.');
if(!Number.isInteger(p.day)||(p.day as number)<0||(p.day as number)>6)throw new TypeError('Elegí un día.');if(!['open','last','full','forming'].includes(status))throw new TypeError('Elegí un estado.');
if(!Number.isSafeInteger(p.sort)||(p.sort as number)<0||(p.sort as number)>9999)throw new TypeError('El orden debe estar entre 0 y 9999.');if(p.published!==0&&p.published!==1)throw new TypeError('Visibilidad inválida.');
const capacity=Number.isSafeInteger(p.capacity)&&(p.capacity as number)>0&&(p.capacity as number)<=30?p.capacity as number:8;
return {id,day:p.day as number,start,end,status,note,sort:p.sort as number,published:p.published as number,teacher_id,capacity};}
export function validateTeamMember(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36);if(id&&!/^[0-9a-f-]{36}$/.test(id))throw new TypeError('Acceso inválido.');
const email=str('email',180).toLowerCase(),name=str('name',100),role=str('role',20);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new TypeError('Ingresá un mail válido.');
if(!['admin','team','assistant','readonly'].includes(role))throw new TypeError('Elegí un rol.');
if(p.active!==0&&p.active!==1)throw new TypeError('Estado inválido.');
return {id,email,name,role:role as 'admin'|'team'|'assistant'|'readonly',active:p.active as number};
}
export function validateStudent(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36);if(id&&!/^[0-9a-f-]{36}$/.test(id))throw new TypeError('Alumna inválida.');
const name=str('name',120),contact=str('contact',80),email=str('email',180).toLowerCase(),instagram=str('instagram',80),family_group=str('family_group',120),status=str('status',20),notes=str('notes',1200),portal_password=typeof p.portal_password==='string'?(p.portal_password as string):'';
if(!name)throw new TypeError('Completá el nombre.');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new TypeError('Ingresá un mail válido.');if(!['active','paused','interested','inactive'].includes(status))throw new TypeError('Elegí un estado.');
if(portal_password&&portal_password.length<6)throw new TypeError('La contraseña del portal debe tener al menos 6 caracteres.');
const schedule_ids=Array.isArray(p.schedule_ids)?p.schedule_ids.filter(v=>typeof v==='string'&&/^[0-9a-f-]{36}$/.test(v as string)) as string[]:[];
return {id,name,contact,email,instagram,family_group,status:status as 'active'|'paused'|'interested'|'inactive',notes,schedule_ids:[...new Set(schedule_ids)],portal_password};
}
export function validateStaffMember(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36);if(id&&!/^[0-9a-f-]{36}$/.test(id))throw new TypeError('Persona inválida.');
const name=str('name',120),email=str('email',180).toLowerCase(),phone=str('phone',80),kind=str('kind',20),status=str('status',20),pay_mode=str('pay_mode',20),notes=str('notes',1200);
if(!name)throw new TypeError('Completá el nombre.');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new TypeError('Ingresá un mail válido.');
if(!['teacher','assistant','cleaning','cm','admin','other'].includes(kind))throw new TypeError('Elegí un tipo de equipo.');if(!['active','paused','inactive'].includes(status))throw new TypeError('Elegí un estado.');if(!['percentage','hourly','fixed','task','mixed'].includes(pay_mode))throw new TypeError('Elegí una modalidad de pago.');
const money=(key:string)=>p[key]===null||p[key]===''||p[key]===undefined?null:(Number.isSafeInteger(p[key])&&(p[key] as number)>=0&&(p[key] as number)<=10000000000?p[key] as number:null);
const hourly_rate=money('hourly_rate'),monthly_amount=money('monthly_amount');if((p.hourly_rate!==null&&p.hourly_rate!==''&&p.hourly_rate!==undefined)&&hourly_rate===null)throw new TypeError('Revisá el valor por hora.');if((p.monthly_amount!==null&&p.monthly_amount!==''&&p.monthly_amount!==undefined)&&monthly_amount===null)throw new TypeError('Revisá el monto mensual.');
const percentage=p.percentage===null||p.percentage===''||p.percentage===undefined?null:(Number.isInteger(p.percentage)&&(p.percentage as number)>=0&&(p.percentage as number)<=100?p.percentage as number:null);if((p.percentage!==null&&p.percentage!==''&&p.percentage!==undefined)&&percentage===null)throw new TypeError('Revisá el porcentaje.');
return {id,name,email,phone,kind:kind as 'teacher'|'assistant'|'cleaning'|'cm'|'admin'|'other',status:status as 'active'|'paused'|'inactive',pay_mode:pay_mode as 'percentage'|'hourly'|'fixed'|'task'|'mixed',hourly_rate,monthly_amount,percentage,notes};
}
const uuid=(value:string)=>/^[0-9a-f-]{36}$/.test(value);
export function validateClassSession(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),schedule_id=str('schedule_id',36),date=str('date',10),status=str('status',20),notes=str('notes',800);
if(id&&!uuid(id))throw new TypeError('Clase inválida.');if(!uuid(schedule_id))throw new TypeError('Elegí un horario.');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new TypeError('Elegí una fecha.');if(!['scheduled','completed','cancelled'].includes(status))throw new TypeError('Elegí un estado.');
return {id,schedule_id,date,status:status as 'scheduled'|'completed'|'cancelled',notes};
}
export function validateAttendanceRecord(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),session_id=str('session_id',36),student_id=str('student_id',36),status=str('status',20),notice_at=str('notice_at',25),notes=str('notes',800),recovery_credit_used_id=str('recovery_credit_used_id',36);
if(id&&!uuid(id))throw new TypeError('Asistencia inválida.');if(!uuid(session_id))throw new TypeError('Elegí una clase.');if(!uuid(student_id))throw new TypeError('Elegí una alumna.');if(!['present','notice','late','absent','cancelled'].includes(status))throw new TypeError('Elegí un estado.');if(recovery_credit_used_id&&!uuid(recovery_credit_used_id))throw new TypeError('Crédito inválido.');
return {id,session_id,student_id,status:status as 'present'|'notice'|'late'|'absent'|'cancelled',notice_at,notes,recovery_credit_used_id};
}
export function validateWaitlistEntry(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),student_id=str('student_id',36),schedule_id=str('schedule_id',36),status=str('status',20),source=str('source',120),notes=str('notes',800);
if(id&&!uuid(id))throw new TypeError('Registro inválido.');if(!uuid(student_id))throw new TypeError('Elegí una alumna.');if(!uuid(schedule_id))throw new TypeError('Elegí un horario.');if(!['interested','waiting','contacted','converted','archived'].includes(status))throw new TypeError('Elegí un estado.');
return {id,student_id,schedule_id,status:status as 'interested'|'waiting'|'contacted'|'converted'|'archived',source,notes};
}
const moneyValue=(p:Record<string,unknown>,key:string)=>Number.isSafeInteger(p[key])&&(p[key] as number)>=0&&(p[key] as number)<=10000000000?p[key] as number:null;
export function validateStudentPayment(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),student_id=str('student_id',36),schedule_id=str('schedule_id',36),type=str('type',20),status=str('status',20),period=str('period',7),paid_at=str('paid_at',10),method=str('method',80),notes=str('notes',800);
if(id&&!uuid(id))throw new TypeError('Pago inválido.');if(!uuid(student_id))throw new TypeError('Elegí una alumna.');if(schedule_id&&!uuid(schedule_id))throw new TypeError('Horario inválido.');if(!['monthly','deposit','single_class','product','other'].includes(type))throw new TypeError('Elegí un tipo de cobro.');if(!['pending','paid','partial','overdue','cancelled'].includes(status))throw new TypeError('Elegí un estado.');if(!/^\d{4}-\d{2}$/.test(period))throw new TypeError('Elegí un mes.');
const amount=moneyValue(p,'amount'),paid_amount=moneyValue(p,'paid_amount');if(amount===null)throw new TypeError('Revisá el importe.');if(paid_amount===null)throw new TypeError('Revisá el importe pagado.');
return {id,student_id,schedule_id,type:type as 'monthly'|'deposit'|'single_class'|'product'|'other',status:status as 'pending'|'paid'|'partial'|'overdue'|'cancelled',period,amount,paid_amount,paid_at,method,notes};
}
export function validateWorkshopExpense(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),category=str('category',20),description=str('description',160),expense_date=str('expense_date',10),period=str('period',7),method=str('method',80),notes=str('notes',800);if(id&&!uuid(id))throw new TypeError('Gasto inválido.');if(!['materials','rent','services','purchase','team','taxes','other'].includes(category))throw new TypeError('Elegí una categoría.');if(!description)throw new TypeError('Completá la descripción.');if(!/^\d{4}-\d{2}-\d{2}$/.test(expense_date))throw new TypeError('Elegí una fecha.');if(!/^\d{4}-\d{2}$/.test(period))throw new TypeError('Elegí un mes.');const amount=moneyValue(p,'amount');if(amount===null)throw new TypeError('Revisá el importe.');
return {id,category:category as 'materials'|'rent'|'services'|'purchase'|'team'|'taxes'|'other',description,amount,expense_date,period,method,notes};
}
export function validateWorkLog(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),staff_id=str('staff_id',36),work_date=str('work_date',10),start_time=str('start_time',5),end_time=str('end_time',5),status=str('status',20),notes=str('notes',800);if(id&&!uuid(id))throw new TypeError('Registro inválido.');if(!uuid(staff_id))throw new TypeError('Elegí una persona.');if(!/^\d{4}-\d{2}-\d{2}$/.test(work_date))throw new TypeError('Elegí una fecha.');if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(start_time)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(end_time)||start_time>=end_time)throw new TypeError('Revisá el horario.');if(!['pending','paid','partial','overdue','cancelled'].includes(status))throw new TypeError('Elegí un estado.');const hours=typeof p.hours==='number'&&p.hours>0&&p.hours<=24?p.hours:null,hourly_rate=p.hourly_rate===null||p.hourly_rate===''||p.hourly_rate===undefined?null:moneyValue(p,'hourly_rate');if(hours===null)throw new TypeError('Revisá las horas.');if((p.hourly_rate!==null&&p.hourly_rate!==''&&p.hourly_rate!==undefined)&&hourly_rate===null)throw new TypeError('Revisá el valor hora.');
return {id,staff_id,work_date,start_time,end_time,hours,status:status as 'pending'|'paid'|'partial'|'overdue'|'cancelled',hourly_rate,notes};
}
export function validateStaffPayment(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const id=str('id',36),staff_id=str('staff_id',36),kind=str('kind',20),status=str('status',20),period=str('period',7),paid_at=str('paid_at',10),method=str('method',80),notes=str('notes',800);if(id&&!uuid(id))throw new TypeError('Pago inválido.');if(!uuid(staff_id))throw new TypeError('Elegí una persona.');if(!['teacher_share','hours','fixed','task','other'].includes(kind))throw new TypeError('Elegí un tipo de pago.');if(!['pending','paid','partial','overdue','cancelled'].includes(status))throw new TypeError('Elegí un estado.');if(!/^\d{4}-\d{2}$/.test(period))throw new TypeError('Elegí un mes.');const amount=moneyValue(p,'amount');if(amount===null)throw new TypeError('Revisá el importe.');
return {id,staff_id,kind:kind as 'teacher_share'|'hours'|'fixed'|'task'|'other',status:status as 'pending'|'paid'|'partial'|'overdue'|'cancelled',period,amount,paid_at,method,notes};
}
export function validatePortalAbsenceRequest(value:unknown){
if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Datos inválidos.');
const p=value as Record<string,unknown>;const str=(key:string,max:number)=>{if(typeof p[key]!=='string'||(p[key] as string).length>max)throw new TypeError('Revisá el campo '+key+'.');return (p[key] as string).trim()};
const student_name=str('student_name',120),contact=str('contact',120),class_date=str('class_date',10),schedule_hint=str('schedule_hint',160),message=str('message',800);
if(!student_name)throw new TypeError('Completá tu nombre.');if(!contact)throw new TypeError('Dejanos un contacto.');if(!/^\d{4}-\d{2}-\d{2}$/.test(class_date))throw new TypeError('Elegí la fecha de la clase.');
return {student_name,contact,class_date,schedule_hint,message};
}
