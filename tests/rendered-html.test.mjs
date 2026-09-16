import assert from 'node:assert/strict';import test from 'node:test';import {validateProduct,validateSchedule,imageType} from '../app/validation.ts';
const base={id:'',name:'Taza',description:'',variants:'',image:'',price:null,sort:0,published:0,status:'order'};
test('rejects invalid price, image paths and publication values',()=>{for(const change of [{price:-100},{price:1.5},{image:'../../secret'},{published:2},{status:'invalid'},{name:' '}])assert.throws(()=>validateProduct({...base,...change}),TypeError)});
test('accepts optional price and bounded content',()=>{assert.equal(validateProduct(base).price,null);assert.equal(validateProduct({...base,price:125050}).price,125050)});
test('rejects executable image content regardless of filename',()=>{assert.equal(imageType(new TextEncoder().encode('<svg onload="alert(1)"></svg>')),null)});
const schedule={id:'',day:1,start:'10:00',end:'12:00',status:'forming',note:'',sort:0,published:1};
test('validates schedule states and time ranges',()=>{assert.equal(validateSchedule(schedule).status,'forming');for(const change of [{day:8},{start:'25:00'},{end:'09:00'},{status:'waiting'},{published:2}])assert.throws(()=>validateSchedule({...schedule,...change}),TypeError)});
