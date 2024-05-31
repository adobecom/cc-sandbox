import { createTag } from '../../../scripts/utils.js';
import createprogressCircle from '../../progress-circle/progress-circle.js';
import { getBearerToken } from '../../../blocks/unity/unity.js';

function toDataURL(url) {
  let pass = null;
  let fail = null;
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = () => { 
      let r = reader.result;
      if (r.startsWith('data:*/*')) {
        r = r.replace('data:*/*', 'data:image/jpeg');
      }
      pass(r); 
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
  return new Promise((res, rej) => {
    pass = res;
    fail = rej;
  })
}

async function getImageBlobData(e, elem = null) {
  const image = elem.querySelector(':scope > picture > img').src;
  let base64img = null;
  if (!image.includes('data:image/jpeg')) {
    const url = new URL(image);
    base64img = await toDataURL(`${url.origin}${url.pathname}`);
  }
  else base64img = image;
  let binary = atob(base64img.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return array;
}

async function uploadToS3(s3Url, blobData) {
  const options = {
    method: 'PUT',
    headers: {'Content-Type': 'image/jpeg'},
    body: blobData,
  };
  const res = await fetch(s3Url, options);
  if (res.status !== 200) throw('Failed to upload to s3!!');
}

function selectorTrayWithImgs(layer, data) {
  const selectorTray = createTag('div', { class: 'body-s selector-tray' });
  const trayItems = createTag('div', { class: 'tray-items' });
  const productIcon = createTag('div', { class: 'product-icon' });
  const productSvg = `<svg id="Photoshop_40" data-name="Photoshop 40" xmlns="http://www.w3.org/2000/svg" width="40" height="39" viewBox="0 0 40 39">
  <path id="Path_99550" data-name="Path 99550" d="M7.125,0H33a7.005,7.005,0,0,1,7,7.1V31.9A7.11,7.11,0,0,1,32.875,39H7.125A7.11,7.11,0,0,1,0,31.9V7.1A7.032,7.032,0,0,1,7.125,0Z" fill="#001e36"/>
  <path id="Path_99551" data-name="Path 99551" d="M7.2,25.375V8.25c0-.125,0-.25.125-.25h5.25a8.738,8.738,0,0,1,3.375.5A6.555,6.555,0,0,1,18.2,9.75a4.945,4.945,0,0,1,1.25,1.875,6.349,6.349,0,0,1,.375,2.125,6.1,6.1,0,0,1-1,3.5,5.926,5.926,0,0,1-2.625,2,11.784,11.784,0,0,1-3.75.625H10.825V25.25a.436.436,0,0,1-.125.25H7.45C7.325,25.625,7.2,25.5,7.2,25.375ZM10.825,11.25v5.625h1.5a9.649,9.649,0,0,0,1.875-.25,3.236,3.236,0,0,0,1.375-.875,2.444,2.444,0,0,0,.5-1.75,3.328,3.328,0,0,0-.375-1.5,4.313,4.313,0,0,0-1.125-1,5.182,5.182,0,0,0-2-.375H11.45A2.543,2.543,0,0,0,10.825,11.25Z" transform="translate(1.8 1.942)" fill="#31a8ff"/>
  <path id="Path_99552" data-name="Path 99552" d="M27.35,14.95a6.279,6.279,0,0,0-1.625-.625,9.649,9.649,0,0,0-1.875-.25,2.752,2.752,0,0,0-1,.125c-.25,0-.375.125-.5.375-.125.125-.125.25-.125.5a.459.459,0,0,0,.125.375,2.727,2.727,0,0,0,.625.5,4.44,4.44,0,0,0,1.125.5,9.369,9.369,0,0,1,2.5,1.25,7.163,7.163,0,0,1,1.375,1.375,3.993,3.993,0,0,1,.375,1.75,5.093,5.093,0,0,1-.625,2.25,5.535,5.535,0,0,1-1.875,1.5,7.564,7.564,0,0,1-3,.5,13.774,13.774,0,0,1-2.25-.25,9.207,9.207,0,0,1-1.75-.5c-.125,0-.25-.25-.25-.375V21.075l.125-.125h.125a10.814,10.814,0,0,0,2.125.875,9.715,9.715,0,0,0,2,.25,3.345,3.345,0,0,0,1.375-.25.844.844,0,0,0,.5-.75.687.687,0,0,0-.375-.625,4.954,4.954,0,0,0-1.625-.75,8.644,8.644,0,0,1-2.375-1.25,4.324,4.324,0,0,1-1.25-1.375,3.992,3.992,0,0,1-.375-1.75,3.777,3.777,0,0,1,.625-2,3.448,3.448,0,0,1,1.75-1.5,6.694,6.694,0,0,1,3-.625,12.127,12.127,0,0,1,2.125.125,6.593,6.593,0,0,1,1.5.375l.125.125v3l-.125.125Z" transform="translate(4.65 2.731)" fill="#31a8ff"/>
</svg>`;
  productIcon.innerHTML = `${productSvg}`;
  const removeBg = removeBgButton(data);
  const uploadCTA = uploadButton(data);
  trayItems.append(productIcon, removeBg, uploadCTA);
  selectorTray.append(trayItems);
  return selectorTray;
}

function loadImg(img) {
  return new Promise((res) => {
    img.loading = 'eager';
    img.fetchpriority = 'high';
    if (img.complete) res();
    else {
      img.onload = () => res();
      img.onerror = () => res();
    }
  });
}

/*-------------- Remove Background --------------*/

function removeBgButton(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelectorAll('ul li')[1].innerText;
  let image = null;
  const removeBgCTA = createTag('div', { class: 'gray-button start-over-button body-m', href: '#' });
  const svgBlack = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.2429 16.4186L26.4445 18.3827V26.4443C26.4445 27.4875 25.5988 28.3332 24.5556 28.3332H9.4445C8.4013 28.3332 7.55561 27.4875 7.55561 26.4443V11.3332C7.55561 10.29 8.4013 9.44428 9.4445 9.44428H17.9205L14.3155 5.6665H9.4445C6.31489 5.6665 3.77783 8.20357 3.77783 11.3332V26.4443C3.77783 29.5738 6.31489 32.111 9.4445 32.111H24.5556C27.6851 32.111 30.2223 29.5738 30.2223 26.4443V16.1926L29.0002 16.1138C28.7146 16.0954 28.4361 16.2075 28.2429 16.4186Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M30.2828 0.223145L29.44 6.60702C29.3677 7.15425 29.5475 7.70473 29.9289 8.10374L33.9883 12.3505L28.125 11.9718C27.5742 11.9362 27.0372 12.1523 26.6645 12.5593L22.3159 17.3087L23.1513 10.9187C23.2227 10.3726 23.0431 9.8235 22.6629 9.42511L18.6099 5.17946L24.4666 5.55625C25.0164 5.59161 25.5525 5.37624 25.9252 4.97042L30.2828 0.223145Z" fill="white"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7656 14.3374L18.283 17.9922C18.2164 18.4963 18.3821 19.0034 18.7334 19.3709L21.0412 21.7853L17.7078 21.57C17.2004 21.5371 16.7056 21.7362 16.3623 22.1111L13.8727 24.8302L14.3511 21.171C14.4169 20.668 14.2514 20.1622 13.9011 19.7952L11.5967 17.3813L14.9266 17.5955C15.433 17.6281 15.927 17.4297 16.2702 17.0558L18.7656 14.3374Z" fill="white"/>
  </svg>`;
  const svgWhite = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.2429 16.4186L26.4445 18.3827V26.4443C26.4445 27.4875 25.5988 28.3332 24.5556 28.3332H9.4445C8.4013 28.3332 7.55561 27.4875 7.55561 26.4443V11.3332C7.55561 10.29 8.4013 9.44428 9.4445 9.44428H17.9205L14.3155 5.6665H9.4445C6.31489 5.6665 3.77783 8.20357 3.77783 11.3332V26.4443C3.77783 29.5738 6.31489 32.111 9.4445 32.111H24.5556C27.6851 32.111 30.2223 29.5738 30.2223 26.4443V16.1926L29.0002 16.1138C28.7146 16.0954 28.4361 16.2075 28.2429 16.4186Z" fill="black"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M30.2828 0.223145L29.44 6.60702C29.3677 7.15425 29.5475 7.70473 29.9289 8.10374L33.9883 12.3505L28.125 11.9718C27.5742 11.9362 27.0372 12.1523 26.6645 12.5593L22.3159 17.3087L23.1513 10.9187C23.2227 10.3726 23.0431 9.8235 22.6629 9.42511L18.6099 5.17946L24.4666 5.55625C25.0164 5.59161 25.5525 5.37624 25.9252 4.97042L30.2828 0.223145Z" fill="black"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7656 14.3374L18.283 17.9922C18.2164 18.4963 18.3821 19.0034 18.7334 19.3709L21.0412 21.7853L17.7078 21.57C17.2004 21.5371 16.7056 21.7362 16.3623 22.1111L13.8727 24.8302L14.3511 21.171C14.4169 20.668 14.2514 20.1622 13.9011 19.7952L11.5967 17.3813L14.9266 17.5955C15.433 17.6281 15.927 17.4297 16.2702 17.0558L18.7656 14.3374Z" fill="black"/>
  </svg>`;
  const svg = data.target.classList.contains('light') ? svgWhite : svgBlack;
  removeBgCTA.innerHTML = `${svg} ${btnText}`;
  removeBgCTA.addEventListener('click', async (e) => {
    if (e.target.closest('.disable-click')) {
      console.log('click disabled');
      return;
    }
    const circle = await createprogressCircle();
    data.target.appendChild(circle);
    data.target.querySelector('.tray-items').classList.add('disable-click');

    data.target.classList.add('loading');
    const options1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getBearerToken(),
        'x-api-key': 'leo',
      }
    };
    const res1 = await fetch('https://assistant-int.adobe.io/api/v1/asset', options1);
    const { id, href} = await res1.json();
    const array = await getImageBlobData(null, data.target);
    let blobData = new Blob([new Uint8Array(array)], { type: 'image/jpeg', });
    await uploadToS3(href, blobData);
    const options2 = {
      method: 'POST',
      headers: {
        Authorization: getBearerToken(),
        'Content-Type': 'application/json',
        'x-api-key': 'leo'
      },
      body: `{"surfaceId":"Unity","assets":[{"id": "${id}"}]}`
    };
    
    const res2 = await fetch('https://assistant-int.adobe.io/api/v1/providers/PhotoshopRemoveBackground', options2);
    const { outputUrl } = await res2.json();
    const img = document.querySelector('.interactive-holder > picture > img');
    img.src = outputUrl;
    await loadImg(img);
    data.target.classList.remove('loading');
    circle.remove();
    data.target.querySelector('.tray-items').classList.remove('disable-click');
  });
  return removeBgCTA;
}
/*-------------- Remove Background --------------*/

/*-------------- Upload Button --------------*/
function uploadButton(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelectorAll('ul li')[2]?.innerText;
  const uploadCTA = createTag('div', { class: 'gray-button start-over-button upload-button body-m', href: '#' });
  const svgBlack = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10" stroke="#fff"/>
                      <polyline points="16 12 12 8 8 12" stroke="#fff"/>
                      <line stroke="#fff" x1="12" y1="16" x2="12" y2="8"/>
                    </svg>`;
  const svgWhite = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10" stroke="#fff"/>
                      <polyline points="16 12 12 8 8 12" stroke="#fff"/>
                      <line stroke="#fff" x1="12" y1="16" x2="12" y2="8"/>
                    </svg>`;
  const svg = data.target.classList.contains('light') ? svgWhite : svgBlack;
  uploadCTA.innerHTML = `<label id="file-input-label" for="file-input">${svg} <span> ${btnText} </span><span></span></label>
                        <input type='file' class='upload-file' id="file-input" name="file-input" />`;
  uploadCTA.querySelector('.upload-file').addEventListener('change', async (e) => {
    if (e.target.closest('.disable-click')) {
      console.log('click disabled');
      return;
    }
    const layer = e.target.closest('.layer');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
      if (!e.target.result.includes('data:image/jpeg')) return alert('Wrong file type - JPEG only.');
      const img = layer.closest('.foreground').querySelector('.interactive-holder > picture > img');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  return uploadCTA;
}
/*-------------- Upload Button --------------*/

export default async function stepInit(data) {
  data.target.classList.add('step-selector-tray-edits');
  const config = data.stepConfigs[data.stepIndex];
  const layer = createTag('div', { class: `layer layer-${data.stepIndex}` });
  const trayTitle = createTag('div', { class: 'tray-title' });
  trayTitle.src = data.stepConfigs[data.stepIndex].querySelector('ul li').innerText;
  const selectorTray = selectorTrayWithImgs(layer, data);
  layer.append(selectorTray);
  /*layer.append(selectorTray);*/
  return layer;
}
