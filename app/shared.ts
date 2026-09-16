export const wa=(message:string)=>'https://wa.me/5491139148205?text='+encodeURIComponent(message);
export type Product={id:string;name:string;description:string;price:number|null;variants:string;status:'available'|'order'|'soldout';published:number;image:string;sort:number};
export const statusLabels={available:'Disponible',order:'Por encargo',soldout:'Agotado'};
export const priceLabel=(p:number|null)=>p===null?'Consultar precio':new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:2}).format(p/100);
export type ScheduleStatus='open'|'last'|'full'|'forming';
export type Schedule={id:string;day:number;start:string;end:string;status:ScheduleStatus;note:string;published:number;sort:number};
export const dayLabels=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
export const scheduleStatusLabels:Record<ScheduleStatus,string>={open:'Hay cupos',last:'Últimos lugares',full:'Completo',forming:'En formación'};

