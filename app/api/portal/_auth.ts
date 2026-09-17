import {bindings} from '../../server';
export async function passwordHash(password:string,id:string){const bytes=new TextEncoder().encode(id+':'+password),hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')}
export function tokenFrom(request:Request){const h=request.headers.get('authorization')||'';return h.startsWith('Bearer ')?h.slice(7):''}
export async function portalStudent(request:Request){const token=tokenFrom(request);if(!token)return null;const db=bindings().DB,now=new Date().toISOString();const row=await db.prepare('SELECT s.id,s.name,s.contact,s.email,s.instagram,s.family_group,s.status,s.notes,s.created_at,s.updated_at FROM student_portal_sessions ps JOIN students s ON s.id=ps.student_id WHERE ps.token=? AND ps.expires_at>? AND s.status!="inactive" LIMIT 1').bind(token,now).first<any>();return row||null}
export async function requirePortalStudent(request:Request){const student=await portalStudent(request);if(!student)return Response.json({error:'Necesitás ingresar al portal.'},{status:401});return student}
export async function classCapacity(sessionId:string){const db=bindings().DB;return db.prepare(`SELECT s.capacity,
(SELECT COUNT(*) FROM student_schedules ss JOIN students stu ON stu.id=ss.student_id WHERE ss.schedule_id=s.id AND stu.status!='inactive') AS fixed_count,
(SELECT COUNT(*) FROM attendance_records ar WHERE ar.session_id=cs.id AND ar.status IN ('notice','absent','cancelled')) AS absent_count,
(SELECT COUNT(*) FROM recovery_bookings rb WHERE rb.session_id=cs.id AND rb.status!='cancelled') AS recovery_count
FROM class_sessions cs JOIN schedules s ON s.id=cs.schedule_id WHERE cs.id=? AND cs.status!='cancelled'`).bind(sessionId).first<any>()}
export function availableFrom(row:any){return Math.max(0,(row?.capacity||8)-(row?.fixed_count||0)+(row?.absent_count||0)-(row?.recovery_count||0))}
