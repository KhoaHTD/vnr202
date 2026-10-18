(() => {
 'use strict';
 const button=document.getElementById('preview-ending');
 const ending=window.StoryEnding.create({onFinish:()=>button.focus()});
 ending.prepare();button.addEventListener('click',()=>ending.start());
 window.EndingPreview=Object.freeze({state:()=>ending.state()});
})();
