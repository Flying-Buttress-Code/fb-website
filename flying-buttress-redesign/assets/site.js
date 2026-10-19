(function(){
 'use strict';
 const menu = document.getElementById('menu-button');
 const nav = document.getElementById('site-nav');
 if (menu && nav){
  menu.addEventListener('click', function(){
   const open = menu.getAttribute('aria-expanded') !== 'true';
   menu.setAttribute('aria-expanded', String(open));
   menu.setAttribute('aria-label', open?'Close menu':'Open menu');
   nav.classList.toggle('open',open);
  });
  nav.querySelectorAll('a').forEach(function(link){
   link.addEventListener('click',function(){ menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open menu'); nav.classList.remove('open');});
  });
  document.addEventListener('keydown',function(event){ if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');nav.classList.remove('open');}});
 }
 const form=document.getElementById('contact-form');
 if(form){
  const status=document.getElementById('form-status');
  const display=function(message){status.textContent=message;status.classList.add('show');};
  const getMessage=function(){
   const get=function(id){return document.getElementById(id).value.trim();};
   return [
    'Name: '+get('full-name'),
    'Email: '+get('work-email'),
    'Firm: '+get('firm-name'),
    'Firm type: '+get('firm-size'),
    'Topic: '+get('help-topic'),
    '',
    'Message:',
    get('message')
   ].join('\n');
  };
  form.addEventListener('submit',function(event){
   event.preventDefault();
   if(!form.reportValidity())return;
   const subject='Flying Buttress website inquiry - '+document.getElementById('firm-name').value.trim().slice(0,70);
   const url='mailto:info@flyingbuttress.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(getMessage());
   display('Your email application should open with a prepared message. Please review and send it there. Nothing has been submitted through this website.');
   window.location.href=url;
  });
  const copy=document.getElementById('copy-inquiry');
  copy.addEventListener('click',async function(){
   if(!form.reportValidity())return;
   try{ await navigator.clipboard.writeText(getMessage());display('Inquiry copied. Paste it into an email to info@flyingbuttress.com.'); }
   catch(e){ display('Your browser blocked copying. You can use Prepare email instead.'); }
  });
 }
})();
