import {listSchedules} from '../../server';
export async function GET(){try{return Response.json({schedules:await listSchedules()},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'No pudimos cargar los horarios.'},{status:503})}}
