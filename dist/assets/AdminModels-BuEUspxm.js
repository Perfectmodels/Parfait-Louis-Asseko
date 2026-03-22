import{x as l,y as w,z as e,L as N}from"./index-k_5DjuHr.js";import{S as $}from"./SEO-Bq5wotb9.js";import{M as y}from"./ModelForm-Dy-H2AEf.js";import{F as h}from"./ChevronLeftIcon-CuosMKyW.js";import{F as M}from"./PlusIcon-ClLUstvW.js";import{F as P}from"./EyeIcon-DEAsQTXk.js";import{F as C}from"./PrinterIcon-LGif3-aZ.js";import{F}from"./PencilIcon-CY0yHbZ8.js";import{F as z}from"./TrashIcon-pZZVb9O1.js";import"./ImageUploader-CEWY4VkI.js";import"./ArrowPathIcon-BKJbYbxQ.js";import"./ChevronDownIcon-VWoWFVkf.js";function k({title:s,titleId:n,...o},r){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":n},o),s?l.createElement("title",{id:n},s):null,l.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"}))}const E=l.forwardRef(k),R=(s,n,o)=>{const r=(s.portfolioImages||[]).slice(0,4).map(p=>`<img src="${p}" alt="Portfolio" style="width: 100%; aspect-ratio: 3/4; object-fit: cover;" />`).join("");return`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #fff; }
                .sheet { padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 16px; }
                .header h1 { font-family: 'Times New Roman', Times, serif; font-size: 48px; color: #111; margin: 0; }
                .header p { color: #666; font-size: 18px; margin: 0; }
                .header img { height: 80px; width: auto; }
                .main { margin-top: 32px; display: grid; grid-template-columns: 1fr 2fr; gap: 32px; }
                .profile-pic { width: 100%; aspect-ratio: 3/4; object-fit: cover; border: 4px solid #f0f0f0; }
                .section { margin-bottom: 24px; }
                .section h2 { font-family: 'Times New Roman', Times, serif; font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
                .info-item strong { display: block; color: #777; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .info-item span { font-size: 14px; }
                .portfolio { margin-top: 32px; }
                .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
                .experience { margin-top: 32px; font-size: 12px; color: #555; line-height: 1.6; }
                .footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #eee; text-align: center; font-size: 10px; color: #888; }
                .footer p { margin: 0; }
                .footer span { margin: 0 8px; }
            </style>
        </head>
        <body>
            <div class="sheet">
                <header class="header">
                    <div>
                        <h1>${s.name}</h1>
                        <p>Mannequin Professionnel</p>
                    </div>
                    ${n!=null&&n.logo?`<img src="${n.logo}" alt="Logo" />`:""}
                </header>
                <main class="main">
                    <div>
                        <img src="${s.imageUrl}" alt="${s.name}" class="profile-pic" />
                    </div>
                    <div class="space-y-6">
                        <div class="section">
                            <h2>Détails Personnels</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Âge</strong><span>${s.age||"N/A"} ans</span></div>
                                <div class="info-item"><strong>Genre</strong><span>${s.gender}</span></div>
                                <div class="info-item"><strong>Lieu</strong><span>${s.location||"N/A"}</span></div>
                            </div>
                        </div>
                        <div class="section">
                            <h2>Mensurations</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Taille</strong><span>${s.height}</span></div>
                                <div class="info-item"><strong>Poitrine</strong><span>${s.measurements.chest}</span></div>
                                <div class="info-item"><strong>Taille (vêt.)</strong><span>${s.measurements.waist}</span></div>
                                <div class="info-item"><strong>Hanches</strong><span>${s.measurements.hips}</span></div>
                                <div class="info-item"><strong>Pointure</strong><span>${s.measurements.shoeSize} (EU)</span></div>
                            </div>
                        </div>
                        <div class="section">
                            <h2>Contact Agence</h2>
                            <div class="info-grid">
                                <div class="info-item"><strong>Email</strong><span>${o.email||"N/A"}</span></div>
                                <div class="info-item"><strong>Téléphone</strong><span>${o.phone||"N/A"}</span></div>
                            </div>
                        </div>
                    </div>
                </main>
                ${s.portfolioImages&&s.portfolioImages.length>0?`
                <section class="portfolio">
                    <h2>Portfolio</h2>
                    <div class="portfolio-grid">${r}</div>
                </section>`:""}
                <section class="experience">
                    <h2>Expérience & Parcours</h2>
                    <p>${s.experience} ${s.journey}</p>
                </section>
                <footer class="footer">
                    <p style="font-size: 16px; font-weight: bold; color: #333;">Perfect Models Management</p>
                    <div>
                        <span>${o.email}</span> |
                        <span>${o.phone}</span> |
                        <span>${o.address}</span>
                    </div>
                </footer>
            </div>
        </body>
        </html>
    `},B=()=>{const{data:s,saveData:n,isInitialized:o}=w(),[r,p]=l.useState([]),[f,c]=l.useState(null),[m,d]=l.useState(!1);l.useEffect(()=>{s!=null&&s.models&&p([...s.models].sort((i,a)=>i.name.localeCompare(a.name)))},[s==null?void 0:s.models,o]);const u=async i=>{if(!s)return;let a;if(m){if(r.some(t=>t.username===i.username)){alert("Erreur : Cet identifiant (matricule) est déjà utilisé.");return}if(i.id&&r.some(t=>t.id===i.id)){alert("Erreur : Cet ID est déjà utilisé.");return}i.id||(i.id=`${i.name.toLowerCase().replace(/ /g,"-")}-${Date.now()}`),a=[...r,i]}else a=r.map(t=>t.id===i.id?i:t);await n({...s,models:a.sort((t,b)=>t.name.localeCompare(b.name))}),alert(`Mannequin ${m?"créé":"mis à jour"} avec succès.`),c(null),d(!1)},x=async i=>{if(window.confirm("Êtes-vous sûr de vouloir supprimer ce mannequin ? Cette action est irréversible.")){if(!s)return;const a=r.filter(t=>t.id!==i);await n({...s,models:a}),alert("Mannequin supprimé avec succès.")}},g=()=>{d(!0),c({id:"",name:"",username:"",password:"",level:"Débutant",gender:"Femme",height:"1m",imageUrl:"",isPublic:!1,measurements:{chest:"",waist:"",hips:"",shoeSize:""},categories:[],experience:"",journey:"",quizScores:{}})},v=async i=>{if(!s)return;const a=r.map(t=>t.id===i?{...t,isPublic:!t.isPublic}:t);await n({...s,models:a})},j=i=>{if(!(s!=null&&s.siteConfig)||!(s!=null&&s.contactInfo)){alert("Les informations du site ne sont pas chargées.");return}const a=R(i,s.siteConfig,s.contactInfo),t=window.open("","_blank");t?(t.document.write(a),t.document.close(),t.focus(),setTimeout(()=>{t.print(),t.close()},250)):alert("Veuillez autoriser les pop-ups pour imprimer la fiche.")};return f?e.jsx("div",{className:"bg-pm-dark text-pm-off-white py-20 min-h-screen",children:e.jsxs("div",{className:"container mx-auto px-6 max-w-4xl",children:[e.jsxs("button",{onClick:()=>{c(null),d(!1)},className:"inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline",children:[e.jsx(h,{className:"w-5 h-5"}),"Retour à la liste"]}),e.jsx(y,{model:f,onSave:u,onCancel:()=>{c(null),d(!1)},isCreating:m,mode:"admin"})]})}):e.jsxs("div",{className:"bg-pm-dark text-pm-off-white py-20 min-h-screen",children:[e.jsx($,{title:"Admin - Gérer les Mannequins",noIndex:!0}),e.jsxs("div",{className:"container mx-auto px-6",children:[e.jsxs("div",{className:"admin-page-header",children:[e.jsxs("div",{children:[e.jsxs(N,{to:"/admin",className:"inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline",children:[e.jsx(h,{className:"w-5 h-5"}),"Retour au Dashboard"]}),e.jsx("h1",{className:"admin-page-title",children:"Gérer les Mannequins"}),e.jsx("p",{className:"admin-page-subtitle",children:"Ajoutez, modifiez ou supprimez les profils des mannequins."})]}),e.jsxs("button",{onClick:g,className:"action-btn !flex !items-center !gap-2 !px-4 !py-2",children:[e.jsx(M,{className:"w-5 h-5"})," Ajouter un Mannequin"]})]}),e.jsx("div",{className:"admin-section-wrapper overflow-x-auto",children:e.jsxs("table",{className:"admin-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Photo"}),e.jsx("th",{children:"Nom"}),e.jsx("th",{children:"Niveau"}),e.jsx("th",{children:"Public"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:r.map(i=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("img",{src:i.imageUrl,alt:i.name,className:"w-12 h-16 object-cover rounded"})}),e.jsx("td",{className:"font-semibold",children:i.name}),e.jsx("td",{children:e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${i.level==="Pro"?"bg-pm-gold/20 text-pm-gold":"bg-blue-500/20 text-blue-300"}`,children:i.level})}),e.jsx("td",{children:e.jsx("button",{onClick:()=>v(i.id),title:i.isPublic?"Rendre privé":"Rendre public",children:i.isPublic?e.jsx(P,{className:"w-6 h-6 text-green-500"}):e.jsx(E,{className:"w-6 h-6 text-pm-off-white/50"})})}),e.jsx("td",{children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>j(i),className:"p-2 text-pm-gold/70 hover:text-pm-gold",title:"Imprimer la Fiche",children:e.jsx(C,{className:"w-5 h-5"})}),e.jsx("button",{onClick:()=>c(i),className:"p-2 text-pm-gold/70 hover:text-pm-gold",title:"Modifier",children:e.jsx(F,{className:"w-5 h-5"})}),e.jsx("button",{onClick:()=>x(i.id),className:"p-2 text-red-500/70 hover:text-red-500",title:"Supprimer",children:e.jsx(z,{className:"w-5 h-5"})})]})})]},i.id))})]})})]})]})};export{B as default};
