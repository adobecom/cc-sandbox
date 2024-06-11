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

function createContinuePSBtn(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelector('li .icon-continue').closest('li').innerText;
  const continueCTA = createTag('div', { class: 'gray-button start-over-button continue body-m', href: '#' });
  const svg = `<svg id="Photoshop_40" data-name="Photoshop 40" xmlns="http://www.w3.org/2000/svg" width="40" height="39" viewBox="0 0 40 39">
  <path id="Path_99550" data-name="Path 99550" d="M7.125,0H33a7.005,7.005,0,0,1,7,7.1V31.9A7.11,7.11,0,0,1,32.875,39H7.125A7.11,7.11,0,0,1,0,31.9V7.1A7.032,7.032,0,0,1,7.125,0Z" fill="#001e36"></path>
  <path id="Path_99551" data-name="Path 99551" d="M7.2,25.375V8.25c0-.125,0-.25.125-.25h5.25a8.738,8.738,0,0,1,3.375.5A6.555,6.555,0,0,1,18.2,9.75a4.945,4.945,0,0,1,1.25,1.875,6.349,6.349,0,0,1,.375,2.125,6.1,6.1,0,0,1-1,3.5,5.926,5.926,0,0,1-2.625,2,11.784,11.784,0,0,1-3.75.625H10.825V25.25a.436.436,0,0,1-.125.25H7.45C7.325,25.625,7.2,25.5,7.2,25.375ZM10.825,11.25v5.625h1.5a9.649,9.649,0,0,0,1.875-.25,3.236,3.236,0,0,0,1.375-.875,2.444,2.444,0,0,0,.5-1.75,3.328,3.328,0,0,0-.375-1.5,4.313,4.313,0,0,0-1.125-1,5.182,5.182,0,0,0-2-.375H11.45A2.543,2.543,0,0,0,10.825,11.25Z" transform="translate(1.8 1.942)" fill="#31a8ff"></path>
  <path id="Path_99552" data-name="Path 99552" d="M27.35,14.95a6.279,6.279,0,0,0-1.625-.625,9.649,9.649,0,0,0-1.875-.25,2.752,2.752,0,0,0-1,.125c-.25,0-.375.125-.5.375-.125.125-.125.25-.125.5a.459.459,0,0,0,.125.375,2.727,2.727,0,0,0,.625.5,4.44,4.44,0,0,0,1.125.5,9.369,9.369,0,0,1,2.5,1.25,7.163,7.163,0,0,1,1.375,1.375,3.993,3.993,0,0,1,.375,1.75,5.093,5.093,0,0,1-.625,2.25,5.535,5.535,0,0,1-1.875,1.5,7.564,7.564,0,0,1-3,.5,13.774,13.774,0,0,1-2.25-.25,9.207,9.207,0,0,1-1.75-.5c-.125,0-.25-.25-.25-.375V21.075l.125-.125h.125a10.814,10.814,0,0,0,2.125.875,9.715,9.715,0,0,0,2,.25,3.345,3.345,0,0,0,1.375-.25.844.844,0,0,0,.5-.75.687.687,0,0,0-.375-.625,4.954,4.954,0,0,0-1.625-.75,8.644,8.644,0,0,1-2.375-1.25,4.324,4.324,0,0,1-1.25-1.375,3.992,3.992,0,0,1-.375-1.75,3.777,3.777,0,0,1,.625-2,3.448,3.448,0,0,1,1.75-1.5,6.694,6.694,0,0,1,3-.625,12.127,12.127,0,0,1,2.125.125,6.593,6.593,0,0,1,1.5.375l.125.125v3l-.125.125Z" transform="translate(4.65 2.731)" fill="#31a8ff"></path>
  </svg>`;
  continueCTA.innerHTML = `${svg} ${btnText}`;
return continueCTA;
}

function selectorTrayWithImgs(layer, data) {
  const selectorTray = createTag('div', { class: 'body-s selector-tray' });
  const trayItems = createTag('div', { class: 'tray-items' });
  const productIcon = createTag('div', { class: 'product-icon' });
  const productSvg = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" version="1.1" viewBox="0 0 18 18">
  <defs>
    <style>
      .cls-1 {
        fill: #ff13dc;
        fill-opacity: 0;
      }

      .cls-1, .cls-2 {
        stroke-width: 0px;
      }

      .cls-2 {
        fill: #fff;
      }
    </style>
  </defs>
  <rect id="Canvas" class="cls-1" width="18" height="18"/>
  <path class="cls-2" d="M16.3,10h-.9c-.3,0-.5.2-.6.5-.8,3-4,4.8-7,4-1-.3-1.8-.8-2.5-1.5l-.3-.3,2-2c0,0,.1-.2.1-.3,0-.2-.2-.4-.4-.4H1.2c-.1,0-.2.1-.2.2v5.4c0,.2.2.4.4.4.1,0,.2,0,.3-.1l1.8-1.8.2.2c1,1,2.3,1.8,3.6,2.2,4.1,1.1,8.3-1.4,9.4-5.5,0-.1,0-.2,0-.4,0-.3-.1-.5-.4-.6,0,0,0,0,0,0Z"/>
  <path class="cls-2" d="M16.6,2c-.1,0-.2,0-.3.1l-1.8,1.8-.2-.2c-1-1-2.3-1.8-3.6-2.2C6.6.5,2.3,2.9,1.3,7.1c0,.1,0,.2,0,.4,0,.3.1.5.4.6,0,0,0,0,0,0h.9c.3,0,.5-.2.6-.5.8-3,4-4.8,7-4,1,.3,1.8.8,2.5,1.5l.3.3-2,2c0,0-.1.2-.1.3,0,.2.2.4.4.4h5.4c.1,0,.2-.1.2-.2V2.4c0-.2-.2-.4-.4-.4Z"/>
</svg>`;
  productIcon.innerHTML = `${productSvg}`;
  const removeBg = removeBgButton(data);
  const changeBg = changeBgButton(data);
  const uploadCTA = uploadButton(data);
  const continuePS = createContinuePSBtn(data);
  const selectorTrayBgimgs = selectorTrayWithBGImgs(layer, data);
  trayItems.append(productIcon, removeBg, changeBg, uploadCTA, continuePS);
  selectorTray.append(selectorTrayBgimgs, trayItems);
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
  const removeBgCTA = createTag('div', { class: 'gray-button start-over-button removebg-button body-m', href: '#' });
  const svg = `<svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path opacity="0.35" d="M9.84424 7.35547H3.45557V13.7441H9.84424V7.35547Z" fill="#292929"/>
  <path opacity="0.35" d="M16.2329 20.1348H15.1267L9.84424 15.3433V13.7461H16.2329V20.1348Z" fill="#292929"/>
  <path opacity="0.35" d="M22.6216 7.35547H16.2329V13.7441H22.6216V7.35547Z" fill="#292929"/>
  <path opacity="0.35" d="M29.0103 13.7461H22.6216V20.1348H29.0103V13.7461Z" fill="#292929"/>
  <path opacity="0.35" d="M22.6216 20.5873L16.2329 22.4647V20.1328H22.6216V20.5873Z" fill="#292929"/>
  <path d="M23.4199 12.9778C23.4199 14.3009 22.3473 15.3735 21.0242 15.3735C19.701 15.3735 18.6284 14.3009 18.6284 12.9778C18.6284 11.6546 19.701 10.582 21.0242 10.582C22.3473 10.582 23.4199 11.6546 23.4199 12.9778Z" fill="#292929"/>
  <path d="M27.0138 5.75781H5.45203C3.47039 5.75781 1.8584 7.37058 1.8584 9.35144V24.5245C1.8584 26.5054 3.47039 28.1182 5.45203 28.1182H27.0138C28.9954 28.1182 30.6074 26.5054 30.6074 24.5245V9.35144C30.6074 7.37058 28.9954 5.75781 27.0138 5.75781ZM5.45203 8.15356H27.0138C27.6743 8.15356 28.2117 8.69167 28.2117 9.35144V22.4653L25.1632 19.4164C23.8062 18.0594 21.4362 18.0594 20.0808 19.4164L18.1132 21.3832C17.958 21.5392 17.703 21.5376 17.5478 21.3848L12.3858 16.2221C11.0289 14.8651 8.65885 14.8651 7.30345 16.2221L4.25417 19.2714V9.35144C4.25417 8.69167 4.79148 8.15356 5.45203 8.15356ZM5.45203 25.7224C4.79148 25.7224 4.25415 25.1843 4.25415 24.5245V22.6591L8.99807 17.9159C9.44884 17.4636 10.2388 17.4636 10.6912 17.9159L15.8547 23.0802C16.9434 24.1658 18.716 24.1705 19.8062 23.0786L21.7754 21.1103C22.2262 20.6579 23.0162 20.6579 23.4685 21.1103L27.782 25.4237C27.5727 25.6027 27.31 25.7224 27.0138 25.7224L5.45203 25.7224Z" fill="#292929"/>
  </svg>
  `; //data.target.classList.contains('light') ? svgWhite : svgBlack;
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
    data.target.querySelector('.continue').style.display = 'flex';
    removeBgCTA.style.display = 'none';
    if (data.target.querySelector('.changebg-button'))
      data.target.querySelector('.changebg-button').style.display = 'flex';
  });
  return removeBgCTA;
}
/*-------------- Remove Background --------------*/


function changeBgButton(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelector('ul li .icon-changebg').closest('li').innerText;
  const changeBgCTA = createTag('div', { class: 'gray-button start-over-button changebg-button body-m', href: '#' });
  const svg = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_1462_28583)">
  <path d="M18.4972 10.2344C18.4972 11.2592 17.6664 12.0899 16.6416 12.0899C15.6169 12.0899 14.7861 11.2592 14.7861 10.2344C14.7861 9.20964 15.6169 8.37891 16.6416 8.37891C17.6664 8.37891 18.4972 9.20964 18.4972 10.2344Z" fill="#292929"/>
  <path d="M19.1159 13.9219C16.0415 13.9219 13.5493 16.4141 13.5493 19.4884C13.5493 22.5627 16.0415 25.0549 19.1159 25.0549C22.1902 25.0549 24.6824 22.5627 24.6824 19.4884C24.6824 16.4141 22.1902 13.9219 19.1159 13.9219ZM22.2084 20.2615H19.889V22.5809C19.889 23.0074 19.5423 23.3541 19.1159 23.3541C18.6894 23.3541 18.3427 23.0074 18.3427 22.5809V20.2615H16.0233C15.5969 20.2615 15.2502 19.9148 15.2502 19.4884C15.2502 19.062 15.5969 18.7153 16.0233 18.7153H18.3427V16.3959C18.3427 15.9695 18.6894 15.6228 19.1159 15.6228C19.5423 15.6228 19.889 15.9695 19.889 16.3959V18.7153H22.2084C22.6348 18.7153 22.9815 19.062 22.9815 19.4884C22.9815 19.9148 22.6348 20.2615 22.2084 20.2615Z" fill="#292929"/>
  <path d="M21.2807 4.64454H4.58112C3.04694 4.64454 1.79785 5.89364 1.79785 7.42781V19.1794C1.79785 20.7136 3.04694 21.9626 4.58112 21.9626H10.8773C11.3895 21.9626 11.805 21.5471 11.805 21.0349C11.805 20.5227 11.3895 20.1071 10.8773 20.1071H4.58112C4.07012 20.1071 3.65336 19.6904 3.65336 19.1794V17.7334L7.32694 14.061C7.68935 13.6986 8.27644 13.6986 8.63885 14.061L11.0078 16.4299C11.3702 16.7923 11.9573 16.7923 12.3197 16.4299C12.6821 16.0675 12.6821 15.4804 12.3197 15.118L9.95076 12.7491C8.86596 11.6643 7.09984 11.6643 6.01505 12.7491L3.65338 15.1102V7.4278C3.65338 6.9168 4.07014 6.50004 4.58113 6.50004H21.2807C21.7917 6.50004 22.2085 6.9168 22.2085 7.4278V12.1862C22.2085 12.6984 22.624 13.1139 23.1362 13.1139C23.6484 13.1139 24.064 12.6984 24.064 12.1862V7.4278C24.064 5.89362 22.8149 4.64454 21.2807 4.64454Z" fill="#292929"/>
  </g>
  <defs>
  <clipPath id="clip0_1462_28583">
  <rect width="24.7402" height="24.7402" fill="white" transform="translate(0.560547 0.933594)"/>
  </clipPath>
  </defs>
  </svg>
  `;
  // const svg = data.target.classList.contains('light') ? svgWhite : svgBlack;
  changeBgCTA.innerHTML = `${svg} ${btnText}`;
  changeBgCTA.addEventListener('click', async (e) => {
    const bgimgs = data.target.querySelector('.bg-imgs');
    console.log(bgimgs.style.display);
    if (bgimgs.style.display != 'flex') {
      bgimgs.style.display='flex';
      return;
    }
    bgimgs.style.display='none';
  });
  return changeBgCTA;
}

/*-------------- Upload Button --------------*/
function uploadButton(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelectorAll('ul li')[2]?.innerText;
  const uploadCTA = createTag('div', { class: 'gray-button start-over-button upload-button body-m', href: '#' });
  const svgBlack = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_811_34435)">
  <path d="M31.5261 18.6357C31.5261 20.4848 30.8063 22.2223 29.4993 23.5286C28.1922 24.8349 26.4547 25.5547 24.6064 25.5547H23.5567C22.8953 25.5547 22.3588 25.0181 22.3588 24.3568C22.3588 23.6955 22.8953 23.1589 23.5567 23.1589H24.6064C25.8144 23.1589 26.9506 22.6887 27.8054 21.8339C28.6601 20.98 29.1304 19.8445 29.1304 18.6357C29.1304 17.4737 28.6882 16.3718 27.8857 15.5342C27.0848 14.6974 26.0062 14.2029 24.8474 14.1413C24.441 14.1195 24.073 13.8926 23.871 13.5393C23.669 13.1852 23.6604 12.7532 23.8491 12.3921C24.0496 12.0069 24.204 11.6099 24.3077 11.2122C24.4169 10.7973 24.4722 10.3723 24.4722 9.94801C24.4722 8.52087 23.917 7.17948 22.9086 6.17035C20.9792 4.24252 17.6437 4.13567 15.613 5.94575C14.6537 6.80282 14.0322 7.97808 13.8653 9.25628C13.8161 9.63296 13.5908 9.9644 13.2585 10.1484C12.9271 10.3333 12.5278 10.3489 12.1808 10.1913C11.9117 10.0689 11.6349 9.97454 11.3557 9.91138C9.98156 9.59865 8.57389 10.0221 7.60452 10.9689C6.84649 11.7082 6.42926 12.6885 6.42926 13.7288C6.42926 13.9963 6.45813 14.2638 6.51427 14.5251C6.56964 14.7778 6.65231 15.0289 6.75836 15.2691C6.91746 15.627 6.89094 16.0404 6.68817 16.3757C6.48462 16.711 6.13056 16.9255 5.73985 16.9505C4.94751 17.0012 4.21209 17.3451 3.66696 17.9183C3.12183 18.4938 2.8208 19.248 2.8208 20.0419C2.8208 20.8747 3.14522 21.6577 3.73403 22.2465C4.32282 22.8346 5.10504 23.159 5.93793 23.159H9.29136C9.95268 23.159 10.4892 23.6955 10.4892 24.3569C10.4892 25.0182 9.95268 25.5547 9.29136 25.5547H5.93793C4.46553 25.5547 3.08128 24.9815 2.04015 23.9404C0.998256 22.8993 0.425049 21.5143 0.425049 20.0419C0.425049 18.6319 0.959254 17.2928 1.92864 16.2696C2.54708 15.6185 3.30354 15.1349 4.13643 14.8487C4.0678 14.4791 4.0335 14.1039 4.0335 13.7288C4.0335 12.0373 4.70731 10.4479 5.9317 9.25395C7.45867 7.76207 9.65869 7.09761 11.8033 7.55696C12.2252 6.25536 12.9864 5.07932 14.0181 4.1583C15.4266 2.90272 17.2421 2.21097 19.1317 2.21097C21.1976 2.21097 23.141 3.0158 24.6025 4.47649C26.0632 5.93796 26.868 7.88139 26.868 9.94803C26.868 10.5782 26.7861 11.2083 26.6247 11.8205C26.6075 11.8876 26.5888 11.9546 26.5693 12.0209C27.7212 12.3594 28.7701 12.9934 29.6163 13.877C30.8477 15.163 31.5261 16.8529 31.5261 18.6357Z" fill="white"/>
  <path d="M22.1263 17.2873L17.3301 12.4997C16.8622 12.0334 16.105 12.0326 15.637 12.5005L10.8502 17.2881C10.3823 17.756 10.3823 18.5141 10.8502 18.982C11.0842 19.2159 11.3907 19.3329 11.6971 19.3329C12.0036 19.3329 12.3101 19.2159 12.5441 18.982L15.2947 16.2308V29.3012C15.2947 29.9625 15.8312 30.4991 16.4925 30.4991C17.1539 30.4991 17.6904 29.9625 17.6904 29.3012V16.2441L20.434 18.9828C20.9011 19.4491 21.6592 19.4491 22.1279 18.9812C22.595 18.5133 22.595 17.7545 22.1263 17.2873Z" fill="white"/>
  </g>
  <defs>
  <clipPath id="clip0_811_34435">
  <rect width="31.9433" height="31.9433" fill="#292929"/>
  </clipPath>
  </defs>
  </svg>`;
  const svgWhite = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_811_34435)">
<path d="M31.5261 18.6357C31.5261 20.4848 30.8063 22.2223 29.4993 23.5286C28.1922 24.8349 26.4547 25.5547 24.6064 25.5547H23.5567C22.8953 25.5547 22.3588 25.0181 22.3588 24.3568C22.3588 23.6955 22.8953 23.1589 23.5567 23.1589H24.6064C25.8144 23.1589 26.9506 22.6887 27.8054 21.8339C28.6601 20.98 29.1304 19.8445 29.1304 18.6357C29.1304 17.4737 28.6882 16.3718 27.8857 15.5342C27.0848 14.6974 26.0062 14.2029 24.8474 14.1413C24.441 14.1195 24.073 13.8926 23.871 13.5393C23.669 13.1852 23.6604 12.7532 23.8491 12.3921C24.0496 12.0069 24.204 11.6099 24.3077 11.2122C24.4169 10.7973 24.4722 10.3723 24.4722 9.94801C24.4722 8.52087 23.917 7.17948 22.9086 6.17035C20.9792 4.24252 17.6437 4.13567 15.613 5.94575C14.6537 6.80282 14.0322 7.97808 13.8653 9.25628C13.8161 9.63296 13.5908 9.9644 13.2585 10.1484C12.9271 10.3333 12.5278 10.3489 12.1808 10.1913C11.9117 10.0689 11.6349 9.97454 11.3557 9.91138C9.98156 9.59865 8.57389 10.0221 7.60452 10.9689C6.84649 11.7082 6.42926 12.6885 6.42926 13.7288C6.42926 13.9963 6.45813 14.2638 6.51427 14.5251C6.56964 14.7778 6.65231 15.0289 6.75836 15.2691C6.91746 15.627 6.89094 16.0404 6.68817 16.3757C6.48462 16.711 6.13056 16.9255 5.73985 16.9505C4.94751 17.0012 4.21209 17.3451 3.66696 17.9183C3.12183 18.4938 2.8208 19.248 2.8208 20.0419C2.8208 20.8747 3.14522 21.6577 3.73403 22.2465C4.32282 22.8346 5.10504 23.159 5.93793 23.159H9.29136C9.95268 23.159 10.4892 23.6955 10.4892 24.3569C10.4892 25.0182 9.95268 25.5547 9.29136 25.5547H5.93793C4.46553 25.5547 3.08128 24.9815 2.04015 23.9404C0.998256 22.8993 0.425049 21.5143 0.425049 20.0419C0.425049 18.6319 0.959254 17.2928 1.92864 16.2696C2.54708 15.6185 3.30354 15.1349 4.13643 14.8487C4.0678 14.4791 4.0335 14.1039 4.0335 13.7288C4.0335 12.0373 4.70731 10.4479 5.9317 9.25395C7.45867 7.76207 9.65869 7.09761 11.8033 7.55696C12.2252 6.25536 12.9864 5.07932 14.0181 4.1583C15.4266 2.90272 17.2421 2.21097 19.1317 2.21097C21.1976 2.21097 23.141 3.0158 24.6025 4.47649C26.0632 5.93796 26.868 7.88139 26.868 9.94803C26.868 10.5782 26.7861 11.2083 26.6247 11.8205C26.6075 11.8876 26.5888 11.9546 26.5693 12.0209C27.7212 12.3594 28.7701 12.9934 29.6163 13.877C30.8477 15.163 31.5261 16.8529 31.5261 18.6357Z" fill="#292929"/>
<path d="M22.1263 17.2873L17.3301 12.4997C16.8622 12.0334 16.105 12.0326 15.637 12.5005L10.8502 17.2881C10.3823 17.756 10.3823 18.5141 10.8502 18.982C11.0842 19.2159 11.3907 19.3329 11.6971 19.3329C12.0036 19.3329 12.3101 19.2159 12.5441 18.982L15.2947 16.2308V29.3012C15.2947 29.9625 15.8312 30.4991 16.4925 30.4991C17.1539 30.4991 17.6904 29.9625 17.6904 29.3012V16.2441L20.434 18.9828C20.9011 19.4491 21.6592 19.4491 22.1279 18.9812C22.595 18.5133 22.595 17.7545 22.1263 17.2873Z" fill="#292929"/>
</g>
<defs>
<clipPath id="clip0_811_34435">
<rect width="31.9433" height="31.9433" fill="white"/>
</clipPath>
</defs>
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
      const img = layer.closest('.asset.image.bleed').querySelector('.interactive-holder > picture > img');
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    data.target.querySelector('.continue').style.display = 'flex';
    data.target.querySelector('.changebg-button').style.display = 'none';
    data.target.querySelector('.removebg-button').style.display = 'flex';
  });
  return uploadCTA;
}

function selectorTrayWithBGImgs(layer, data) {
  const selectorTray = createTag('div', { class: 'body-s bg-imgs' });
  const trayItems = createTag('div', { class: 'bg-icons'} );
  const items = data.stepConfigs[data.stepIndex].querySelector('.icon-changebg').closest('li').querySelectorAll('ul li');
  [...items].forEach((i) => {
    const img = i.querySelector('img')
    trayItems.append(img);
    img.addEventListener('click', (e) => {
      data.target.style.backgroundImage = `url('${img.src}')`;
      data.target.style.backgroundSize = 'cover';
    });
  });
  selectorTray.append(trayItems);
  return selectorTray;
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
  const defaultImg = data.target.querySelector('img').src;
  selectorTray.querySelector('.product-icon').addEventListener('click', (e) => {
    data.target.querySelector('img').src = defaultImg;
    data.target.style.backgroundImage = `linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(135deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(135deg, transparent 75%, #ccc 75%)`;
    data.target.style.backgroundSize = '25px 25px';
    data.target.style.backgroundPosition = '0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px';
    data.target.querySelector('.removebg-button').style.display = 'flex';
    data.target.querySelector('.changebg-button').style.display = 'none';
  });
  return layer;
}
