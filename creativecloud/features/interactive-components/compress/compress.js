import { createTag } from '../../../scripts/utils.js';
import defineDeviceByScreenSize from '../../../scripts/decorate.js';

function applyAccessibility(inputEle, target) {
  let tabbing = false;
  document.addEventListener('keydown', () => {
    tabbing = true;
    inputEle.addEventListener('focus', () => {
      if (tabbing) {
        target.classList.add('focusUploadButton');
      }
    });
    inputEle.addEventListener('blur', () => {
      target.classList.remove('focusUploadButton');
    });
  });
  document.addEventListener('keyup', () => {
    tabbing = false;
  });
}

function appendSVGToButton(picture, button) {
  if (!picture) return;
  const svg = picture.querySelector('img[src*=svg]');
  if (!svg) return;
  const svgClone = svg.cloneNode(true);
  const svgCTACont = createTag('div', { class: 'svg-icon-container' });
  svgCTACont.append(svgClone);
  button.prepend(svgCTACont);
}

function createUploadButton(text, picture, menu, buttonsPanel) {
  const currentVP = defineDeviceByScreenSize().toLocaleLowerCase();
  const btn = createTag('input', { class: 'inputFile', type: 'file', accept: 'application/pdf' });
  const labelBtn = createTag('a', { class: `uploadButton body-${currentVP === 'mobile' ? 'm' : 'xl'}` }, text);
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `${text}`);
  labelBtn.append(btn, analyticsHolder);
  const svg = `<div class='svg-icon-container'>
  <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 379.661"><path fill-rule="nonzero" d="M153.764 151.353c-7.838-.333-13.409-2.935-16.619-7.822-8.724-13.076 3.18-25.997 11.443-35.099 23.441-25.725 80.888-87.554 92.454-101.162 8.768-9.693 21.25-9.693 30.017 0 11.948 13.959 72.287 78.604 94.569 103.628 7.731 8.705 17.292 20.579 9.239 32.633-3.287 4.887-8.798 7.489-16.636 7.822H310.65v96.177c0 12.558-10.304 22.868-22.871 22.868h-63.544c-12.572 0-22.871-10.294-22.871-22.868v-96.177h-47.6zm-153 97.863c-2.622-10.841 1.793-19.33 8.852-24.342a24.767 24.767 0 018.47-3.838c3.039-.738 6.211-.912 9.258-.476 8.585 1.232 16.409 6.775 19.028 17.616a668.81 668.81 0 014.56 20.165 1259.68 1259.68 0 013.611 17.72c4.696 23.707 8.168 38.569 16.924 45.976 9.269 7.844 26.798 10.55 60.388 10.55h254.297c31.012 0 47.192-2.965 55.706-10.662 8.206-7.418 11.414-21.903 15.564-44.131a1212.782 1212.782 0 013.628-18.807c1.371-6.789 2.877-13.766 4.586-20.811 2.619-10.838 10.438-16.376 19.023-17.616 3.02-.434 6.173-.256 9.212.474 3.071.738 5.998 2.041 8.519 3.837 7.05 5.007 11.457 13.474 8.855 24.294l-.011.046a517.834 517.834 0 00-4.181 18.988c-1.063 5.281-2.289 11.852-3.464 18.144l-.008.047c-6.124 32.802-11.141 55.308-27.956 71.112-16.565 15.572-42.513 22.159-89.473 22.159H131.857c-49.096 0-76.074-5.911-93.429-21.279-17.783-15.75-23.173-38.615-30.047-73.314-1.39-7.029-2.728-13.738-3.638-18.091-1.281-6.11-2.6-12.081-3.979-17.761z"/></svg></div>`;
  labelBtn.innerHTML = svg + labelBtn.innerHTML;
  // appendSVGToButton(picture, labelBtn);
  const clone = labelBtn.cloneNode(true);
  clone.classList.add('uploadButtonMobile');
  const mobileInput = clone.querySelector('.inputFile');
  menu.append(clone);
  buttonsPanel.append(menu);
  buttonsPanel.append(labelBtn);
  applyAccessibility(btn, labelBtn);
  applyAccessibility(mobileInput, clone);
}

function createCompressButton(text, picture, layer) {
  const btn = createTag('a', { class: 'continueButton body-xl hide', href: '#' }, text);
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `${text}`);
  btn.append(analyticsHolder);
  appendSVGToButton(picture, btn);
  layer.append(btn);
}

function createDownloadButton(text, picture, layer) {
  const btn = createTag('a', { class: 'downloadButton body-xl hide', href: '#' }, text);
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `${text}`);
  btn.append(analyticsHolder);
  appendSVGToButton(picture, btn);
  layer.append(btn);
}

function handleInput(option, buttonsPanel, menu, layer) {
  const inputType = option.classList[1].split('icon-')[1];
  const sibling = option.nextSibling;
  const text = sibling.nodeValue.trim();
  let picture = '';
  if (sibling.nextSibling && sibling.nextSibling.tagName === 'PICTURE') {
    picture = sibling.nextSibling;
  }
  switch (inputType) {
    case 'upload':
      createUploadButton(text, picture, menu, buttonsPanel);
      break;
    case 'compress':
      createCompressButton(text, picture, layer);
      break;
    case 'download':
      createDownloadButton(text, picture, layer);
      break;
    default:
      window.lana.log(`Unknown input type: ${inputType}`);
      break;
  }
}

async function createPdfButtons(data, layer) {
  const buttonsPanel = createTag('div', { class: 'panel' });
  const menu = createTag('div', { class: 'menu' });
  const config = data.stepConfigs[data.stepIndex];
  const options = config.querySelectorAll(':scope > div ul .icon, :scope > div ol .icon');
  [...options].forEach((o) => { handleInput(o, buttonsPanel, menu, layer); });
  layer.prepend(buttonsPanel);
}

function cancelAnalytics(btn) {
  const x = (e) => {
    e.preventDefault();
  };
  btn.addEventListener('click', x);
  const cancelEvent = new Event('click', { detail: { message: 'Cancel button clicked in file dialog' } });
  btn.setAttribute('daa-ll', 'Cancel Upload');
  btn.dispatchEvent(cancelEvent);
  btn.removeEventListener('click', x);
  btn.setAttribute('daa-ll', 'Upload Image');
}

async function createAsset(pdfObj) {
  const url = 'https://assistant-int.adobe.io/api/v1/asset';
  const { bearerToken } = window;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
      'x-api-key': 'leo',
      'x-gw-ims-client-id': 'leo',
      'x-gw-ims-org-id': 'CFB456506041E6960A49412C@AdobeOrg',
      'x-gw-ims-scope': 'indesign_services,openid,AdobeID,read_organizations,photoshop_services,system',
      'x-gw-ims-user-id': '121C1ABC6426CEC10A494118@techacct.adobe.com',
    },
  });
  if (!response.ok) {
    window.lana.log('Error creating asset');
    return false;
  }
  const json = await response.json();
  pdfObj.assetId = json.id;
  pdfObj.presignedUrl = json.href;
  return true;
}

async function uploadAsset(pdfObj) {
  const response = await fetch(pdfObj.presignedUrl, {
    method: 'PUT',
    body: pdfObj.pdfFile,
  });
  if (!response.ok) {
    window.lana.log('Error uploading asset');
    return false;
  }
  return true;
}

function uploadPdf(media, layer, pdfObj) {
  layer.querySelectorAll('.uploadButton').forEach((btn) => {
    const analyticsBtn = btn.querySelector('.interactive-link-analytics-text');
    btn.addEventListener('cancel', () => {
      cancelAnalytics(btn);
    });
    btn.addEventListener('change', async (e) => {
      const image = media.querySelector('picture > img');
      const parent = image.parentElement;
      const file = e.target.files[0];
      if (!file.type.startsWith('application/pdf')) return;
      if (file) {
        pdfObj.fileName = file.name;
        pdfObj.pdfFile = file;
        const pdfUrl = URL.createObjectURL(file);
        const embed = createTag('embed', { src: `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`, width: '100%', height: '100%', type: 'application/pdf' });
        image.remove();
        parent.appendChild(embed);
        pdfObj.pdfUrl = pdfUrl;
        analyticsBtn.innerHTML = 'Upload Button';
        await createAsset(pdfObj);
        await uploadAsset(pdfObj);
        const continueBtn = layer.querySelector('.continueButton');
        if (continueBtn) {
          continueBtn.classList.remove('hide');
        }
      } else {
        cancelAnalytics(btn);
      }
    });
  });
}

function compressPdf(layer, pdfObj) {
  layer.querySelectorAll('.continueButton').forEach((btn) => {
    const analyticsBtn = btn.querySelector('.interactive-link-analytics-text');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = 'https://assistant-int.adobe.io/api/v1/providers/AcrobatCompressPDF';
      const { bearerToken } = window;
      btn.classList.add('loading');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'x-api-key': 'leo',
          'x-gw-ims-client-id': 'leo',
          'x-gw-ims-org-id': 'CFB456506041E6960A49412C@AdobeOrg',
          'x-gw-ims-scope': 'indesign_services,openid,AdobeID,read_organizations,photoshop_services,system',
          'x-gw-ims-user-id': '121C1ABC6426CEC10A494118@techacct.adobe.com',
        },
        body: JSON.stringify({
          query: '',
          apiKey: 'leo',
          assets: [
            { id: pdfObj.assetId },
          ],
        }),
      });
      if (!response.ok) {
        window.lana.log('Error compressing asset');
        btn.classList.remove('loading');
        return false;
      }
      const json = await response.json();
      if (!json) {
        window.lana.log('Error compressing asset');
        btn.classList.remove('loading');
        return false;
      }
      pdfObj.compressedPdfUrl = json.outputUrl;
      analyticsBtn.innerHTML = 'Compress Button';
      btn.classList.remove('loading');
      const downloadBtn = layer.querySelector('.downloadButton');
      if (downloadBtn) {
        downloadBtn.classList.remove('hide');
        btn.classList.add('hide');
      }
      return true;
    });
  });
}

function downloadPdf(layer, pdfObj) {
  layer.querySelectorAll('.downloadButton').forEach((btn) => {
    const analyticsBtn = btn.querySelector('.interactive-link-analytics-text');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      analyticsBtn.innerHTML = 'Download Button';
      const link = createTag('a', { class: 'downloadLink', href: `${pdfObj.compressedPdfUrl}`, download: 'downloaded-file.pdf', target: '_blank' });
      layer.appendChild(link);
      link.click();
      layer.removeChild(link);
    });
  });
}

export default async function stepInit(data) {
  const pdfObj = {};
  data.target.classList.add('step-compress');
  const layer = createTag('div', { class: `layer layer-${data.stepIndex}` });
  await createPdfButtons(data, layer);
  uploadPdf(data.target, layer, pdfObj);
  compressPdf(layer, pdfObj);
  downloadPdf(layer, pdfObj);
  return layer;
}