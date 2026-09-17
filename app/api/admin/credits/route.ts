import {guard,listRecoveryCredits} from '../../../server';

export async function GET(request:Request){
  const denied=await guard(request);if(denied)return denied;
  try{return Response.json({credits:await listRecoveryCredits(new URL(request.url).searchParams.get('status')||undefined)},{headers:{'Cache-Control':'no-store'}})}
  catch{return Response.json({error:'No pudimos cargar recuperaciones.'},{status:503})}
}
