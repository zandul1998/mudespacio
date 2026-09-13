'use client';
import {useEffect,useState} from 'react';
import {type Product,wa,priceLabel,statusLabels} from './shared';
export default function Catalog(){const [products,setProducts]=useState<Product[]|null>(null);const[error,setError]=useState(false);
async function load(){setError(false);try{const r=await fetch('/api/products');if(!r.ok)throw Error();setProducts((await r.json() as {products:Product[]}).products)}catch{setError(true)}}
useEffect(()=>{void load()},[]);
if(error)return <div className="catalog-empty" role="status"><p>No pudimos cargar el catálogo.</p><button className="text-link" onClick={load}>Volver a intentar</button><a className="button" href={wa('¡Hola Mud! Quisiera conocer la merch disponible.')} target="_blank" rel="noreferrer">Consultar por WhatsApp ↗</a></div>;
if(products===null)return <p role="status">Cargando las cosas lindas de Mud…</p>;
if(!products.length)return <div className="catalog-empty"><span aria-hidden="true">✳</span><div><h3>¿Querés conocer nuestra merch?</h3><p>Escribinos y te contamos qué tenemos disponible para encargar.</p></div><a className="button" href={wa('¡Hola Mud! Quisiera conocer la merch disponible y sus precios.')} target="_blank" rel="noreferrer">Consultar merch ↗</a></div>;
return <div className="products">{products.map(p=><article className="product" key={p.id}>{p.image?<img loading="lazy" src={'/api/images/'+p.image} alt={p.name}/>:<div className="product-no-photo" aria-label="Sin foto"><span>Mud</span><small>ESPACIO</small></div>}<div className="product-head"><h3>{p.name}</h3><span className="badge">{statusLabels[p.status]}</span></div><p className="product-description">{p.description}</p>{p.variants&&<p className="note">{p.variants}</p>}<strong className="price">{priceLabel(p.price)}</strong><a className="button" href={wa('¡Hola Mud! Quisiera consultar por '+p.name+(p.status==='soldout'?' y su reposición.':'. ¿Me cuentan cómo encargarlo?'))} target="_blank" rel="noreferrer">{p.status==='soldout'?'Consultar reposición':'Consultar por este producto'} ↗</a></article>)}</div>}

