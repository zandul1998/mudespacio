'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {type Product,statusLabels,priceLabel} from '../shared';
const blank:Product={id:'',name:'',description:'',price:null,variants:'',status:'order',published:0,image:'',sort:0};
export default function Editor(){
const [products,setProducts]=useState<Product[]>([]),[draft,setDraft]=useState<Product>({...blank}),[price,setPrice]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[message,setMessage]=useState(''),[error,setError]=useState(false),[dirty,setDirty]=useState(false),[file,setFile]=useState<File|null>(null);
const formRef=useRef<HTMLFormElement>(null);
async function load(){setLoading(true);try{const r=await fetch('/api/admin/products');const data=await r.json() as {error?:string;products:Product[]};if(!r.ok)throw Error(data.error);setProducts(data.products)}catch(e){setError(true);setMessage(e instanceof Error?e.message:'No pudimos cargar los productos.')}finally{setLoading(false)}}
useEffect(()=>{void load()},[]);
useEffect(()=>{function warn(e:BeforeUnloadEvent){if(dirty){e.preventDefault();e.returnValue=''}}window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn)},[dirty]);
function update<K extends keyof Product>(key:K,value:Product[K]){setDraft(d=>({...d,[key]:value}));setDirty(true)}
function edit(p:Product){if(dirty&&!window.confirm('Tenés cambios sin guardar. ¿Querés descartarlos?'))return;setDraft({...p});setPrice(p.price===null?'':String(p.price/100));setFile(null);setDirty(false);setMessage('');formRef.current?.reset();formRef.current?.scrollIntoView({behavior:'smooth'});}
async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError(false);setMessage('');try{let image=draft.image;if(file){const r=await fetch('/api/admin/upload',{method:'POST',headers:{'Content-Type':file.type},body:file});const result=await r.json() as {error?:string;key:string;id:string};if(!r.ok)throw Error(result.error);image=result.key;setDraft(d=>({...d,image}));setFile(null)}
const parsed=price.trim()===''?null:Number(price.replace(',','.'));if(parsed!==null&&(!Number.isFinite(parsed)||parsed<0))throw Error('Ingresá un precio válido.');
const r=await fetch('/api/admin/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...draft,image,price:parsed===null?null:Math.round(parsed*100)})});const result=await r.json() as {error?:string;key:string;id:string};if(!r.ok)throw Error(result.error);setDraft(d=>({...d,id:result.id,image,price:parsed===null?null:Math.round(parsed*100)}));setDirty(false);setMessage(draft.published?'Producto guardado y publicado.':'Borrador guardado. Todavía no aparece en el catálogo.');await load();}catch(e){setError(true);setMessage(e instanceof Error?e.message:'No se pudo guardar. Intentá nuevamente.')}finally{setBusy(false)}}
return <><div className="form-actions"><button disabled={busy} className="button" onClick={()=>edit({...blank})}>+ Nuevo producto</button><button disabled={busy||loading} className="text-link" onClick={load}>Actualizar lista</button></div>
{message&&<p className={'feedback'+(error?' error':'')} role={error?'alert':'status'}>{message}</p>}
<form ref={formRef} onSubmit={submit} className="admin-form" style={{marginTop:25}}>
<h2 className="wide" style={{fontSize:30,marginBottom:0}}>{draft.id?'Editar producto':'Nuevo producto'}</h2>
<label>Nombre del producto<input required maxLength={100} value={draft.name} onChange={e=>update('name',e.target.value)} disabled={busy}/></label>
<label>Precio en pesos argentinos (opcional)<input inputMode="decimal" placeholder="Vacío = consultar precio" value={price} onChange={e=>{setPrice(e.target.value);setDirty(true)}} disabled={busy}/></label>
<label className="wide">Descripción<textarea rows={4} maxLength={2000} value={draft.description} onChange={e=>update('description',e.target.value)} disabled={busy}/></label>
<label className="wide">Variantes (opcional)<input placeholder="Colores, talles, medidas u otras opciones" maxLength={300} value={draft.variants} onChange={e=>update('variants',e.target.value)} disabled={busy}/></label>
<label>Disponibilidad<select value={draft.status} onChange={e=>update('status',e.target.value as Product['status'])} disabled={busy}>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
<label>Orden en el catálogo<input type="number" min={0} max={9999} required value={draft.sort} onChange={e=>update('sort',Number(e.target.value))} disabled={busy}/><span className="note">Los números más bajos aparecen primero.</span></label>
<label className="wide">Foto del producto<input key={draft.id+'-photo'} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0]||null;if(f&&f.size>5*1024*1024){setError(true);setMessage('La foto debe pesar menos de 5 MB.');e.target.value='';return}setFile(f);setDirty(true)}}/><span className="note">JPG, PNG o WebP. Hasta 5 MB. Se sube al guardar el producto.</span></label>
{draft.image&&<div className="wide"><img className="image-preview" src={'/api/images/'+draft.image} alt="Foto actual del producto"/><button type="button" className="text-link" disabled={busy} onClick={()=>update('image','')}>Quitar foto actual</button></div>}
<label className="checkbox wide"><input type="checkbox" checked={draft.published===1} onChange={e=>update('published',e.target.checked?1:0)} disabled={busy}/>Mostrar en el catálogo</label>
<div className="wide form-actions"><button className="button" disabled={busy} type="submit">{busy?'Guardando…':draft.published?'Guardar y publicar':'Guardar borrador'}</button>{dirty&&<span className="note">Tenés cambios sin guardar.</span>}</div></form>
<h2 style={{fontSize:36,marginTop:45}}>Tus productos</h2>{loading?<p role="status">Cargando…</p>:!products.length?<p>Todavía no cargaste productos. Podés empezar con el formulario de arriba.</p>:<div className="admin-list">{products.map(p=><article className="admin-item" key={p.id}>{p.image&&<img src={'/api/images/'+p.image} alt=""/>}<div><h3>{p.name}</h3><p>{p.published?'Publicado':'Borrador'} · {statusLabels[p.status]} · {priceLabel(p.price)}</p></div><button className="button small" disabled={busy} onClick={()=>edit(p)}>Editar</button></article>)}</div>}</>}


