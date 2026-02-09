import './index.css';

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

export function toNumeronym(word) {
    const punctuationMatch = word.match(/[^a-zA-Z0-9]+$/);
    const punctuation = punctuationMatch ? punctuationMatch[0] : '';
    const baseWord = punctuation ? word.slice(0, -punctuation.length) : word;
    
    if (baseWord.length === 0) return word;
    if (baseWord.length === 1) return baseWord + '-1' + punctuation;
    if (baseWord.length === 2) return baseWord[0] + '0' + baseWord[1] + punctuation;
    return baseWord[0] + (baseWord.length - 2) + baseWord[baseWord.length - 1] + punctuation;
}

export function generateNumeronym(text) {
    if (!text.trim()) return '';
    return text
        .split('\n')
        .map(line => {
            return line
                .split(/\s+/)
                .filter(word => word.length > 0)
                .map(word => toNumeronym(word))
                .join(' ');
        })
        .join('\n');
}

inputEl.addEventListener('input', (e) => {
    const text = e.target.value;
    outputEl.value = generateNumeronym(text);
});

copyBtn.addEventListener('click', async () => {
    if (!outputEl.value) return;

    try {
        await navigator.clipboard.writeText(outputEl.value);
        const originalText = copyBtn.textContent;
        const originalClass = copyBtn.className;
        copyBtn.textContent = 'Copied!';
        copyBtn.className = 'w-full py-3 px-6 btn-success font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.className = originalClass;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
});

// Tagline rotation with sweep animation
const taglines = [
    'Transform words like "internationalization" into "i18n"',
    '"localization" becomes "l10n"',
    '"accessibility" becomes "a11y"',
    '"kubernetes" becomes "k8s"',
    'Because typing long words is so last century',
    'The future of typing less',
    'Shorten your words, expand your vocabulary',
    'When you need to save keystrokes',
    'Abbreviation innovation',
    'Less typing, more doing',
    'Making long words manageable',
    'For the lazy typist in all of us',
    'The art of lexical compression',
    'Because every character counts',
    'Simplify your vocabulary'
];

const taglineEl = document.getElementById('tagline');
let currentTaglineIndex = Math.floor(Math.random() * taglines.length);
let sweepInterval = null;

function sweepTransform(text) {
    const tokens = text.match(/"[^"]*"|\S+|\s+/g) || [];
    const wordInfo = tokens.map((token, i) => {
        const quotedMatch = token.match(/^"([a-zA-Z0-9]+)"$/);
        if (quotedMatch) {
            return {
                index: i,
                isQuoted: true,
                innerWord: quotedMatch[1],
                prefix: '"',
                suffix: '"'
            };
        }
        return {
            index: i,
            isQuoted: false,
            innerWord: token,
            prefix: '',
            suffix: ''
        };
    });

    taglineEl.textContent = text;

    const wordIndices = wordInfo.filter(w => /^[a-zA-Z0-9]/.test(w.innerWord)).map(w => w.index);

    if (wordIndices.length === 0) return;

    setTimeout(() => {
        let currentWordIdx = 0;
        sweepInterval = setInterval(() => {
            if (currentWordIdx >= wordIndices.length) {
                clearInterval(sweepInterval);
                return;
            }

            const tokenIdx = wordIndices[currentWordIdx];
            const info = wordInfo[tokenIdx];
            const encoded = toNumeronym(info.innerWord);
            tokens[tokenIdx] = info.prefix + encoded + info.suffix;
            taglineEl.textContent = tokens.join('');

            currentWordIdx++;
        }, 120);
    }, 2000);
}

function updateTagline() {
    if (sweepInterval) {
        clearInterval(sweepInterval);
    }

    const tagline = taglines[currentTaglineIndex];
    currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;

    sweepTransform(tagline);
}

// Initial tagline
updateTagline();

// Change tagline every 8 seconds
setInterval(updateTagline, 8000);