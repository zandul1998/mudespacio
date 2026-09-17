import {requireChatGPTUser} from '../chatgpt-auth';
import {getWorkshopAccess,listSchedules,listTeamMembers} from '../server';
import {dayLabels,scheduleStatusLabels,teamRoleLabels,type ScheduleStatus} from '../shared';

export const dynamic='force-dynamic';
const statusOrder:ScheduleStatus[]=['open','last','forming','full'];
const statusTone:Record<ScheduleStatus,string>={open:'ok',last:'warn',forming:'soft',full:'muted'};

export default async function MiTaller(){
  const user=await requireChatGPTUser('/mitaller');
  const access=await getWorkshopAccess(user.email);
  if(!access)return <main className="workshop-shell access-denied"><a className="text-link" href="/">Volver al sitio</a><section><p className="eyebrow">MI TALLER</p><h1>Acceso reservado.</h1><p>Este panel está en beta y solo pueden entrar los mails habilitados por Mud Espacio.</p><a className="button" href="/signout-with-chatgpt?return_to=%2Fmitaller">Cambiar de cuenta</a></section></main>;
  const schedules=await listSchedules(true),members=access.role==='admin'?await listTeamMembers():[];
  const todayDay=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Argentina/Buenos_Aires'})).getDay();
  const today=schedules.filter(s=>s.day===todayDay),published=schedules.filter(s=>s.published===1).length,available=schedules.filter(s=>s.status==='open'||s.status==='last').length,forming=schedules.filter(s=>s.status==='forming').length;
  const statusCounts=Object.fromEntries(statusOrder.map(status=>[status,schedules.filter(s=>s.status===status).length])) as Record<ScheduleStatus,number>;
  const groups=Object.entries(Object.groupBy(schedules,s=>String(s.day))).sort(([a],[b])=>Number(a)-Number(b));
  return <main className="workshop-shell"><header className="workshop-header"><div><p className="eyebrow">MI TALLER</p><h1>Dashboard.</h1><p>Hola {access.name}. Entraste como {teamRoleLabels[access.role]}.</p></div><nav><a className="text-link" href="/">Sitio</a>{access.role==='admin'&&<a className="text-link" href="/admin#admin-equipo">Accesos</a>}<a className="text-link" href="/signout-with-chatgpt?return_to=%2F">Salir</a></nav></header>
  <section className="workshop-metrics" aria-label="Resumen del taller"><article><span>Horarios cargados</span><strong>{schedules.length}</strong><small>{published} visibles en el sitio</small></article><article><span>Con cupo activo</span><strong>{available}</strong><small>Hay cupos o últimos lugares</small></article><article><span>En formación</span><strong>{forming}</strong><small>Necesitan completar mínimo</small></article></section>
  <section className="workshop-layout">
    <div className="workshop-main">
      <section className="workshop-panel today-panel"><div><p className="eyebrow">HOY</p><h2>{dayLabels[todayDay]}</h2><p>{today.length?'Estos son los grupos cargados para hoy.':'No hay grupos cargados para hoy.'}</p></div><div className="workshop-schedule">{today.length?today.map(s=><article key={s.id}><div><strong>{s.start} a {s.end}</strong><p>{s.note||'Sin nota interna todavía'}</p></div><span className={'tone-'+statusTone[s.status]}>{scheduleStatusLabels[s.status]}</span></article>):<p className="workshop-empty">Podés usar este espacio para ver clases del día, asistencia y pendientes cuando sumemos alumnos.</p>}</div></section>
      <section className="workshop-panel"><div><p className="eyebrow">SEMANA</p><h2>Grilla operativa</h2><p>Vista interna de horarios, estados y notas. La próxima capa será cruzarla con alumnos y cupos reales.</p></div><div className="workshop-days">{groups.map(([day,slots])=><article key={day}><h3>{dayLabels[Number(day)]}</h3>{slots!.map(s=><div className="workshop-row" key={s.id}><div><strong>{s.start} a {s.end}</strong><p>{s.note||'Sin nota'}</p></div><span className={'tone-'+statusTone[s.status]}>{scheduleStatusLabels[s.status]}</span></div>)}</article>)}</div></section>
    </div>
    <aside className="workshop-side">
      <section><p className="eyebrow">ESTADOS</p><h2>Cupos</h2><div className="workshop-status-list">{statusOrder.map(status=><div key={status}><span className={'dot tone-'+statusTone[status]}/><strong>{scheduleStatusLabels[status]}</strong><em>{statusCounts[status]}</em></div>)}</div></section>
      <section><p className="eyebrow">ACCIONES</p><h2>Atajos</h2><div className="workshop-actions">{access.role==='admin'&&<><a href="/admin#admin-horarios">Editar horarios</a><a href="/admin#admin-equipo">Gestionar accesos</a><a href="/admin#admin-productos">Productos</a></>}<span>Alumnos: próximo módulo</span><span>Pagos: próximo módulo</span></div></section>
      {access.role==='admin'&&<section><p className="eyebrow">EQUIPO</p><h2>Accesos</h2><div className="workshop-team"><article><strong>Agustina</strong><span>Dueña/admin</span></article>{members.map(m=><article key={m.id}><strong>{m.name||m.email}</strong><span>{teamRoleLabels[m.role]} · {m.active?'Activo':'Inactivo'}</span></article>)}</div></section>}
    </aside>
  </section>
  <section className="workshop-next"><p className="eyebrow">PRÓXIMO BLOQUE</p><h2>La próxima pieza: alumnos</h2><ul><li>Crear ficha de persona con teléfono, Instagram, notas y estado.</li><li>Asignar personas a horarios para calcular cupos ocupados.</li><li>Separar interesados en formación de alumnos ya inscriptos.</li></ul></section></main>
}
