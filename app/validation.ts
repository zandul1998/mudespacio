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
