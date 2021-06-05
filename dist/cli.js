#! /usr/bin/env node
var e=require("yargs"),{readFileSync:t,promises:r}=require("fs"),{PerformanceObserver:a,PerformanceEntry:n,performance:o}=require("perf_hooks"),s=require("react"),{renderToStaticMarkup:i}=require("react-dom/server"),l=require("react-markdown"),c=require("gray-matter"),{stringify:u}=require("json5"),d=require("chalk"),{basename:m,extname:f}=require("path");Object.defineProperty(module.exports,"__esModule",{value:!0}),module.exports.cli=void 0;var p,h,g=(p=e)&&p.__esModule?p:{default:p};h=JSON.parse('{"name":"@ermish/shuji","version":"1.3.3","author":"ermish <philipermish@gmail.com>","license":"MIT","description":"A Markdown to React JSX converter","keywords":["react","markdown","template","remark","jsx","front matter","converter"],"engines":{"node":">14"},"repository":"https://github.com/Ermish/shuji","bin":{"shuji":"./dist/cli.js"},"collaborators":["ermish <philipermish@gmail.com>"],"files":["dist/","package.json","license","README.md"],"publishConfig":{"access":"public"},"scripts":{"build":"yarn && parcel build ./src/index.ts ./src/cli.ts --dist-dir dist","start":"node ./dist/cli.js -i=\'./src/samples\' --useReactHelmet=false","lint":"eslint ./src/**.js","test":"jest --verbose","cli":""},"dependencies":{"chalk":"^4.1.1","fs-extra":"^10.0.0","gray-matter":"^4.0.2","json5":"^2.2.0","react":"^17.0.2","react-dom":"^17.0.2","react-markdown":"^6.0.2","yargs":"^17.0.1"},"devDependencies":{"@babel/core":"^7.14.0","@babel/preset-env":"^7.12.11","@babel/preset-react":"^7.13.13","@babel/preset-typescript":"^7.13.0","@tsconfig/node16":"^1.0.1","@types/fs-extra":"^9.0.11","@types/jest":"^26.0.20","@types/json5":"^2.2.0","@types/klaw":"^3.0.1","@types/react":"^17.0.0","@types/react-dom":"^17.0.0","babel-jest":"^26.6.3","eslint":"^7.27.0","eslint-config-prettier":"^7.1.0","jest":"^26.6.3","parcel":"^2.0.0-beta.3.1","sass":"^1.32.0","stylelint":"^13.8.0","stylelint-config-recommended":"^3.0.0","stylelint-order":"^4.1.0","stylelint-scss":"^3.18.0","typescript":"^4.2.4"}}');var w={};Object.defineProperty(w,"__esModule",{value:!0}),w.transformMarkdownFiles=w.transformMarkdownString=w.defaultOptions=void 0;var y={};Object.defineProperty(y,"__esModule",{value:!0}),y.convertMarkdownToJSX=y.convertMarkdownFilesToJSXFiles=void 0;var v=F(s),b=F(l),j=F(c),x={};Object.defineProperty(x,"__esModule",{value:!0}),x.logger=function(){const e=k.default.hex("#6C63A2");return{debug:t=>{if($>1)return;const r=k.default.hex("#58a6ff");console.log(e("Shuji: ")+r(t))},info:t=>{if($>2)return;const r=k.default.hex("#58a6ff");console.log(e("Shuji: ")+r(t))},warn:t=>{if($>2)return;const r=k.default.hex("#FFA500");console.log(e("Shuji: ")+r(t))},error:(t,r)=>{if($>2)return;const a=k.default.hex("#ff7b72"),n=r?t+`\n actual error: ${r.message} \n ${r.stack}`:t;console.log(e("Shuji: ")+a(n))}}},x.setLogLevel=function(e){$=e};var k=function(e){return e&&e.__esModule?e:{default:e}}(d);let $=2;function F(e){return e&&e.__esModule?e:{default:e}}y.convertMarkdownFilesToJSXFiles=async(e,t,r,a)=>await Promise.all(e.map((async e=>{const n=S(e.data,t,r,a),o=M(n.markdownString),s=N(e.fileName,o,t,n.frontMatterJsxString,a);return{fileName:e.fileName,data:s}})));y.convertMarkdownToJSX=async(e,t,r,a,n)=>{const o=S(e,r,a,n),s=M(o.markdownString);return N(t,s,r,o.frontMatterJsxString,n)};const M=e=>{try{const t=i(v.default.createElement(b.default,{children:e}));return t.replace(/(\n|\r)/g,(e=>e+"\t\t\t"))}catch(e){throw x.logger().error(`error converting markdown to jsx: ${e}`),new e}},S=(e,t,r,a)=>{try{const{data:n,content:o}=j.default(e);return{frontMatterJsxString:P(n,t,r,a),markdownString:o}}catch(e){throw x.logger().error(`failed to extract front matter: ${e}`),new e}},P=(e,t,r,a)=>Object.keys(e).length<1?"":0==t?C(e,r,a):H(e),N=(e,t,r,a,n)=>{const o=e.replace(/^\w/,(e=>e.toUpperCase()));return(a?r?"import { Helmet } from 'react-helmet'\n\n":`import { ${n} } from 'reactHead'\n\n`:"")+`const ${o} = () => { \n  ${r?"":a}\n    return (\n        <div className='${e.replace(/^\w/,(e=>e.toLowerCase()))}'>\n        ${r?a:""}\t${t}\n        </div>\n    )\n}\n    \nexport default ${o}`},H=e=>{if(!e)return"";let t="";for(const r in e){const a=e[r];let n=u(a).replace(/]|[|'[]/g,"");switch(r){case"title":t+=`\n\t\t\t\t<title>${n}</title>`;break;case"description":t+=`\n\t\t\t\t<meta name="description" content="${n}" />`;break;case"author":t+=`\n\t\t\t\t<meta name="author" content="${n}" />`;break;case"keywords":t+=`\n\t\t\t\t<meta name="keywords" content="${n}" />`;break;default:t+=`\n\t\t\t\t<meta name="${r}" content="${n}" />`}}return`\t<Helmet>\t\t${t}\n\t\t\t</Helmet>`},C=(e,t,r)=>{if(!e)return"";const a="set"+t.replace(/^\w/,(e=>e.toUpperCase())),n=t.replace(/^\w/,(e=>e.toLowerCase()));let o="";for(const t in e){const r=e[t];o+=`\t\t${t} = ${u(r)}, \n`}return`\n\tconst [${n}, ${a}] = useContext('${r}')\n\n\t${a}({\n\t\t...${n},\n${o}\n\t})\n`};var O={};Object.defineProperty(O,"__esModule",{value:!0}),O.writeJsxFiles=O.getMdFilesFromFolder=void 0;O.getMdFilesFromFolder=async e=>{let t=[];try{const a=(await r.lstat(e)).isDirectory(),n=a?await r.readdir(e):[m(e)];if(n.length<1)return x.logger().warn(`No .md files found in '${e}'`),t;x.logger().info(`Processing ${n.length} file${n.length>1?"s":""} from "${e}"...`),t=await n.reduce((async(t,n)=>{const o=await t;if(".md"!=f(n))return o;const s=a?`${e}/${n}`:e,i=await r.readFile(s);return o.push({fileName:m(n,".md"),data:i.toString()}),o}),Promise.resolve([]))}catch(t){x.logger().warn(`No .md files found in inputPath: '${e}'`)}return t};O.writeJsxFiles=async(e,t,a)=>{try{if(t.length<=0)return;a&&await r.rmdir(e),x.logger().info(`Generating ${t.length} file${t.length>1?"s":""} in "${e}"...`),await r.mkdir(e,{recursive:!0}),await Promise.all(t.map((async t=>{await r.writeFile(`${e}/${t.fileName}.jsx`,t.data,"utf8")})))}catch(e){x.logger().error(`error writing markdown files: ${e}`)}};var J=a,_=o;const T={inputPath:"markdown",outputPath:"jsxMarkdown",useReactHelmet:!0,reactHeadContextName:"ReactHeadContext",reactHeadContextVarName:"reactHead",deleteExistingOutputFolder:!1};w.defaultOptions=T;new J((e=>{e.getEntries().forEach((e=>{const t=parseInt(e.duration);"shuji"!=e.name?x.logger().debug(`${e.name} finished in ${t}ms.`):x.logger().info(`Done in ${t}ms.`)}))})).observe({entryTypes:["measure"],buffer:!0});w.transformMarkdownString=async(e,t,r)=>{try{_.mark("start-shuji");const a={...T,...r};return await y.convertMarkdownToJSX(e,t,a.useReactHelmet,a.reactHeadContextVarName,a.reactHeadContextName)}catch(e){return""}finally{_.mark("end-shuji"),_.measure("shuji","start-shuji","end-shuji")}};w.transformMarkdownFiles=async e=>{try{_.mark("start-shuji");const t={...T,...e},r=await O.getMdFilesFromFolder(t.inputPath),a=await y.convertMarkdownFilesToJSXFiles(r,t.useReactHelmet,t.reactHeadContextVarName,t.reactHeadContextName);return await O.writeJsxFiles(t.outputPath,a,t.deleteExistingOutputFolder),0}catch(e){return 1}finally{_.mark("end-shuji"),_.measure("shuji","start-shuji","end-shuji")}};const E=async e=>{try{const r=(e=>{const t={};return Object.keys(w.defaultOptions).forEach((r=>{e.hasOwnProperty(r)&&(t[r]=e[r])})),x.logger().debug(`parsed user options: ${JSON.stringify(t)}`),t})((e=>{const r=g.default(e).scriptName("shuji").wrap(g.default.terminalWidth()).help("help").alias("help","h").showHelpOnFail(!1,"whoops, something went wrong! try running with --help").epilogue("for more information, check out the documentation at https://github.com/ermish/shuji").version("v","shuji version",h.version??"unable to verify. check your package.json").alias("version","v").config("config",'path to a Shuji ".shujirc.json" or ".shujirc" config file ',(function(e){return JSON.parse(t(e,"utf-8"))})).alias("c","config").example([['$0 -c="./.shujirc"',"importing config file."],["$0 --inputPath=./src/markdown/ --outputPath=./src/jsxPages/ --config=./.shujirc.json","Full example"]]).option("logLevel",{alias:"l",choices:[1,2,3],describe:"Set the log level. 1=debug mode, 2=default, 3= no logs",default:2,type:"number"}).group(["inputPath","outputPath","useReactHelmet","reactHeadContextName","reactHeadContextVarName","deleteExistingOutputFolder"],"Config Parameters:").option("inputPath",{alias:"i",describe:"Target folder or file with .md files for Shuji to parse",type:"string"}).option("outputPath",{alias:"o",describe:"Output destination folder to write the compiled .jsx files",type:"string"}).option("useReactHelmet",{alias:"rh",describe:'Toggle output style of front matter. true uses react helmet syntax. false will set react context values you have more control over. This is referred to as "reactHead"',type:"boolean"}).option("reactHeadContextName",{alias:"rc",describe:"The react context name in which any detected front-matter will be set through useContext('${reactContextName}')",type:"string"}).option("reactHeadContextVarName",{alias:"rcv",describe:"The name of the react context object and set method assigned from useContext('${reactContextName}'). ex. const [${yourVar}, set${YourVar}]",type:"string"}).option("deleteExistingOutputFolder",{alias:"del",describe:"Delete existing content in the output folder (outputFolderPath) before writing compiled files",type:"boolean"}).argv;return x.setLogLevel(r.logLevel),x.logger().debug(`cli args: ${JSON.stringify(r)}`),r})(e));await w.transformMarkdownFiles(r)}catch(e){x.logger().error("An unknown error occurred! Try using a markdown validator to ensure your mardown files are valid",e)}};module.exports.cli=E,E(process.argv);
//# sourceMappingURL=cli.js.map
