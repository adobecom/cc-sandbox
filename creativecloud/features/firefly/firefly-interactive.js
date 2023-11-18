import { setLibs } from '../../scripts/utils.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);
const { createSelectorTray, createEnticement, createPromptField } = await import('../interactive-elements/interactive-elements.js');

let media;
let mediaP;

function eventOnGenerate(generateButton) {
  const btnConfigs = {
    TextToImage: ['SubmitTextToImage', 'SubmitTextToImageUserContent', 'goToFirefly'],
    TextEffects: ['SubmitTextEffects', 'SubmitTextEffectsUserContent', 'goToFireflyEffects'],
  };
  generateButton.addEventListener('click', async (e) => {
    const userprompt = media.querySelector('.prompt-text')?.value;
    const placeholderprompt = media.querySelector('.prompt-text')?.getAttribute('placeholder');
    const prompt = userprompt || placeholderprompt;
    const selected = media.querySelector('.selected');
    if (Object.keys(btnConfigs).includes(selected.id)) {
      const btnConfig = btnConfigs[selected.id];
      const dall = userprompt === '' ? btnConfig[0] : btnConfig[1];
      e.target.setAttribute('daa-ll', dall);
      const { signIn } = await import('./firefly-susi.js');
      signIn(prompt, btnConfig[2]);
    }
  });
}

function createGenFillPrompt(element) {
  const genfillPrompt = createTag('div', { class: 'genfill-prompt' });
  const promptConfig = element?.innerText?.split('|')[0].split('(');
  const prompt = createTag('p', '', `${promptConfig[0]}`);
  const promptText = createTag('p', { class: 'genfill-promptused' }, `${promptConfig[1].replaceAll(')', '')}`);
  genfillPrompt.append(prompt, promptText);
  return genfillPrompt;
}

function hideRemoveElements(option) {
  const selector = media.querySelector('.firefly-selectortray');
  let i = 0;
  [...selector.childNodes].forEach((el) => {
    if (el.id === option.id) {
      el.querySelector('img').classList.add('svgselected');
      el.classList.add('selected');
      mediaP[i].classList.remove('hide');
    } else {
      el.classList.remove('selected');
      el.querySelector('img').classList.remove('svgselected');
      mediaP[i].classList.add('hide');
    }
    i += 1;
  });
  if (option.id === 'TextToImage' || option.id === 'TextEffects') {
    media.querySelector('.genfill-prompt')?.remove();
    media.querySelector('#tryGenFill')?.remove();
    media.querySelector('#genfill')?.remove();
    media.querySelector('#promptbar')?.remove();
  } else if (option.id === 'GenerativeFill') {
    media.querySelector('#promptbar')?.remove();
  }
}

export default function setInteractiveFirefly(el) {
  const buttons = el.querySelectorAll('.con-button');
  [...buttons].forEach((button) => { if (button.innerText.includes('Firefly')) button.setAttribute('daa-ll', 'getfirefly'); });
  media = el.querySelector('.media');
  const allP = media.querySelectorAll('p:not(:empty)');
  [...allP].forEach((s) => { if (!s.querySelector('picture') && !s.querySelector('video'))s.remove(); });
  mediaP = media.querySelectorAll('p:not(:empty');
  const enticementMode = allP[0].innerText.split('(')[1]?.replaceAll(')', '');
  const selectorTrayMode = allP[2].innerText.split('(')[1]?.replaceAll(')', '');

  // Set Enticement
  const enticement = media.querySelector('h2');
  const enticementDiv = createEnticement(enticement.innerText, enticementMode);
  enticement.classList.add('hide');
  media.appendChild(enticementDiv, media.firstChild);

  // Set InteractiveSelection
  const selections = [];
  let j = 4;
  for (let i = 3; i <= allP.length - 3; i += 6) {
    const optionPromptMode = allP[j].innerText.split('(')[1]?.replaceAll(')', '');
    const selectorValues = allP[i].innerText.split('|');
    const option = {
      id: `${selectorValues[0]}`,
      text: `${selectorValues[1]}`,
      svg: `${selectorValues[2]}`,
      analytics: `Select${selectorValues[0]}`,
      promptmode: `${optionPromptMode}`,
      promptpos: i + 2,
    };
    j += 6;
    selections.push(option);
  }
  const textToImageDetail = {};
  const genFillDetail = {};
  const textEffectDetail = {};
  selections.forEach((item) => {
    if (item.id === 'TextToImage') {
      textToImageDetail.promptmode = item.promptmode;
      textToImageDetail.promptpos = item.promptpos;
    } else if (item.id === 'GenerativeFill') {
      genFillDetail.promptmode = item.promptmode;
      genFillDetail.promptpos = item.promptpos;
    } else if (item.id === 'TextEffects') {
      textEffectDetail.promptmode = item.promptmode;
      textEffectDetail.promptpos = item.promptpos;
    }
  });

  const fireflyOptions = createSelectorTray(selections, selectorTrayMode);
  fireflyOptions.classList.add('firefly-selectortray');
  media.append(fireflyOptions);

  const textToImageButton = media.querySelector('#TextToImage');
  const generativeFillButton = media.querySelector('#GenerativeFill');
  const textEffectsButton = media.querySelector('#TextEffects');
  const firstOption = media.querySelector('.selector-tray > button');

  hideRemoveElements(firstOption);

  const genfillPrompt = createGenFillPrompt(allP[genFillDetail.promptpos]);

  // Create prompt field for first option on page load
  let fireflyPrompt = '';
  const firstOptionDetail = allP[5].innerText.split('|');
  const firstOptionPromptMode = allP[4].innerText.split('(')[1]?.replaceAll(')', '');
  fireflyPrompt = createPromptField(`${firstOptionDetail[0]}`, `${firstOptionDetail[1]}`, firstOptionPromptMode);
  if (firstOption.getAttribute('id') === 'TextToImage' || firstOption.getAttribute('id') === 'TextEffects') {
    fireflyPrompt.classList.add('firefly-prompt');
    media.appendChild(fireflyPrompt);
    const generateButton = media.querySelector('#promptbutton');
    eventOnGenerate(generateButton);
  } else if (firstOption.getAttribute('id') === 'GenerativeFill') {
    fireflyPrompt.classList.add('genfill-promptbar');
    media.append(genfillPrompt, fireflyPrompt);
    const genFillButton = media.querySelector('#genfill');
    genFillButton.addEventListener('click', async () => {
      const { signIn } = await import('./firefly-susi.js');
      signIn('', 'goToFireflyGenFill');
    });
  }

  /* Handle action on click of each firefly option button */

  textToImageButton.addEventListener('click', () => {
    hideRemoveElements(textToImageButton);
    const promptDetail = allP[textToImageDetail.promptpos].innerText.split('|');
    const textToImagePrompt = createPromptField(`${promptDetail[0]}`, `${promptDetail[1]}`, textToImageDetail.promptmode);
    textToImagePrompt.classList.add('firefly-prompt');
    media.appendChild(textToImagePrompt);
    const generateButton = media.querySelector('#promptbutton');
    eventOnGenerate(generateButton);
  });

  generativeFillButton.addEventListener('click', () => {
    hideRemoveElements(generativeFillButton);
    const promptDetail = allP[genFillDetail.promptpos].innerText.split('|');
    fireflyPrompt = createPromptField(`${promptDetail[0]}`, `${promptDetail[1]}`, genFillDetail.promptmode, 'SubmitGenerativeFill');
    fireflyPrompt.classList.add('genfill-promptbar');
    media.appendChild(fireflyPrompt);
    const genFillButton = media.querySelector('#genfill');
    genFillButton.addEventListener('click', async () => {
      const { signIn } = await import('./firefly-susi.js');
      signIn('', 'goToFireflyGenFill');
    });
    media.appendChild(genfillPrompt);
  });

  textEffectsButton.addEventListener('click', () => {
    hideRemoveElements(textEffectsButton);
    const promptDetail = allP[textEffectDetail.promptpos].innerText.split('|');
    const textEffectPrompt = createPromptField(`${promptDetail[0]}`, `${promptDetail[1]}`, textEffectDetail.promptmode);
    textEffectPrompt.classList.add('firefly-prompt');
    media.appendChild(textEffectPrompt);
    const generateButton = media.querySelector('#promptbutton');
    eventOnGenerate(generateButton);
  });
}
