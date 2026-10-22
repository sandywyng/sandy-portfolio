(() => {
  'use strict';
  const key='wing-yi-ng-portrait-v1';
  const button=document.querySelector('.portrait-upload');
  const input=document.querySelector('#portrait-file');
  const image=document.querySelector('.portrait-image');
  const initials=document.querySelector('.portrait-initials');
  const label=document.querySelector('.portrait-upload-label');
  const feedback=document.querySelector('.portrait-feedback');
  const remove=document.querySelector('.portrait-remove');
  function show(data){
    image.src=data;image.hidden=false;initials.hidden=true;remove.hidden=false;
    button.classList.add('has-portrait');document.body.classList.add('has-portrait-preview');label.textContent='Change portrait';
    button.setAttribute('aria-label','Change portrait of Wing Yi Ng');
  }
  try{const saved=localStorage.getItem(key);if(saved&&/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(saved)){show(saved);feedback.textContent='Photo preview saved in this browser.';}}catch{}
  button.disabled=!document.body.classList.contains('editing-mode');
  document.addEventListener('portfolio-edit-mode',()=>{button.disabled=false;});
  button.addEventListener('click',()=>{if(document.body.classList.contains('editing-mode'))input.click();});
  remove.addEventListener('click',()=>{image.hidden=true;image.removeAttribute('src');initials.hidden=false;remove.hidden=true;button.classList.remove('has-portrait');document.body.classList.remove('has-portrait-preview');label.textContent='Add portrait +';button.setAttribute('aria-label','Upload a portrait of Wing Yi Ng');feedback.textContent='Preview your photo here.';try{localStorage.removeItem(key);}catch{}});
  input.addEventListener('change',async()=>{
    const file=input.files?.[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){feedback.textContent='Choose a JPG, PNG, or WebP image under 10 MB.';input.value='';return;}
    button.disabled=true;feedback.textContent='Preparing your portrait…';
    try{
      const bitmap=await createImageBitmap(file);
      const scale=Math.min(1,800/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
      canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
      const data=canvas.toDataURL('image/webp',.88);show(data);
      try{localStorage.setItem(key,data);feedback.textContent='Saved in this browser. Attach the original photo in chat to add it to the site for everyone.';}
      catch{feedback.textContent='Preview added for this visit. Attach the original photo in chat to keep it on the site.';}
    }catch{feedback.textContent='This image could not be opened. Try another JPG, PNG, or WebP.';}
    finally{button.disabled=false;input.value='';}
  });
})();
