import assert from 'node:assert/strict';
const base='http://localhost:3000';
const admin={'oai-authenticated-user-id':'local-test-admin','oai-authenticated-user-email':process.env.ADMIN_EMAIL};
const save=(p,headers=admin,origin=base)=>fetch(base+'/api/admin/products',{method:'POST',headers:{...headers,'Content-Type':'application/json',Origin:origin},body:JSON.stringify(p)});
let p={id:'',name:'Verificación local',description:'Producto de prueba local',price:125050,variants:'Verde',status:'order',published:0,image:'',sort:9999};
assert.equal((await save(p,{})).status,403);
assert.equal((await save(p,admin,'https://other.example')).status,403);
assert.equal((await save({...p,name:''})).status,400);
assert.equal((await save({...p,price:-1})).status,400);
const made=await save(p);assert.equal(made.status,200);p.id=(await made.json()).id;
let list=await (await fetch(base+'/api/products')).json();assert.ok(!list.products.some(x=>x.id===p.id));
p.published=1;assert.equal((await save(p)).status,200);
list=await (await fetch(base+'/api/products')).json();assert.equal(list.products.find(x=>x.id===p.id).price,125050);
p.name='Actualizado local';p.published=0;assert.equal((await save(p)).status,200);
const saved=await (await fetch(base+'/api/admin/products',{headers:admin})).json();assert.equal(saved.products.find(x=>x.id===p.id).name,p.name);
list=await (await fetch(base+'/api/products')).json();assert.ok(!list.products.some(x=>x.id===p.id));
const invalid=new FormData();invalid.set('file',new Blob(['<svg></svg>'],{type:'image/svg+xml'}),'test.svg');assert.equal((await fetch(base+'/api/admin/upload',{method:'POST',headers:{...admin,Origin:base},body:invalid})).status,400);
console.log('PASS: unauthorized access, cross-origin writes, validation, create, publish, update, hide, persistence, unsupported image rejection.');

