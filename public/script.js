const API_BASE = "http://localhost:3000";
const btnPublicar=document.getElementById("btn-publicar");
const modalCreate=document.getElementById("create-modal");
const closeCreate=document.getElementById("close-create");
const submitPost=document.getElementById("submit-post");
const cancelPost=document.getElementById("cancel-post");
const gallery=document.getElementById("gallery");

function openCreateModal(){modalCreate.style.display="flex";}
function closeCreateModal(){modalCreate.style.display="none";}
btnPublicar.addEventListener("click",openCreateModal);
closeCreate.addEventListener("click",closeCreateModal);
cancelPost.addEventListener("click",closeCreateModal);
modalCreate.addEventListener("click",e=>{if(e.target===modalCreate)closeCreateModal();});

function escapeHtml(str){if(!str)return"";return str.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"','&quot;').replaceAll("'","&#039;");}
function addPostToGallery(post){const c=document.createElement("div");c.classList.add("post-card");if(post.title)c.innerHTML+=`<h3>${escapeHtml(post.title)}</h3>`;if(post.text)c.innerHTML+=`<p>${escapeHtml(post.text)}</p>`;if(post.imageUrl){const imgSrc=post.imageUrl.startsWith("http")?post.imageUrl:(API_BASE+post.imageUrl);c.innerHTML+=`<img src="${imgSrc}" alt="post">`;}gallery.prepend(c);}
async function loadPosts(){try{const r=await fetch(API_BASE+"/api/posts");const p=await r.json();p.forEach(addPostToGallery);}catch(e){console.error(e);}}
submitPost.addEventListener("click",async()=>{const title=document.getElementById("post-title").value.trim();const text=document.getElementById("post-text").value.trim();const f=document.getElementById("post-image").files[0];if(!title&&!text&&!f){alert("Adicione algo");return;}const fd=new FormData();fd.append("title",title);fd.append("text",text);if(f)fd.append("image",f);try{submitPost.disabled=true;submitPost.textContent="Publicando...";const r=await fetch(API_BASE+"/api/posts",{method:"POST",body:fd});if(!r.ok)throw new Error("Falha");const n=await r.json();addPostToGallery(n);closeCreateModal();document.getElementById("post-title").value="";document.getElementById("post-text").value="";document.getElementById("post-image").value="";}catch(e){alert("Erro");}finally{submitPost.disabled=false;submitPost.textContent="Publicar";}});
document.addEventListener("DOMContentLoaded",loadPosts);
