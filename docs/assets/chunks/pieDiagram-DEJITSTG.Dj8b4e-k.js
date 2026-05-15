import{_ as s,g as j,s as J,a as K,b as Q,t as Y,q as ee,l as w,c as te,H as ae,L as ie,M as re,N as F,O as se,e as ne,A as oe,P as le,I as ce}from"./theme.BfeEwhAL.js";import{p as de}from"./chunk-4BX2VUAB.CU3tEX4z.js";import{p as pe}from"./wardley-RL74JXVD.LLyD4hUZ.js";import"./framework.C3PHgg-M.js";import"./min.CIZziYxQ.js";import"./baseUniq.i5PUIyxy.js";var ge=ce.pie,C={sections:new Map,showData:!1},u=C.sections,D=C.showData,he=structuredClone(ge),ue=s(()=>structuredClone(he),"getConfig"),fe=s(()=>{u=new Map,D=C.showData,oe()},"clear"),me=s(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(e)||(u.set(e,a),w.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),ve=s(()=>u,"getSections"),xe=s(e=>{D=e},"setShowData"),Se=s(()=>D,"getShowData"),L={getConfig:ue,clear:fe,setDiagramTitle:ee,getDiagramTitle:Y,setAccTitle:Q,getAccTitle:K,setAccDescription:J,getAccDescription:j,addSection:me,getSections:ve,setShowData:xe,getShowData:Se},we=s((e,a)=>{de(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),Ce={parse:s(async e=>{const a=await pe("pie",e);w.debug(a),we(a,L)},"parse")},De=s(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),$e=De,ye=s(e=>{const a=[...e.values()].reduce((r,o)=>r+o,0),$=[...e.entries()].map(([r,o])=>({label:r,value:o})).filter(r=>r.value/a*100>=1);return le().value(r=>r.value).sort(null)($)},"createPieArcs"),Te=s((e,a,$,y)=>{w.debug(`rendering pie chart
`+e);const r=y.db,o=te(),T=ae(r.getConfig(),o.pie),A=40,n=18,p=4,c=450,d=c,f=ie(a),l=f.append("g");l.attr("transform","translate("+d/2+","+c/2+")");const{themeVariables:i}=o;let[b]=re(i.pieOuterStrokeWidth);b??=2;const _=T.textPosition,g=Math.min(d,c)/2-A,G=F().innerRadius(0).outerRadius(g),O=F().innerRadius(g*_).outerRadius(g*_);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+b/2).attr("class","pieOuterCircle");const h=r.getSections(),P=ye(h),B=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let m=0;h.forEach(t=>{m+=t});const E=P.filter(t=>(t.data.value/m*100).toFixed(0)!=="0"),v=se(B).domain([...h.keys()]);l.selectAll("mySlices").data(E).enter().append("path").attr("d",G).attr("fill",t=>v(t.data.label)).attr("class","pieCircle"),l.selectAll("mySlices").data(E).enter().append("text").text(t=>(t.data.value/m*100).toFixed(0)+"%").attr("transform",t=>"translate("+O.centroid(t)+")").style("text-anchor","middle").attr("class","slice");const I=l.append("text").text(r.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),k=[...h.entries()].map(([t,S])=>({label:t,value:S})),x=l.selectAll(".legend").data(k).enter().append("g").attr("class","legend").attr("transform",(t,S)=>{const z=n+p,V=z*k.length/2,X=12*n,Z=S*z-V;return"translate("+X+","+Z+")"});x.append("rect").attr("width",n).attr("height",n).style("fill",t=>v(t.label)).style("stroke",t=>v(t.label)),x.append("text").attr("x",n+p).attr("y",n-p).text(t=>r.getShowData()?`${t.label} [${t.value}]`:t.label);const N=Math.max(...x.selectAll("text").nodes().map(t=>t?.getBoundingClientRect().width??0)),U=d+A+n+p+N,R=I.node()?.getBoundingClientRect().width??0,q=d/2-R/2,H=d/2+R/2,M=Math.min(0,q),W=Math.max(U,H)-M;f.attr("viewBox",`${M} 0 ${W} ${c}`),ne(f,c,W,T.useMaxWidth)},"draw"),Ae={draw:Te},ze={parser:Ce,db:L,renderer:Ae,styles:$e};export{ze as diagram};
