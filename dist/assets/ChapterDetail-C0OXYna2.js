import{y as N,x as u,z as e,D as z,L as k}from"./index-k_5DjuHr.js";import S from"./NotFound-DJUUIsPC.js";import{S as F}from"./SEO-Bq5wotb9.js";import{F as R}from"./CheckCircleIcon-D3MOwNbE.js";import{F as C}from"./XCircleIcon-CDN83j_Y.js";import{F as D}from"./ChevronLeftIcon-CuosMKyW.js";import{F as E}from"./ArrowDownTrayIcon-BUhvNryu.js";const q=({quiz:s,moduleSlug:c,moduleTitle:p})=>{const{data:r,saveData:t}=N(),n=sessionStorage.getItem("userId"),[x,d]=u.useState({}),[o,j]=u.useState(!1),[g,w]=u.useState(null),v=u.useRef(0);u.useEffect(()=>{const a=()=>{document.hidden&&!o&&(v.current+=1)};return document.addEventListener("visibilitychange",a),()=>{document.removeEventListener("visibilitychange",a)}},[o]),u.useEffect(()=>{var a;if(n&&(r!=null&&r.models)){const i=r.models.find(m=>m.id===n),l=(a=i==null?void 0:i.quizScores)==null?void 0:a[c];l&&(w({score:l.score,total:l.total}),j(!0))}},[r==null?void 0:r.models,n,c]);const y=(a,i)=>{o||d(l=>({...l,[a]:i}))},$=async()=>{let a=0;if(s.forEach((i,l)=>{x[l]===i.correctAnswer&&a++}),w({score:a,total:s.length}),j(!0),n&&(r!=null&&r.models)){const i=new Date().toISOString(),l=r.models.map(m=>{if(m.id===n){const h={...m.quizScores,[c]:{score:a,total:s.length,timesLeft:v.current,timestamp:i}};return{...m,quizScores:h,lastActivity:i}}return m});await t({...r,models:l})}};return e.jsx("section",{"aria-labelledby":`quiz-title-${c}`,className:"mt-12 pt-8 border-t border-pm-gold/30",children:e.jsxs("div",{className:"bg-pm-dark border border-pm-gold/20 p-8",children:[e.jsx("h3",{id:`quiz-title-${c}`,className:"text-2xl font-playfair text-pm-gold text-center mb-8",children:"Testez vos connaissances"}),e.jsx("div",{className:"space-y-8",children:s.map((a,i)=>e.jsxs("div",{children:[e.jsxs("p",{className:"font-bold mb-3",children:[i+1,". ",a.question]}),e.jsx("div",{className:"space-y-2",children:a.options.map((l,m)=>{const h=x[i]===l;let f="border-pm-dark hover:border-pm-gold/50",b=null;return o?l===a.correctAnswer?(f="border-green-500 bg-green-500/10 text-green-300",b=e.jsx(R,{className:"w-5 h-5 text-green-500"})):h&&(f="border-red-500 bg-red-500/10 text-red-300",b=e.jsx(C,{className:"w-5 h-5 text-red-500"})):h&&(f="border-pm-gold bg-pm-gold/10 text-pm-gold"),e.jsxs("label",{className:`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${f}`,children:[e.jsx("input",{type:"radio",name:`quiz-${c}-question-${i}`,value:l,checked:h,onChange:()=>y(i,l),disabled:o,className:"hidden"}),e.jsx("div",{className:"w-5",children:b}),e.jsx("span",{children:l})]},m)})})]},i))}),e.jsx("div",{className:"mt-8 text-center",children:o&&g?e.jsx("div",{className:"text-2xl font-bold",children:e.jsxs("p",{className:"text-pm-gold",children:["Votre score : ",e.jsxs("span",{className:"text-white",children:[g.score," / ",g.total]})]})}):e.jsx("button",{onClick:$,className:"px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white disabled:opacity-50",disabled:Object.keys(x).length!==s.length,children:"Valider le Quiz"})})]})})},L=(s,c,p)=>{const r=s.content.split(`
`).map(t=>`<p style="margin-bottom: 1em; line-height: 1.6;">${t}</p>`).join("");return`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }
                .page { padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
                .header img { height: 50px; }
                .module-title { color: #888; font-size: 14px; text-transform: uppercase; }
                h1 { font-family: 'Times New Roman', Times, serif; font-size: 36px; color: #D4AF37; margin: 0 0 20px 0; }
                .content { font-size: 16px; }
                .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center; font-size: 12px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="page">
                <header class="header">
                    <div>
                        <p class="module-title">${c.title}</p>
                        <h1>${s.title}</h1>
                    </div>
                     ${p!=null&&p.logo?`<img src="${p.logo}" alt="Logo" />`:""}
                </header>
                <div class="content">
                    ${r}
                </div>
                <footer class="footer">
                    &copy; ${new Date().getFullYear()} Perfect Models Management - Contenu de formation confidentiel
                </footer>
            </div>
        </body>
        </html>
    `},Q=()=>{const{data:s,isInitialized:c}=N(),{moduleSlug:p,chapterSlug:r}=z(),t=s==null?void 0:s.courseData.find(d=>d.slug===p),n=t==null?void 0:t.chapters.find(d=>d.slug===r);if(!c||!s)return e.jsx("div",{className:"min-h-screen bg-pm-dark"});if(!n||!t)return e.jsx(S,{});const x=()=>{if(!s.siteConfig)return;const d=L(n,t,s.siteConfig),o=window.open("","_blank");o?(o.document.write(d),o.document.close(),o.focus(),setTimeout(()=>{o.print(),o.close()},250)):alert("Veuillez autoriser les pop-ups pour imprimer le chapitre.")};return e.jsxs("div",{className:"bg-pm-dark text-pm-off-white py-20 min-h-screen",children:[e.jsx(F,{title:`${n.title} | PMM Classroom`,description:`Leçon détaillée sur "${n.title}" du module "${t.title}". Maîtrisez les compétences essentielles du mannequinat avec le programme de formation de Perfect Models Management.`,keywords:`apprendre le mannequinat, cours ${n.title}, formation ${t.title}, pmm classroom`,image:s.siteImages.classroomBg}),e.jsxs("div",{className:"container mx-auto px-6 max-w-4xl",children:[e.jsxs("div",{className:"flex justify-between items-center mb-8 print-hide",children:[e.jsxs(k,{to:"/formations",className:"inline-flex items-center gap-2 text-pm-gold hover:underline",children:[e.jsx(D,{className:"w-5 h-5"}),"Retour au Classroom"]}),e.jsxs("button",{onClick:x,className:"inline-flex items-center justify-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white",children:[e.jsx(E,{className:"w-5 h-5"}),"Imprimer / PDF"]})]}),e.jsx("div",{className:"printable-content",children:e.jsxs("article",{className:"bg-black p-8 md:p-12 border border-pm-gold/20",children:[e.jsxs("header",{children:[e.jsx("p",{className:"text-sm uppercase tracking-widest text-pm-gold/80 font-bold",children:t.title}),e.jsx("h1",{className:"text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight",children:n.title})]}),e.jsx("div",{className:"mt-8 text-lg text-pm-off-white/80 leading-relaxed",children:n.content.split(`
`).map((d,o)=>e.jsx("p",{className:"mb-4",children:d},o))})]})}),t.quiz&&t.quiz.length>0&&e.jsx(q,{quiz:t.quiz,moduleSlug:t.slug,moduleTitle:t.title})]})]})};export{Q as default};
