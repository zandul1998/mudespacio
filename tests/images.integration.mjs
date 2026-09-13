import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const base='http://localhost:3000';const headers={'oai-authenticated-user-id':'local-test-admin','oai-authenticated-user-email':process.env.ADMIN_EMAIL,Origin:base};const form=new FormData();form.set('file',new Blob([await readFile('public/og.png')],{type:'image/png'}),'test.png');
const upload=await fetch(base+'/api/admin/upload',{method:'POST',headers:{...headers,'Content-Type':'image/png'},body:await readFile('public/og.png')});assert.equal(upload.status,200);const {key}=await upload.json();assert.equal((await fetch(base+'/api/images/'+key)).status,404);assert.equal((await fetch(base+'/api/images/'+key,{headers})).status,200);
let p={id:'',name:'Prueba local de foto',description:'',price:null,variants:'',status:'available',published:1,image:key,sort:9999};let r=await fetch(base+'/api/admin/products',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(p)});p.id=(await r.json()).id;assert.equal((await fetch(base+'/api/images/'+key)).status,200);p.published=0;await fetch(base+'/api/admin/products',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(p)});assert.equal((await fetch(base+'/api/images/'+key)).status,404);console.log('PASS: image upload, admin preview, public image visibility, hidden image protection.');




