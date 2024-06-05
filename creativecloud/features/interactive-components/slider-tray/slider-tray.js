/* eslint-disable no-case-declarations */
/* eslint-disable no-use-before-define */
import { createTag, getConfig } from '../../../scripts/utils.js';
import defineDeviceByScreenSize from '../../../scripts/decorate.js';

const CSSRanges = {
  hue: { min: -180, zero: 0, max: 180 },
  saturation: { min: 0, zero: 100, max: 300 },
};

const PsRanges = {
  hue: { min: -180, zero: 0, max: 180 },
  saturation: { min: -100, zero: 0, max: 100 },
};

export default async function stepInit(data) {
  const imgObj = {};
  const layer = createTag('div', { class: `layer layer-${data.stepIndex}` });
  await createSelectorTray(data, layer);
  sliderEvent(data.target, layer, imgObj);
  // uploadImage(data.target, layer, imgObj);
  // continueToPs(layer, imgObj);
  const selectorTray = selectorTrayWithImgs(layer, data);
  layer.append(selectorTray);
  return layer;
}

async function createSelectorTray(data, layer) {
  const sliderTray = createTag('div', { class: 'sliderTray' });
  const menu = createTag('div', { class: 'menu' });
  const config = data.stepConfigs[data.stepIndex];
  const options = config.querySelectorAll(':scope > div ul .icon, :scope > div ol .icon');
  [...options].forEach((o) => { handleInput(o, sliderTray, menu, layer); });
  const titleText = data.stepConfigs[data.stepIndex].querySelector('h1,h2,h3,h4,h5,h6')?.innerText;
  if (titleText) {
    const d = createTag('div', {class: 'hue-sat-title'});
    const ddash = createTag('div', {class: 'hue-sat-title-icon'});
    const d1 = createTag('div', {class: 'svgicon'}, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 66.91" style="enable-background:new 0 0 122.88 66.91" xml:space="preserve"><g><path d="M11.68,1.95C8.95-0.7,4.6-0.64,1.95,2.08c-2.65,2.72-2.59,7.08,0.13,9.73l54.79,53.13l4.8-4.93l-4.8,4.95 c2.74,2.65,7.1,2.58,9.75-0.15c0.08-0.08,0.15-0.16,0.22-0.24l53.95-52.76c2.73-2.65,2.79-7.01,0.14-9.73 c-2.65-2.72-7.01-2.79-9.73-0.13L61.65,50.41L11.68,1.95L11.68,1.95z"/></g></svg>
    `);
    const d2 = createTag('div', {}, titleText);
    const d3 = createTag('div', {class: 'slider-svg'}, `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.14059 9.43079H6.57362C7.01183 11.2706 8.65925 12.6468 10.631 12.6468C12.6028 12.6468 14.2502 11.2706 14.6884 9.43079H24.3663C24.899 9.43079 25.3311 8.99863 25.3311 8.46598C25.3311 7.93333 24.899 7.50118 24.3663 7.50118H14.6884C14.2502 5.66138 12.6028 4.28516 10.631 4.28516C8.65925 4.28516 7.01181 5.66138 6.57362 7.50118H3.14059C2.60794 7.50118 2.17578 7.93333 2.17578 8.46598C2.17578 8.99863 2.60794 9.43079 3.14059 9.43079ZM10.631 6.21477C11.8722 6.21477 12.8822 7.2248 12.8822 8.46598C12.8822 9.70716 11.8722 10.7172 10.631 10.7172C9.38984 10.7172 8.3798 9.70716 8.3798 8.46598C8.3798 7.2248 9.38984 6.21477 10.631 6.21477Z" fill="#292929"/>
    <path d="M24.3663 17.7922H21.1205C20.6823 15.9524 19.0348 14.5762 17.0631 14.5762C15.0913 14.5762 13.4439 15.9524 13.0057 17.7922H3.14059C2.60794 17.7922 2.17578 18.2243 2.17578 18.757C2.17578 19.2896 2.60794 19.7218 3.14059 19.7218H13.0057C13.4439 21.5616 15.0913 22.9378 17.0631 22.9378C19.0348 22.9378 20.6823 21.5616 21.1205 19.7218H24.3663C24.899 19.7218 25.3311 19.2896 25.3311 18.757C25.3311 18.2243 24.899 17.7922 24.3663 17.7922ZM17.0631 21.0082C15.8219 21.0082 14.8118 19.9982 14.8118 18.757C14.8118 17.5158 15.8219 16.5058 17.0631 16.5058C18.3042 16.5058 19.3143 17.5158 19.3143 18.757C19.3143 19.9982 18.3042 21.0082 17.0631 21.0082Z" fill="#292929"/>
    </svg>
    `);
    ddash.append(...[d1, d2]);
    d.append(...[ddash, d3]);
    menu.prepend(d);
  }
  layer.prepend(sliderTray);
  observeSliderTray(sliderTray, data.target, menu);
}

function handleInput(option, sliderTray, menu, layer) {
  let inputType = option.classList[1].split('icon-')[1];
  const sliderType = inputType.split('-')[0];
  if (inputType.includes('slider')) inputType = 'slider';
  const sibling = option.nextSibling;
  const text = sibling.nodeValue.trim();
  let picture = '';
  if (sibling.nextSibling && sibling.nextSibling.tagName === 'PICTURE') {
    picture = sibling.nextSibling;
  }
  switch (inputType) {
    case 'slider':
      createSlider(sliderType, text, menu, sliderTray);
      break;
    case 'upload':
      // createUploadButton(text, picture, sliderTray, menu);
      break;
    case 'upload-ps':
      // createUploadPSButton(text, picture, layer);
      break;
    default:
      window.lana.log(`Unknown input type: ${inputType}`);
      break;
  }
}

function observeSliderTray(sliderTray, targets) {
  const options = { threshold: 0.7 };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const menu = sliderTray.querySelector('.menu');
      // const outerCircle = menu.querySelector('.outerCircle');
      // outerCircle.classList.add('showOuterBorder');
      // setTimeout(() => { animateSlider(menu, targets); }, 800);
      observer.unobserve(entry.target);
    });
  }, options);
  io.observe(sliderTray);
}

function createSlider(sliderType, details, menu, sliderTray) {
  const sliderLabel = createTag('label', { for: `${sliderType}` }, details.trim());
  const sliderContainer = createTag('div', { class: `sliderContainer ${sliderType.toLowerCase()}` });
  const outerCircle = createTag('a', { class: 'outerCircle', href: '#', tabindex: '-1' });
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `Adjust ${sliderType} slider`);
  const input = createTag('input', {
    type: 'range',
    min: CSSRanges[sliderType].min,
    max: CSSRanges[sliderType].max,
    class: `options ${sliderType.toLowerCase()}-input`,
    value: `${sliderType === 'hue' ? '0' : '150'}`,
  });
  outerCircle.append(analyticsHolder);
  sliderContainer.append(input, outerCircle);
  menu.append(sliderLabel, sliderContainer);
  sliderTray.append(menu);
  outerCircle.addEventListener('click', (e) => {
    e.preventDefault();
  });
  applyAccessibility(input, outerCircle);
}

function createUploadButton(details, picture, sliderTray, menu) {
  const currentVP = defineDeviceByScreenSize().toLocaleLowerCase();
  const btn = createTag('input', { class: 'inputFile', type: 'file', accept: 'image/*' });
  const labelBtn = createTag('a', { class: `uploadButton body-${currentVP === 'mobile' ? 'm' : 'xl'}` }, details);
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `${details}`);
  labelBtn.append(btn, analyticsHolder);
  const svg = `<div class='svg-icon-container'>
  <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 379.661"><path fill-rule="nonzero" d="M153.764 151.353c-7.838-.333-13.409-2.935-16.619-7.822-8.724-13.076 3.18-25.997 11.443-35.099 23.441-25.725 80.888-87.554 92.454-101.162 8.768-9.693 21.25-9.693 30.017 0 11.948 13.959 72.287 78.604 94.569 103.628 7.731 8.705 17.292 20.579 9.239 32.633-3.287 4.887-8.798 7.489-16.636 7.822H310.65v96.177c0 12.558-10.304 22.868-22.871 22.868h-63.544c-12.572 0-22.871-10.294-22.871-22.868v-96.177h-47.6zm-153 97.863c-2.622-10.841 1.793-19.33 8.852-24.342a24.767 24.767 0 018.47-3.838c3.039-.738 6.211-.912 9.258-.476 8.585 1.232 16.409 6.775 19.028 17.616a668.81 668.81 0 014.56 20.165 1259.68 1259.68 0 013.611 17.72c4.696 23.707 8.168 38.569 16.924 45.976 9.269 7.844 26.798 10.55 60.388 10.55h254.297c31.012 0 47.192-2.965 55.706-10.662 8.206-7.418 11.414-21.903 15.564-44.131a1212.782 1212.782 0 013.628-18.807c1.371-6.789 2.877-13.766 4.586-20.811 2.619-10.838 10.438-16.376 19.023-17.616 3.02-.434 6.173-.256 9.212.474 3.071.738 5.998 2.041 8.519 3.837 7.05 5.007 11.457 13.474 8.855 24.294l-.011.046a517.834 517.834 0 00-4.181 18.988c-1.063 5.281-2.289 11.852-3.464 18.144l-.008.047c-6.124 32.802-11.141 55.308-27.956 71.112-16.565 15.572-42.513 22.159-89.473 22.159H131.857c-49.096 0-76.074-5.911-93.429-21.279-17.783-15.75-23.173-38.615-30.047-73.314-1.39-7.029-2.728-13.738-3.638-18.091-1.281-6.11-2.6-12.081-3.979-17.761z"/></svg></div>`;
  labelBtn.innerHTML = svg + labelBtn.innerHTML;
  // appendSVGToButton(picture, labelBtn);
  const clone = labelBtn.cloneNode(true);
  clone.classList.add('uploadButtonMobile');
  const mobileInput = clone.querySelector('.inputFile');
  menu.append(clone);
  sliderTray.append(labelBtn);
  applyAccessibility(btn, labelBtn);
  applyAccessibility(mobileInput, clone);
}

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

function createUploadPSButton(details, picture, layer) {
  const btn = createTag('a', { class: 'continueButton body-xl hide', tabindex: '0' }, details);
  const analyticsHolder = createTag('div', { class: 'interactive-link-analytics-text' }, `${details}`);
  btn.append(analyticsHolder);
  const svg = `<div class='svg-icon-container'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 121.93" style="enable-background:new 0 0 122.88 121.93" xml:space="preserve"><g><path d="M8.33,0.02h29.41v20.6H20.36v80.7h82.1V84.79h20.36v37.14H0V0.02H8.33L8.33,0.02z M122.88,0H53.3l23.74,23.18l-33.51,33.5 l21.22,21.22L98.26,44.4l24.62,24.11V0L122.88,0z"/></g></svg></div>`;
  btn.innerHTML = svg + btn.innerHTML;
  // appendSVGToButton(picture, btn);
  layer.append(btn);
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

function sliderEvent(media, layer, imgObj) {
  let hue = 0;
  let saturation = 100;
  ['hue', 'saturation'].forEach((sel) => {
    const sliderEl = layer.querySelector(`.${sel.toLowerCase()}-input`);
    sliderEl.addEventListener('input', () => {
      const image = media.querySelector('.interactive-holder picture > img');
      const { value } = sliderEl;
      sliderEl.setAttribute('value', value);
      const outerCircle = sliderEl.nextSibling;
      const value1 = (value - sliderEl.min) / (sliderEl.max - sliderEl.min);
      const thumbPercent = 3 + (value1 * 94);
      const interactiveBlock = media.closest('.marquee') || media.closest('.aside');
      const isRowReversed = interactiveBlock.classList.contains('.row-reversed');
      if ((document.dir === 'rtl' || isRowReversed)) {
        outerCircle.style.right = `${thumbPercent}%`;
      } else {
        outerCircle.style.left = `${thumbPercent}%`;
      }
      switch (sel.toLowerCase()) {
        case ('hue'):
          hue = value;
          break;
        case ('saturation'):
          saturation = parseInt(value, 10);
          break;
        default:
          break;
      }
      image.style.filter = `hue-rotate(${hue}deg) saturate(${saturation}%)`;
      cssToPhotoshop(imgObj, sel.toLowerCase(), value);
    });
    sliderEl.addEventListener('change', () => {
      const outerCircle = sliderEl.nextSibling;
      outerCircle.click();
    });
  });
}

function cssToPhotoshop(imgObj, adjustment, value) {
  const unitValue = convertToUnit(adjustment, value, CSSRanges);
  imgObj[adjustment] = convertFromUnit(adjustment, unitValue, PsRanges);
}

function convertToUnit(adjustment, value, ranges) {
  if (value < ranges[adjustment].min || value > ranges[adjustment].max) {
    window.lana.log(`value out of range ${adjustment}:${value}`);
  }

  if (value < ranges[adjustment].zero) {
    const spread = ranges[adjustment].zero - ranges[adjustment].min;
    return (value - ranges[adjustment].min) / spread - 1;
  }
  const spread = ranges[adjustment].max - ranges[adjustment].zero;
  return (value - ranges[adjustment].zero) / spread;
}

function convertFromUnit(adjustment, value, ranges) {
  if (value < -1 || value > 1) {
    window.lana.log(`value out of range ${adjustment}:${value}`);
  }

  if (value < 0) {
    const spread = ranges[adjustment].zero - ranges[adjustment].min;
    const t = value + 1;
    return t * spread + ranges[adjustment].min;
  }
  const spread = ranges[adjustment].max - ranges[adjustment].zero;
  return value * spread + ranges[adjustment].zero;
}

function uploadImage(media, layer, imgObj) {
  layer.querySelectorAll('.uploadButton').forEach((btn) => {
    const analyticsBtn = btn.querySelector('.interactive-link-analytics-text');
    btn.addEventListener('cancel', () => {
      cancelAnalytics(btn);
    });
    btn.addEventListener('change', (event) => {
      const image = media.querySelector('picture > img');
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) return;
      if (file) {
        imgObj.fileName = file.name;
        const imageUrl = URL.createObjectURL(file);
        image.src = imageUrl;
        imgObj.imgSrc = imageUrl;
        analyticsBtn.innerHTML = 'Upload Button';
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

function continueToPs(layer, imgObj) {
  layer.querySelectorAll('.continueButton').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const actionJSONData = [
        {
          _obj: 'make',
          _target: [{ _ref: 'adjustmentLayer' }],
          using: {
            _obj: 'adjustmentLayer',
            type: {
              _obj: 'hueSaturation',
              adjustment: [
                {
                  _obj: 'hueSatAdjustmentV2',
                  hue: Math.round(imgObj.hue || 0),
                  lightness: 0,
                  saturation: Math.round(imgObj.saturation || 0),
                },
              ],
              colorize: false,
              presetKind: {
                _enum: 'presetKindType',
                _value: 'presetKindCustom',
              },
            },
          },
        },
      ];
      const { openInPsWeb } = await import('../../../deps/openInPsWeb/openInPsWeb.js');
      const imageData = await (await fetch(imgObj.imgSrc)).blob();
      const cs = getConfig();
      const enConf = cs.prodDomains.includes(window.location.host) ? cs.prod.psUrl : cs.stage.psUrl;
      openInPsWeb(
        enConf,
        imgObj.fileName,
        [{ filename: imgObj.fileName, imageData }],
        actionJSONData,
      );
    });
  });
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

function animateSlider(menu, target) {
  const option = menu.querySelector('.options');
  const aobj = { interrupted: false };
  const outerCircle = option.nextSibling;
  outerCircle.classList.add('animate');
  ['mousedown', 'touchstart', 'keyup'].forEach((e) => {
    option.closest('.sliderTray').addEventListener(e, () => {
      aobj.interrupted = true;
      outerCircle.classList.remove('showOuterBorder', 'animate', 'animateout');
    }, { once: true });
  });
  outerCircle.addEventListener('transitionend', () => {
    setTimeout(() => {
      const min = parseInt(option.min, 10);
      const max = parseInt(option.max, 10);
      const middle = (min + max) / 2;
      sliderScroll(option, middle, max, 1200, outerCircle, target, aobj);
    }, 500);
  }, { once: true });
}

function sliderScroll(slider, start, end, duration, outerCircle, target, aobj) {
  let current = start;
  let step = ((end - start) / duration) * 10;
  let direction = 1;
  function stepAnimation() {
    slider.value = current;
    current += step;
    if (aobj.interrupted) return;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    if ((step > 0 && current >= (start + 70)) || (step < 0 && current >= (start + 70))) {
      step = -step;
      setTimeout(stepAnimation, 10);
    } else if ((step > 0 && current <= (start - 70)) || (step < 0 && current <= (start - 70))) {
      step = -step;
      setTimeout(stepAnimation, 10);
      direction = -1;
    } else if (current === start && direction === -1) {
      slider.value = current;
      const image = target.querySelector('picture > img');
      image.style.filter = `hue-rotate(${0}deg)`;
      setTimeout(() => {
        outerCircle.classList.remove('animate');
        outerCircle.classList.add('animateout');
      }, 500);
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      setTimeout(stepAnimation, 10);
    }
  }
  setTimeout(stepAnimation, 10);
}


function hueSatBtn(data) {
  const btnText = data.stepConfigs[data.stepIndex].querySelector('li .icon-huesat')?.closest('li').innerText;
  const removeBgCTA = createTag('div', { class: 'gray-button start-over-button body-m', href: '#' });
  const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_1161_5787" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
  <path d="M17.4512 13.3125C17.0283 12.9023 16.4922 12.8086 16.0781 12.7363C15.7422 12.6787 15.708 12.6465 15.5615 12.5098C15.4756 12.4297 15.374 12.3018 15.374 12.1455C15.374 11.9902 15.4756 11.8623 15.5615 11.7832L16.7656 10.6641C17.8135 9.69336 18.3906 8.39355 18.3906 7.0039C18.3906 5.61425 17.8135 4.31542 16.7647 3.34472C15.3145 2.00781 13.3281 1.27148 11.1709 1.27148C8.68262 1.27148 6.19238 2.25683 4.34082 3.9746C2.5791 5.60546 1.60938 7.78808 1.60938 10.1191C1.60938 12.4502 2.5791 14.6328 4.34082 16.2637C6.06837 17.8613 8.40821 18.7529 11.0029 18.7715C13.4639 18.7715 15.8086 17.9023 17.4336 16.3887C17.8359 16.0176 18.0615 15.4883 18.0703 14.8994C18.0781 14.292 17.8477 13.6992 17.4522 13.3135L17.4512 13.3125ZM16.4113 15.291C15.0601 16.5498 13.0889 17.2715 11.0137 17.2715C10.7461 17.2695 10.4815 17.2563 10.2202 17.2324C9.98365 17.2112 9.75111 17.178 9.52065 17.1394C9.49953 17.1357 9.4778 17.1345 9.45681 17.1309C7.88027 16.8557 6.46059 16.1809 5.35988 15.1631C3.9086 13.8193 3.1094 12.0283 3.1094 10.1191C3.1094 8.20996 3.90859 6.41894 5.36111 5.07422C6.53469 3.98511 8.00759 3.24365 9.55569 2.93457C9.55691 2.93408 9.55788 2.93384 9.5591 2.93359C9.79982 2.88574 10.0426 2.85058 10.2862 2.82397C10.3125 2.82104 10.3386 2.81494 10.365 2.8125C10.633 2.78564 10.9019 2.77148 11.1709 2.77148C12.5426 2.77148 13.8172 3.13256 14.8681 3.78906C15.1802 3.98413 15.4778 4.19848 15.7459 4.44531C16.484 5.1289 16.8907 6.03711 16.8907 7.0039C16.8907 7.83886 16.5718 8.62133 16.0127 9.26318C15.9243 9.36474 15.8455 9.47192 15.7445 9.56543L14.5457 10.6797C14.1126 11.0784 13.8741 11.5989 13.8741 12.1455C13.8741 12.4902 13.9788 12.8213 14.158 13.1221C14.261 13.2954 14.3821 13.4609 14.5387 13.6065C14.7232 13.7788 14.8921 13.9004 15.0813 13.9937C15.2867 14.0947 15.5161 14.1616 15.8202 14.2139C16.0523 14.2544 16.3152 14.3003 16.4048 14.3872C16.4348 14.4165 16.4624 14.4732 16.4893 14.5283C16.5352 14.6226 16.5723 14.7368 16.5705 14.877C16.5686 15.001 16.5404 15.1719 16.4113 15.291Z" fill="#292929"/>
  <path opacity="0.35" d="M11.1709 4.27148C10.0789 4.27148 8.98523 4.54467 8 5.04638V15.0996C8.90771 15.5156 9.92749 15.7637 11.0244 15.7715C11.3552 15.7715 11.6798 15.7422 12 15.6995V4.33936C11.729 4.30274 11.4552 4.27148 11.1709 4.27148Z" fill="#292929"/>
  <path d="M8 5.04688C7.41443 5.34497 6.86707 5.72364 6.38147 6.17408C5.23828 7.23267 4.60938 8.63331 4.60938 10.1196C4.60938 11.606 5.2378 13.0064 6.37891 14.063C6.84595 14.4949 7.40332 14.8269 8 15.1001V5.04688Z" fill="#292929"/>
  </mask>
  <g mask="url(#mask0_1161_5787)">
  <rect width="20" height="20" fill="#292929"/>
  </g>
  </svg>
  `;
  removeBgCTA.innerHTML = `${svg} ${btnText}`;
  removeBgCTA.addEventListener('click', async (e) => {
    const sliderTray = removeBgCTA.closest('.interactive-enabled').querySelector('.sliderTray')
    if (sliderTray.classList.contains('slidershow')) {
      sliderTray.classList.remove('slidershow');
      sliderTray.style.display = 'none';
    } else {
      sliderTray.classList.add('slidershow');
      sliderTray.style.display = 'flex';
    }
  });
  return removeBgCTA;
}

function uploadButton(data) {
    const btnText = data.stepConfigs[data.stepIndex].querySelectorAll('ul li')[2]?.innerText;
    const uploadCTA = createTag('div', { class: 'gray-button start-over-button upload-button body-m', href: '#' });
    const svg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.7383 11.6684C19.7383 12.8261 19.2876 13.914 18.4692 14.7319C17.6509 15.5498 16.563 16.0005 15.4058 16.0005H14.7485C14.3345 16.0005 13.9985 15.6645 13.9985 15.2505C13.9985 14.8364 14.3345 14.5005 14.7485 14.5005H15.4058C16.1621 14.5005 16.8735 14.206 17.4087 13.6709C17.9438 13.1362 18.2383 12.4253 18.2383 11.6684C18.2383 10.9409 17.9614 10.251 17.459 9.72655C16.9575 9.20262 16.2822 8.89304 15.5566 8.85448C15.3022 8.84081 15.0718 8.69872 14.9453 8.47753C14.8188 8.25585 14.8135 7.98534 14.9316 7.75927C15.0571 7.51806 15.1538 7.26952 15.2187 7.0205C15.2871 6.76073 15.3218 6.49462 15.3218 6.229C15.3218 5.33545 14.9741 4.4956 14.3428 3.86377C13.1348 2.65674 11.0464 2.58984 9.77491 3.72315C9.17432 4.25977 8.78516 4.99561 8.68067 5.7959C8.64991 6.03174 8.50879 6.23926 8.30079 6.35449C8.09327 6.47021 7.84327 6.47998 7.62599 6.38135C7.45753 6.30469 7.28418 6.24561 7.10939 6.20606C6.24903 6.01026 5.36769 6.2754 4.76076 6.86817C4.28615 7.33106 4.02492 7.94483 4.02492 8.5962C4.02492 8.76368 4.04298 8.93116 4.07814 9.09474C4.11281 9.25293 4.16457 9.41017 4.23097 9.56056C4.33057 9.78468 4.31397 10.0435 4.18702 10.2534C4.05958 10.4634 3.8379 10.5977 3.59327 10.6133C3.09718 10.645 2.63672 10.8604 2.29541 11.2192C1.9541 11.5796 1.76562 12.0518 1.76562 12.5488C1.76562 13.0703 1.96874 13.5606 2.3374 13.9292C2.70605 14.2974 3.19581 14.5005 3.71729 14.5005H5.8169C6.23096 14.5005 6.5669 14.8364 6.5669 15.2505C6.5669 15.6646 6.23096 16.0005 5.8169 16.0005H3.71729C2.79541 16.0005 1.92871 15.6416 1.27685 14.9898C0.624515 14.3379 0.265625 13.4707 0.265625 12.5488C0.265625 11.666 0.600095 10.8276 1.20704 10.187C1.59425 9.77931 2.06787 9.47657 2.58935 9.29737C2.54639 9.06592 2.5249 8.83106 2.5249 8.5962C2.5249 7.53712 2.94678 6.542 3.71339 5.79444C4.66944 4.86036 6.04689 4.44434 7.38966 4.73194C7.65382 3.917 8.13037 3.18067 8.77637 2.60401C9.65821 1.81788 10.7949 1.38477 11.978 1.38477C13.2715 1.38477 14.4883 1.88868 15.4033 2.80323C16.3179 3.71827 16.8218 4.93507 16.8218 6.22901C16.8218 6.62354 16.7705 7.01807 16.6694 7.40137C16.6587 7.44336 16.647 7.48535 16.6348 7.52686C17.356 7.73877 18.0127 8.13575 18.5425 8.68897C19.3135 9.49415 19.7383 10.5522 19.7383 11.6684Z" fill="#292929"/>
    <path d="M13.854 10.8241L10.8511 7.82654C10.5581 7.53455 10.084 7.53406 9.79102 7.82703L6.79395 10.8246C6.50098 11.1176 6.50098 11.5922 6.79395 11.8851C6.94043 12.0316 7.13233 12.1049 7.32422 12.1049C7.51611 12.1049 7.70801 12.0316 7.85449 11.8851L9.57666 10.1626V18.3461C9.57666 18.7601 9.9126 19.0961 10.3267 19.0961C10.7407 19.0961 11.0767 18.7601 11.0767 18.3461V10.1709L12.7944 11.8856C13.0869 12.1776 13.5615 12.1776 13.855 11.8846C14.1475 11.5917 14.1475 11.1166 13.854 10.8241Z" fill="#292929"/>
    </svg>
    `
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
    });
    return uploadCTA;
  }

function selectorTrayWithImgs(layer, data) {
  const selectorTray = createTag('div', { class: 'body-s selector-tray' });
  const trayItems = createTag('div', { class: 'tray-items' });
  const productIcon = createTag('div', { class: 'product-icon' });
  const productSvg = `<svg xmlns="http://www.w3.org/2000/svg" id="Lightroom_40" data-name="Lightroom 40" width="40" height="39" viewBox="0 0 40 39">
  <path id="Path_99544" data-name="Path 99544" d="M7.125,0H33a7.005,7.005,0,0,1,7,7.1V31.9A7.11,7.11,0,0,1,32.875,39H7.125A7.11,7.11,0,0,1,0,31.9V7.1A7.032,7.032,0,0,1,7.125,0Z" fill="#001e36"/>
  <path id="Path_99545" data-name="Path 99545" d="M18.975,25.625H8.35a.269.269,0,0,1-.25-.25V8.25A.269.269,0,0,1,8.35,8H11.6l.25.125h0v14H19.6a.269.269,0,0,1,.25.25l-.625,3L19.1,25.5Z" transform="translate(2.025 1.942)" fill="#31a8ff"/>
  <path id="Path_99546" data-name="Path 99546" d="M18.925,11.45H21.8c.125,0,.25.125.375.25a.459.459,0,0,1,.125.375c0,.125.125.375.125.5V13.2a4.5,4.5,0,0,1,1.75-1.375,5.69,5.69,0,0,1,2.5-.625.436.436,0,0,1,.25.125h0V14.7a.269.269,0,0,1-.25.25,5.431,5.431,0,0,0-3.125.625,2.242,2.242,0,0,0-.875.625v8.5a.269.269,0,0,1-.25.25h-3.25a.269.269,0,0,1-.25-.25V12.825A3.461,3.461,0,0,0,18.8,11.7l.125-.25Z" transform="translate(4.7 2.731)" fill="#31a8ff"/>
</svg>`;
  productIcon.innerHTML = `${productSvg}`;
  const hueSat = hueSatBtn(data);
  const uploadCTA = uploadButton(data);
  trayItems.append(productIcon, hueSat, uploadCTA);
  selectorTray.append(trayItems);
  return selectorTray;
}
