import {requireChatGPTUser} from '../chatgpt-auth';
import {getWorkshopAccess,listSchedules} from '../server';
import {dayLabels,scheduleStatusLabels,teamRoleLabels} from '../shared';

export const dynamic='force-dynamic';

export default async function MiTaller(){
  const user=await requireChatGPTUser('/mitaller');
  const access=await getWorkshopAccess(user.email);
  if(!access)return <main className="workshop-shell access-denied"><a className="text-link" href="/">Volver al sitio</a><section><p className="eyebrow">MI TALLER</p><h1>Acceso reservado.</h1><p>Este panel está en beta y solo pueden entrar los mails habilitados por Mud Espacio.</p><a className="button" href="/signout-with-chatgpt?return_to=%2Fmitaller">Cambiar de cuenta</a></section></main>;
  const schedules=await listSchedules(true),open=schedules.filter(s=>s.status!=='full').length,forming=schedules.filter(s=>s.status==='forming').length;
  return <main className="workshop-shell"><header className="workshop-header"><div><p className="eyebrow">MI TALLER</p><h1>Panel beta.</h1><p>Hola {access.name}. Entraste como {teamRoleLabels[access.role]}.</p></div><nav><a className="text-link" href="/">Sitio</a>{access.role==='admin'&&<a className="text-link" href="/admin#admin-equipo">Accesos</a>}<a className="text-link" href="/signout-with-chatgpt?return_to=%2F">Salir</a></nav></header>
  <section className="workshop-metrics" aria-label="Resumen del taller"><article><span>Horarios cargados</span><strong>{schedules.length}</strong></article><article><span>Con cupo o consulta</span><strong>{open}</strong></article><article><span>Grupos en formación</span><strong>{forming}</strong></article></section>
  <section className="workshop-panel"><div><p className="eyebrow">SEMANA</p><h2>Grilla operativa</h2><p>Esta primera beta toma la misma grilla que ya gestionás desde Admin. Después acá podemos sumar alumnas, asistencia, pagos y notas internas.</p></div><div className="workshop-schedule">{schedules.map(s=><article key={s.id}><div><strong>{dayLabels[s.day]} · {s.start} a {s.end}</strong><p>{s.note||'Sin nota interna todavía'}</p></div><span>{scheduleStatusLabels[s.status]}</span></article>)}</div></section>
  <section className="workshop-next"><p className="eyebrow">PRÓXIMO BLOQUE</p><h2>Lo que sigue para esta beta</h2><ul><li>Crear personas y asignarlas a grupos.</li><li>Ver cupos ocupados contra cupos máximos.</li><li>Marcar pagos, asistencia y notas por alumna.</li></ul></section></main>
}
