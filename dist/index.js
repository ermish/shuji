var{PerformanceObserver:e,PerformanceEntry:t,performance:r}=require("perf_hooks"),n=require("react"),{renderToStaticMarkup:a}=require("react-dom/server"),o=require("react-markdown"),s=require("gray-matter"),{stringify:i}=require("json5"),l=require("chalk"),{promises:c}=require("fs"),{basename:u,extname:d}=require("path");Object.defineProperty(module.exports,"__esModule",{value:!0}),module.exports.transformMarkdownFiles=module.exports.transformMarkdownString=module.exports.defaultOptions=void 0;var m={};Object.defineProperty(m,"__esModule",{value:!0}),m.convertMarkdownToJSX=m.convertMarkdownFilesToJSXFiles=void 0;var f=x(n),g=x(o),w=x(s),h={};Object.defineProperty(h,"__esModule",{value:!0}),h.logger=function(){const e=$.default.hex("#6C63A2");return{debug:t=>{if(k>1)return;const r=$.default.hex("#58a6ff");console.log(e("Shuji: ")+r(t))},info:t=>{if(k>2)return;const r=$.default.hex("#58a6ff");console.log(e("Shuji: ")+r(t))},warn:t=>{if(k>2)return;const r=$.default.hex("#FFA500");console.log(e("Shuji: ")+r(t))},error:(t,r)=>{if(k>2)return;const n=$.default.hex("#ff7b72"),a=r?t+`\n actual error: ${r.message} \n ${r.stack}`:t;console.log(e("Shuji: ")+n(a))}}},h.setLogLevel=function(e){k=e};var p,$=(p=l)&&p.__esModule?p:{default:p};let k=2;function x(e){return e&&e.__esModule?e:{default:e}}m.convertMarkdownFilesToJSXFiles=async(e,t,r,n)=>await Promise.all(e.map((async e=>{const a=v(e.data,t,r,n),o=y(a.markdownString),s=j(e.fileName,o,t,a.frontMatterJsxString,n);return{fileName:e.fileName,data:s}})));m.convertMarkdownToJSX=async(e,t,r,n,a)=>{const o=v(e,r,n,a),s=y(o.markdownString);return j(t,s,r,o.frontMatterJsxString,a)};const y=e=>{try{const t=a(f.default.createElement(g.default,{children:e}));return t.replace(/(\n|\r)/g,(e=>e+"\t\t\t"))}catch(e){throw h.logger().error(`error converting markdown to jsx: ${e}`),new e}},v=(e,t,r,n)=>{try{const{data:a,content:o}=w.default(e);return{frontMatterJsxString:F(a,t,r,n),markdownString:o}}catch(e){throw h.logger().error(`failed to extract front matter: ${e}`),new e}},F=(e,t,r,n)=>Object.keys(e).length<1?"":0==t?S(e,r,n):M(e),j=(e,t,r,n,a)=>{const o=e.replace(/^\w/,(e=>e.toUpperCase()));return(n?r?"import { Helmet } from 'react-helmet'\n\n":`import { ${a} } from 'reactHead'\n\n`:"")+`const ${o} = () => { \n  ${r?"":n}\n    return (\n        <div className='${e.replace(/^\w/,(e=>e.toLowerCase()))}'>\n        ${r?n:""}\t${t}\n        </div>\n    )\n}\n    \nexport default ${o}`},M=e=>{if(!e)return"";let t="";for(const r in e){const n=e[r];let a=i(n).replace(/]|[|'[]/g,"");switch(r){case"title":t+=`\n\t\t\t\t<title>${a}</title>`;break;case"description":t+=`\n\t\t\t\t<meta name="description" content="${a}" />`;break;case"author":t+=`\n\t\t\t\t<meta name="author" content="${a}" />`;break;case"keywords":t+=`\n\t\t\t\t<meta name="keywords" content="${a}" />`;break;default:t+=`\n\t\t\t\t<meta name="${r}" content="${a}" />`}}return`\t<Helmet>\t\t${t}\n\t\t\t</Helmet>`},S=(e,t,r)=>{if(!e)return"";const n="set"+t.replace(/^\w/,(e=>e.toUpperCase())),a=t.replace(/^\w/,(e=>e.toLowerCase()));let o="";for(const t in e){const r=e[t];o+=`\t\t${t} = ${i(r)}, \n`}return`\n\tconst [${a}, ${n}] = useContext('${r}')\n\n\t${n}({\n\t\t...${a},\n${o}\n\t})\n`};var b={};Object.defineProperty(b,"__esModule",{value:!0}),b.writeJsxFiles=b.getMdFilesFromFolder=void 0;b.getMdFilesFromFolder=async e=>{let t=[];try{const r=(await c.lstat(e)).isDirectory(),n=r?await c.readdir(e):[u(e)];if(n.length<1)return h.logger().warn(`No .md files found in '${e}'`),t;h.logger().info(`Processing ${n.length} file${n.length>1?"s":""} from "${e}"...`),t=await n.reduce((async(t,n)=>{const a=await t;if(".md"!=d(n))return a;const o=r?`${e}/${n}`:e,s=await c.readFile(o);return a.push({fileName:u(n,".md"),data:s.toString()}),a}),Promise.resolve([]))}catch(t){h.logger().warn(`No .md files found in inputPath: '${e}'`)}return t};b.writeJsxFiles=async(e,t,r)=>{try{if(t.length<=0)return;r&&await c.rmdir(e),h.logger().info(`Generating ${t.length} file${t.length>1?"s":""} in "${e}"...`),await c.mkdir(e,{recursive:!0}),await Promise.all(t.map((async t=>{await c.writeFile(`${e}/${t.fileName}.jsx`,t.data,"utf8")})))}catch(e){h.logger().error(`error writing markdown files: ${e}`)}};var H=e,P=r;const N={inputPath:"markdown",outputPath:"jsxMarkdown",useReactHelmet:!0,reactHeadContextName:"ReactHeadContext",reactHeadContextVarName:"reactHead",deleteExistingOutputFolder:!1};module.exports.defaultOptions=N;new H((e=>{e.getEntries().forEach((e=>{const t=parseInt(e.duration);"shuji"!=e.name?h.logger().debug(`${e.name} finished in ${t}ms.`):h.logger().info(`Done in ${t}ms.`)}))})).observe({entryTypes:["measure"],buffer:!0});module.exports.transformMarkdownString=async(e,t,r)=>{try{P.mark("start-shuji");const n={...N,...r};return await m.convertMarkdownToJSX(e,t,n.useReactHelmet,n.reactHeadContextVarName,n.reactHeadContextName)}catch(e){return""}finally{P.mark("end-shuji"),P.measure("shuji","start-shuji","end-shuji")}};module.exports.transformMarkdownFiles=async e=>{try{P.mark("start-shuji");const t={...N,...e},r=await b.getMdFilesFromFolder(t.inputPath),n=await m.convertMarkdownFilesToJSXFiles(r,t.useReactHelmet,t.reactHeadContextVarName,t.reactHeadContextName);return await b.writeJsxFiles(t.outputPath,n,t.deleteExistingOutputFolder),0}catch(e){return 1}finally{P.mark("end-shuji"),P.measure("shuji","start-shuji","end-shuji")}};
//# sourceMappingURL=index.js.map
