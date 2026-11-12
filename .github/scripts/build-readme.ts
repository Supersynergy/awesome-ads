import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
interface Entry { id:string; name:string; kind:string; platforms:string[]; why:string; how:string; limits:string; sourceUrl:string; localFile?:string; legacyId?:string; repo?:string; inspection:string }
interface Registry { asOf:string; entries:Entry[]; platforms:Array<{id:string;name:string}> }
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const data=JSON.parse(readFileSync(resolve(root,'docs/data/registry.json'),'utf8')) as Registry;
const snapshots=JSON.parse(readFileSync(resolve(root,'docs/evidence/repository-snapshots.json'),'utf8')) as Array<{nameWithOwner:string;description:string|null}>;
const descriptions=new Map(snapshots.map(s=>[s.nameWithOwner,s.description]));
const platformNames=new Map(data.platforms.map(p=>[p.id,p.name]));
const md=(s:string):string=>s.replace(/\s+/g,' ').replace(/[\[\]<>|]/g,'').trim();
function description(e:Entry):string {
 if(e.legacyId)return md(e.why+' '+e.how);
 if(e.localFile){
  const text=readFileSync(resolve(root,e.localFile),'utf8');
  const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const field=front?.[1]?.match(/^description:\s*(.*)((?:\r?\n[ \t]+[^\r\n]*)*)/m);
  if(field){const raw=(field[1]!.replace(/^[>|][-+]?\s*/,'')+field[2]!).replace(/^['"]|['"]$/g,'');const words=md(raw).split(' ');if(words.length>3)return words.slice(0,24).join(' ')+(words.length>24?'…':'');}
 }
 if(e.repo&&descriptions.get(e.repo))return md(descriptions.get(e.repo)!).split(' ').slice(0,24).join(' ');
 return md(e.why+' '+(e.kind==='docs'||e.kind==='library'?e.how:''));
}
const sections:Array<{title:string;kinds:string[];note?:string}>=[
 {title:'Repositories',kinds:['repo']},
 {title:'Awesome lists',kinds:['awesome']},
 {title:'Agent skills',kinds:['skill'],note:'366 files are pinned locally with SHA256 checksums and upstream notices. Three skills are source links only. Review instructions before using them.'},
 {title:'Official documentation',kinds:['docs']},
 {title:'Ad libraries and competitor research',kinds:['library'],note:'Public ad libraries show creatives and advertiser disclosures. Shared auctions require your own Auction Insights report; public visibility does not reveal profitability.'},
 {title:'YouTube references',kinds:['video'],note:'Search samples and metadata, not a trend ranking or a transcript review.'},
 {title:'Research tools',kinds:['tool']}
];
const slug=(s:string):string=>s.toLowerCase().replaceAll(' ','-');
const count=(k:string[]):number=>data.entries.filter(e=>k.includes(e.kind)).length;
const lines=[
 '<img src="assets/hero.png" alt="Awesome Ads" width="300" align="right">','',
 '# Awesome Ads','',
 'Advertising tools, agent skills, ad libraries and measurement resources — the complete collection is listed on this page.','',
 `**${data.entries.length} resources · ${count(['repo','awesome'])} repositories · ${count(['skill'])} skills · 18 advertising platforms**`,'',
 sections.map(s=>`[${s.title} (${count(s.kinds)})](#${slug(s.title)})`).join(' · '),'',
 '[Deutsch](Languages/README.de.md) · [Searchable offline catalog](docs/catalog/index.html) · [JSON](docs/data/registry.json) · [CSV](docs/data/registry.csv)','',
 '**Start with:** [Google Ads MCP](https://github.com/googleads/google-ads-mcp), [Google Ads playbooks](https://github.com/mardab96/google-ads-skills), [cross-platform audits](https://github.com/AgriciDaniel/claude-ads) and [measurement skills](https://github.com/coreyhaines31/marketingskills). Validate conversions, diagnose wasted spend, then test one change against a business outcome.','',
 'Platform labels identify coverage. Entries are references, not performance endorsements or installed account integrations. Detailed use notes, limitations and content pins remain in the [data file](docs/data/registry.json).','',
 '<br clear="all">',''
];
for(const section of sections){
 lines.push(`## ${section.title}`,'');
 if(section.note)lines.push(section.note,'');
 const entries=data.entries.filter(e=>section.kinds.includes(e.kind));
 const groups=section.kinds.includes('skill')?data.platforms.map(p=>({label:p.name,items:entries.filter(e=>e.platforms[0]===p.id)})):[{label:'',items:entries}];
 for(const group of groups){if(!group.items.length)continue;if(group.label)lines.push(`### ${group.label}`,'');
  for(const e of group.items){const labels=e.platforms.map(p=>platformNames.get(p)??p).join(', ');lines.push(`- [${md(e.name)}](${e.sourceUrl}) — ${description(e)} *${labels}.*${e.localFile?` [Pinned skill](${e.localFile}).`:''} <!-- entry:${e.id} -->`);}
  lines.push('');
 }
}
lines.push('## Method, licenses and contributions','',
 'Snapshot: **12 November 2026**. Repository metadata was refreshed for all 123 repositories. The earlier 100 skill pins are retained; additional skill files were indexed without a full functional or security audit. Stars and video views do not establish advertising results.','',
 'Research channels: GHMax, Superweb Mega, Gitstars, Metacode, GitHub and YouTube. [Research method](docs/research.md) · [Platform coverage and gaps](docs/platforms.md) · [Third-party notices](docs/notice.md) · [Contributing](.github/CONTRIBUTING.md).','',
 'Download or clone this repository and open `docs/catalog/index.html` to search offline. No package installation is needed. The private account assistant, customer data and credentials are excluded.','',
 'Maintainers: `bun .github/scripts/build-readme.ts` regenerates this list; `bun .github/scripts/verify.ts` checks its completeness, paths, content hashes and repository boundary.','');
writeFileSync(resolve(root,'README.md'),lines.join('\n'));
console.log(JSON.stringify({readmeEntries:data.entries.length,bytes:Buffer.byteLength(lines.join('\n'))}));
