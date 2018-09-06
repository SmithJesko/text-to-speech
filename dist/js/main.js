// Init SpeechSynth API
const synth = window.speechSynthesis;

// Dom Elements
const body = document.querySelector('body');
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

// Init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name + '(' + voice.lang + ')';
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
    if(synth.speaking) {
        console.error('Already speaking...');
        return;
    }
    
    if(textInput.value !== '') {
        body.style.background = '#141414 url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';

        const speakText = new SpeechSynthesisUtterance(textInput.value);

        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';
        }

        speakText.onerror = e => {
            console.error('Something went wrong...');
        }

        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        synth.speak(speakText);
    }
}

// Event listeners
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

rate.addEventListener('change', e => rateValue.textContent = rate.value)
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

voiceSelect.addEventListener('change', e => speak());