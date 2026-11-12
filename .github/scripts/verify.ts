import { readFileSync, readdirSync, lstatSync, existsSync } from 'node:fs';
import { resolve, join, dirname, sep, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
interface Entry { id:string; kind:string; name:string; platforms:string[]; localFile?:string; sha256?:string; sourceUrl:string; integration:string }
interface Registry { schemaVersion:number; entries:Entry[]; platforms:Array<{id:string;runtime:string}> }
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const assert=(condition:unknown,message:string):void=>{if(!condition)throw Error(message);};
const data=JSON.parse(readFileSync(join(root,'docs/data/registry.json'),'utf8')) as Registry;
assert(data.schemaVersion===1&&Array.isArray(data.entries)&&Array.isArray(data.platforms),'registry schema');
const ids=new Set<string>(), platforms=new Set(data.platforms.map(p=>p.id)); let bundled=0;
for(const e of data.entries){
 assert(!ids.has(e.id)&&!!e.name,'duplicate or empty entry');ids.add(e.id);
 assert(e.platforms.length&&e.platforms.every(p=>platforms.has(p)),'unknown platform');
 assert(e.integration!=='implemented','public catalog must not claim included account adapters');
 if(e.sourceUrl.startsWith('docs/evidence/'))assert(existsSync(resolve(root,e.sourceUrl.split('#')[0]!)),'missing research source');
 else {const url=new URL(e.sourceUrl);assert(url.protocol==='https:'&&!url.username&&!url.password,'unsafe source URL');}
 if(e.localFile){
  assert(e.localFile.startsWith('docs/vendor/')&&!e.localFile.split('/').includes('..'),'unsafe localFile');
  const path=resolve(root,e.localFile);assert(path.startsWith(root+sep)&&!lstatSync(path).isSymbolicLink(),'unsafe local file');
  assert(createHash('sha256').update(readFileSync(path)).digest('hex')===e.sha256,'skill hash mismatch: '+e.id);bundled++;
 }
}
assert(data.entries.length===545&&bundled===366,'catalog or bundled skill loss');
const index=JSON.parse(readFileSync(join(root,'docs/evidence/skill-index.json'),'utf8')) as Array<{localFile?:string;sha256?:string}>;
for(const e of index)if(e.localFile)assert(e.localFile.startsWith('docs/vendor/')&&existsSync(resolve(root,e.localFile))&&createHash('sha256').update(readFileSync(resolve(root,e.localFile))).digest('hex')===e.sha256,'skill evidence path or hash');
assert(data.platforms.every(p=>p.runtime==='reference_only'),'public catalog has no account runtime');
const provenance=JSON.parse(readFileSync(join(root,'docs/evidence/hero.provenance.json'),'utf8')) as {sha256:string};
const image=readFileSync(join(root,'assets/hero.png'));
assert(image.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'hero PNG signature');
assert(createHash('sha256').update(image).digest('hex')===provenance.sha256,'hero hash');
function walk(path:string):string[]{return readdirSync(path,{withFileTypes:true}).flatMap(d=>{if(['.git','node_modules'].includes(d.name))return[];const p=join(path,d.name);assert(!lstatSync(p).isSymbolicLink(),'symlink excluded');return d.isDirectory()?walk(p):[p];});}
const files=walk(root);
function checkLink(file:string,target:string):void{
 const clean=target.split('#')[0]!;
 if(!clean||/^(https?:|mailto:|data:)/.test(clean))return;
 assert(!clean.startsWith('/')&&existsSync(resolve(dirname(file),decodeURI(clean))),relative(root,file)+': missing local link '+clean);
}
for(const f of files){
 const rel=relative(root,f);
 assert(!/^(src|bin|\.private|\.sis|artifacts)(\/|$)/.test(rel)&&!/(^|\/)(\.env(?:\..*)?|signing-key|credentials\.json)$/.test(rel),'private file excluded: '+rel);
 if(/\.(md|json|js|ts|html|css|csv|txt)$/.test(rel))assert(!/\/Users\/[^/\s]+\//.test(readFileSync(f,'utf8')),'local host path excluded: '+rel);
 if(f.endsWith('.md')&&!rel.startsWith('docs/vendor/')){
  const text=readFileSync(f,'utf8');
  for(const match of text.matchAll(/\]\(([^\s)]+)\)/g))checkLink(f,match[1]!);
  for(const match of text.matchAll(/(?:src|href)="([^"]+)"/g))checkLink(f,match[1]!);
 }
}
const readme=readFileSync(join(root,'README.md'),'utf8');
const listed=[...readme.matchAll(/<!-- entry:([^ ]+) -->/g)].map(m=>m[1]!);
assert(listed.length===ids.size&&new Set(listed).size===ids.size&&listed.every(id=>ids.has(id)),'README must list every entry once');
assert(!readme.includes('<details')&&Buffer.byteLength(readme)<500_000,'catalog must render directly on GitHub');
const german=readFileSync(join(root,'Languages/README.de.md'),'utf8');
assert([...german.matchAll(/<!-- entry:([^ ]+) -->/g)].length===ids.size,'German README must contain the full catalog');
const allowedRoot=['.github','.gitignore','Languages','README.md','assets','docs'];
const actualRoot=readdirSync(root).filter(f=>f!=='.git');
assert(actualRoot.length===allowedRoot.length&&actualRoot.every(f=>allowedRoot.includes(f)),'compact root invariant');
const htmlPath=join(root,'docs/catalog/index.html'), html=readFileSync(htmlPath,'utf8');
const viewer=JSON.parse(html.match(/<script[^>]+id="awesome-data"[^>]*>([\s\S]*?)<\/script>/)![1]!) as Registry;
assert(viewer.entries.length===ids.size&&viewer.entries.every(e=>ids.has(e.id)),'viewer catalog completeness');
for(const match of html.slice(0,html.indexOf('<script')).matchAll(/(?:src|href)="([^"]+)"/g))checkLink(htmlPath,match[1]!);
for(const match of html.matchAll(/<script src="([^"]+)"/g))checkLink(htmlPath,match[1]!);
for(const e of viewer.entries)if(!e.sourceUrl.startsWith('https:'))checkLink(htmlPath,e.sourceUrl);
assert(!html.includes('127.0.0.1')&&!html.includes('../web/'),'viewer must be standalone');
console.log(JSON.stringify({passed:true,entries:data.entries.length,readmeEntries:listed.length,repositories:data.entries.filter(e=>e.kind==='repo'||e.kind==='awesome').length,skills:data.entries.filter(e=>e.kind==='skill').length,bundled,rootEntries:actualRoot.length,files:files.length,hero:provenance.sha256},null,2));
