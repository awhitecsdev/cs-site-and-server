"use strict";

const state={records:[],columns:[],numericColumns:new Set(),name:"",query:"",searchField:"__all__",sortColumn:"",sortDirection:1,page:1,pageSize:50,editIndex:null};

const $=id=>document.getElementById(id);
const el={
 fileInput:$("fileInput"),sampleButton:$("sampleButton"),message:$("message"),
 rowCount:$("rowCount"),columnCount:$("columnCount"),numericCount:$("numericCount"),datasetName:$("datasetName"),
 searchInput:$("searchInput"),searchField:$("searchField"),addRowButton:$("addRowButton"),exportButton:$("exportButton"),
 tableHead:$("tableHead"),tableBody:$("tableBody"),prevPage:$("prevPage"),nextPage:$("nextPage"),pageStatus:$("pageStatus"),
 profileField:$("profileField"),profile:$("profile"),benchmarkField:$("benchmarkField"),benchmarkQueries:$("benchmarkQueries"),
 runBenchmark:$("runBenchmark"),benchmarkResults:$("benchmarkResults"),editDialog:$("editDialog"),editForm:$("editForm"),
 dialogTitle:$("dialogTitle"),editFields:$("editFields"),saveRowButton:$("saveRowButton")
};

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function num(v){const s=String(v??"").trim().replace(/,/g,"");if(!s)return null;const n=Number(s);return Number.isFinite(n)?n:null;}
function fmt(n){return Number.isInteger(n)?n.toLocaleString():n.toLocaleString(undefined,{maximumFractionDigits:3});}
function setMessage(text,error=false){el.message.textContent=text;el.message.style.color=error?"#ff9b9b":"";}

function uniqueHeaders(raw){
 const seen=new Map(),out=[];
 raw.forEach((h,i)=>{let name=String(h??"").replace(/^\uFEFF/,"").trim();if(!name)return;const n=(seen.get(name)||0)+1;seen.set(name,n);if(n>1)name+=` (${n})`;out.push({name,sourceIndex:i});});
 return out;
}

function parseDelimited(text,delimiter=""){
 const result=Papa.parse(text,{header:false,skipEmptyLines:"greedy",delimiter,dynamicTyping:false});
 if(!result.data.length)throw new Error("Dataset contains no rows.");
 const rawHeaders=result.data[0],map=uniqueHeaders(rawHeaders);
 if(!map.length)throw new Error("No valid header row found.");
 const columns=map.map(x=>x.name),records=[];
 for(let i=1;i<result.data.length;i++){
   const src=result.data[i],r={};
   map.forEach(h=>r[h.name]=String(src[h.sourceIndex]??""));
   if(Object.values(r).some(v=>v.trim()!==""))records.push(r);
 }
 return {records,columns};
}

function parseJSON(text){
 const parsed=JSON.parse(text);let arr;
 if(Array.isArray(parsed))arr=parsed;
 else if(parsed&&Array.isArray(parsed.data))arr=parsed.data;
 else if(parsed&&typeof parsed==="object")arr=[parsed];
 else throw new Error("JSON must contain an object or array of objects.");
 if(!arr.every(v=>v&&typeof v==="object"&&!Array.isArray(v)))throw new Error("JSON records must be objects.");
 const columns=[...new Set(arr.flatMap(Object.keys))];
 return {columns,records:arr.map(o=>Object.fromEntries(columns.map(c=>[c,String(o[c]??"")])))};
}

function detectNumeric(){
 state.numericColumns=new Set();
 for(const c of state.columns){
   const vals=state.records.map(r=>String(r[c]??"").trim()).filter(Boolean);
   if(!vals.length)continue;
   const good=vals.filter(v=>num(v)!==null).length;
   if(good/vals.length>=.8)state.numericColumns.add(c);
 }
}

function loadDataset(records,columns,name){
 state.records=records;state.columns=columns;state.name=name;state.page=1;state.sortColumn="";state.query="";el.searchInput.value="";
 detectNumeric();populateSelectors();renderAll();setMessage(`Loaded ${records.length.toLocaleString()} records from ${name}.`);
}

async function loadFile(file){
 try{
   const text=await file.text();let data;
   if(file.name.toLowerCase().endsWith(".json"))data=parseJSON(text);
   else data=parseDelimited(text,file.name.toLowerCase().endsWith(".tsv")?"\t":"");
   loadDataset(data.records,data.columns,file.name);
 }catch(err){setMessage(err.message||"Could not load dataset.",true);}
}

async function loadSample(){
 try{
   const res=await fetch("sample-enterprise-data.csv");
   if(!res.ok)throw new Error("Sample dataset could not be loaded.");
   const text=await res.text(),data=parseDelimited(text,",");
   loadDataset(data.records,data.columns,"sample-enterprise-data.csv");
 }catch(err){setMessage(err.message,true);}
}

function populateSelectors(){
 const selectors=[el.searchField,el.profileField,el.benchmarkField];
 selectors.forEach(s=>s.innerHTML="");
 el.searchField.add(new Option("All columns","__all__"));
 state.columns.forEach(c=>selectors.forEach((s,i)=>{if(i===0||s!==el.searchField)s.add(new Option(c,c));}));
 if(state.columns.length){el.profileField.value=state.columns[0];el.benchmarkField.value=state.columns[0];}
}

function visibleRecords(){
 let rows=state.records.map((record,index)=>({record,index}));
 const q=state.query.trim().toLowerCase();
 if(q)rows=rows.filter(({record})=>{
   const fields=state.searchField==="__all__"?state.columns:[state.searchField];
   return fields.some(c=>String(record[c]??"").toLowerCase().includes(q));
 });
 if(state.sortColumn){
   const c=state.sortColumn,numeric=state.numericColumns.has(c),dir=state.sortDirection;
   rows=[...rows].sort((a,b)=>{
     const av=a.record[c]??"",bv=b.record[c]??"";
     if(numeric){const an=num(av),bn=num(bv);if(an!==null&&bn!==null)return (an-bn)*dir;if(an!==null)return -1;if(bn!==null)return 1;}
     return String(av).localeCompare(String(bv),undefined,{numeric:true,sensitivity:"base"})*dir;
   });
 }
 return rows;
}

function renderTable(){
 el.tableHead.innerHTML="<tr>"+state.columns.map(c=>`<th data-column="${esc(c)}">${esc(c)}${state.sortColumn===c?(state.sortDirection===1?" ↑":" ↓"):""}</th>`).join("")+"<th>Actions</th></tr>";
 const rows=visibleRecords(),pages=Math.max(1,Math.ceil(rows.length/state.pageSize));state.page=Math.min(state.page,pages);
 const start=(state.page-1)*state.pageSize,chunk=rows.slice(start,start+state.pageSize);
 el.tableBody.innerHTML=chunk.map(({record,index})=>"<tr>"+state.columns.map(c=>`<td>${esc(record[c])}</td>`).join("")+`<td class="actions"><button data-edit="${index}">Edit</button><button data-delete="${index}">Delete</button></td></tr>`).join("");
 el.pageStatus.textContent=`Page ${state.records.length?state.page:0} of ${state.records.length?pages:0} · ${rows.length.toLocaleString()} visible`;
 el.prevPage.disabled=state.page<=1;el.nextPage.disabled=state.page>=pages;
}

function renderMetrics(){
 el.rowCount.textContent=state.records.length.toLocaleString();el.columnCount.textContent=state.columns.length;el.numericCount.textContent=state.numericColumns.size;el.datasetName.textContent=state.name||"—";
}

function renderProfile(){
 el.profile.innerHTML="";const c=el.profileField.value;if(!c)return;
 const values=state.records.map(r=>String(r[c]??"")),filled=values.filter(v=>v.trim()!==""),missing=values.length-filled.length,unique=new Set(filled).size,numeric=state.numericColumns.has(c);
 let html=`<div class="profile-head"><strong>${esc(c)}</strong><span class="type">${numeric?"Numeric":"Text"}</span></div><div class="profile-grid"><div><span>Rows</span><strong>${values.length.toLocaleString()}</strong></div><div><span>Non-empty</span><strong>${filled.length.toLocaleString()}</strong></div><div><span>Missing</span><strong>${missing.toLocaleString()}</strong></div><div><span>Unique</span><strong>${unique.toLocaleString()}</strong></div></div>`;
 if(numeric){
   const nums=filled.map(num).filter(v=>v!==null).sort((a,b)=>a-b);
   if(nums.length){const mean=nums.reduce((a,b)=>a+b,0)/nums.length,mid=Math.floor(nums.length/2),median=nums.length%2?nums[mid]:(nums[mid-1]+nums[mid])/2;
     html+=`<div class="numeric-block"><div class="profile-grid"><div><span>Mean</span><strong>${fmt(mean)}</strong></div><div><span>Median</span><strong>${fmt(median)}</strong></div><div><span>Min</span><strong>${fmt(nums[0])}</strong></div><div><span>Max</span><strong>${fmt(nums[nums.length-1])}</strong></div></div></div>`;
   }
 }
 el.profile.innerHTML=html;
}

function compareText(a,b){return a===b?0:(a<b?-1:1)} function compareNumber(a,b){return a-b}
function binarySearch(arr,target,cmp){let lo=0,hi=arr.length-1;while(lo<=hi){const m=(lo+hi)>>1,c=cmp(arr[m],target);if(c===0)return true;if(c<0)lo=m+1;else hi=m-1}return false}
function runBenchmark(){
 const field=el.benchmarkField.value;if(!field||!state.records.length)return;
 let count=Math.max(10,Math.min(5000,Math.floor(Number(el.benchmarkQueries.value)||1000)));el.benchmarkQueries.value=count;
 const numeric=state.numericColumns.has(field),entries=[];
 for(const record of state.records){const raw=String(record[field]??"");if(raw==="")continue;if(numeric){const n=num(raw);if(n!==null)entries.push({key:n,record});}else entries.push({key:raw,record});}
 if(!entries.length)return;
 const queries=Array.from({length:count},()=>entries[Math.floor(Math.random()*entries.length)].key);
 let t=performance.now();for(const q of queries)entries.find(e=>e.key===q);const linear=performance.now()-t;
 t=performance.now();const map=new Map();for(const e of entries)if(!map.has(e.key))map.set(e.key,e.record);const mapBuild=performance.now()-t;
 t=performance.now();for(const q of queries)map.get(q);const mapSearch=performance.now()-t;
 t=performance.now();const sorted=entries.map(e=>e.key);const cmp=numeric?compareNumber:compareText;sorted.sort(cmp);const binaryBuild=performance.now()-t;
 t=performance.now();for(const q of queries)binarySearch(sorted,q,cmp);const binarySearchTime=performance.now()-t;
 const rows=[
   ["Linear Array",0,linear,linear],
   ["Map Index",mapBuild,mapSearch,mapBuild+mapSearch],
   ["Sorted / Binary",binaryBuild,binarySearchTime,binaryBuild+binarySearchTime]
 ];
 const best=Math.min(...rows.map(r=>r[3]));
 el.benchmarkResults.innerHTML=rows.map(r=>`<div class="bench-row ${r[3]===best?"best":""}"><strong>${r[0]}</strong><span>Build ${r[1].toFixed(3)} ms · Search ${r[2].toFixed(3)} ms · Total ${r[3].toFixed(3)} ms</span></div>`).join("");
}

function openEditor(index=null){
 state.editIndex=index;el.dialogTitle.textContent=index===null?"Add Row":"Edit Row";const record=index===null?{}:state.records[index];
 el.editFields.innerHTML=state.columns.map(c=>`<label>${esc(c)}<input name="${esc(c)}" value="${esc(record[c]??"")}"></label>`).join("");el.editDialog.showModal();
}
function saveEditor(){
 const data=new FormData(el.editForm),record={};state.columns.forEach(c=>record[c]=String(data.get(c)??""));
 if(state.editIndex===null)state.records.push(record);else state.records[state.editIndex]=record;
 detectNumeric();state.page=1;renderAll();
}
function exportCSV(){
 if(!state.columns.length)return;const quote=v=>`"${String(v??"").replace(/"/g,'""')}"`;const csv=[state.columns.map(quote).join(","),...state.records.map(r=>state.columns.map(c=>quote(r[c])).join(","))].join("\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(state.name.replace(/\.[^.]+$/,"")||"dataset")+"-edited.csv";a.click();URL.revokeObjectURL(a.href);
}
function renderAll(){renderMetrics();renderTable();renderProfile();}

el.fileInput.addEventListener("change",e=>{const f=e.target.files[0];if(f)loadFile(f)});
el.sampleButton.addEventListener("click",loadSample);
el.searchInput.addEventListener("input",()=>{state.query=el.searchInput.value;state.page=1;renderTable()});
el.searchField.addEventListener("change",()=>{state.searchField=el.searchField.value;state.page=1;renderTable()});
el.profileField.addEventListener("change",renderProfile);
el.tableHead.addEventListener("click",e=>{const th=e.target.closest("[data-column]");if(!th)return;const c=th.dataset.column;if(state.sortColumn===c)state.sortDirection*=-1;else{state.sortColumn=c;state.sortDirection=1}renderTable()});
el.tableBody.addEventListener("click",e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit!==undefined)openEditor(Number(edit));if(del!==undefined&&confirm("Delete this row?")){state.records.splice(Number(del),1);detectNumeric();renderAll()}});
el.addRowButton.addEventListener("click",()=>{if(state.columns.length)openEditor()});
el.exportButton.addEventListener("click",exportCSV);
el.prevPage.addEventListener("click",()=>{state.page--;renderTable()});el.nextPage.addEventListener("click",()=>{state.page++;renderTable()});
el.runBenchmark.addEventListener("click",runBenchmark);
el.editForm.addEventListener("submit",e=>{e.preventDefault();saveEditor();el.editDialog.close()});

loadSample();