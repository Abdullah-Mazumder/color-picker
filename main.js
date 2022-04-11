// global variables
let toastContainer = null;
let setTimeOutOnToastMsg = '';
const defaultColor = {
    red: 221,
    green: 222,
    blue: 238,
}
const defaultPresetColors = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066'
];
let customColors = [];
const copySound = new Audio('./copy-sound.mp3');

// onload handler
window.onload = () => {
    main();
    updateColorCodeToDom(defaultColor);
    displayColorBoxes(document.getElementById('preset-colors'), defaultPresetColors);
    const customColorsString = localStorage.getItem('custom-colors');
    if (customColorsString) {
        customColors = JSON.parse(customColorsString);
        displayColorBoxes(document.getElementById('custom-colors'), customColors)
    }
};

// main function
function main(){
    const generateRandomColorBtn = document.getElementById('generate-random-color');
    const colorModeHexInp = document.getElementById('input-hex');
    const colorSliderRed = document.getElementById('color-slider-red');
    const colorSliderGreen = document.getElementById('color-slider-green');
    const colorSliderBlue = document.getElementById('color-slider-blue');
    const copyToClipboardButton = document.getElementById('copy-to-clipboard');
    const saveToCustomButton = document.getElementById('save-to-custom');
    const presetColors = document.getElementById('preset-colors');
    const customColorsParent = document.getElementById('custom-colors');

    generateRandomColorBtn.addEventListener('click', handleGenerateRandomColorBtn);
    colorModeHexInp.addEventListener('keyup', handleColorModeHexInp)
    colorSliderRed.addEventListener('change', handleColorsSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderGreen.addEventListener('change', handleColorsSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderBlue.addEventListener('change', handleColorsSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    copyToClipboardButton.addEventListener('click', handleCopyToClipboard);
    presetColors.addEventListener('click', handlePresetColorsParent);
    saveToCustomButton.addEventListener('click', handleSaveToCustomBtn(customColorsParent, colorModeHexInp));
    customColorsParent.addEventListener('click', handleCustomColorsParent);
    customColorsParent.addEventListener('dblclick', deleteCustomColor);
}

// Event handlers
function handleGenerateRandomColorBtn() {
    const color = generateColorDecimal();
    updateColorCodeToDom(color)
}

function handleColorModeHexInp(e) {
    const hexColor = e.target.value;
    if (hexColor) {
        this.value = hexColor.toUpperCase();
        const input = document.getElementById('input-hex');
        if (isValidHex(hexColor)) {
            input.style.border = '1px solid green';
            const color = hexToDecimalColors(hexColor);
            updateColorCodeToDom(color);
        } else {
            input.style.border = '1px solid red';
        }
    }
}

function handleColorsSlider(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function () {
        const color = {
            red: +colorSliderRed.value,
            green: +colorSliderGreen.value,
            blue: +colorSliderBlue.value
        }
        updateColorCodeToDom(color);
    }
}

function handleCopyToClipboard() {
    if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
        clearTimeout(setTimeOutOnToastMsg);
    }
    const colorModeRadios = document.getElementsByName('color-mode');
    const mode = getCheckedValueFromRadios(colorModeRadios);
    if (mode === null) {
        throw new Error('Invalid radio input');
    }

    if (toastContainer) {
        toastContainer.remove();
        toastContainer = null;
    }

    if (mode === 'hex') {
        const hexColor = document.getElementById('input-hex').value;
        if (isValidHex(hexColor) && hexColor) {
            navigator.clipboard.writeText(`#${hexColor}`);
            copySound.volume = 0.5;
            copySound.play();
            generateToastMessage(`#${hexColor} Copied`);
        } else {
            alert('Invalid Hex Code');
        }
    } else {
        const rgbColor = document.getElementById('input-rgb').value;
        if (rgbColor) {
            navigator.clipboard.writeText(rgbColor);
            copySound.volume = 0.5;
            copySound.play();
            generateToastMessage(`${rgbColor} Copied`);
        } else {
            alert('Invalid RGB Color Code');
        }
    }
}

function handlePresetColorsParent(event) {
    if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
        clearTimeout(setTimeOutOnToastMsg);
    }
    const child = event.target;
    if (child.className === 'color-box') {
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        copySound.volume = 0.5;
        copySound.play();
        if (toastContainer !== null && toastContainer) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`${child.getAttribute('data-color')} Copied`);
    }
}

function handleCustomColorsParent(event) {
    if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
        clearTimeout(setTimeOutOnToastMsg);
    }
    const child = event.target;
    if (child.className === 'color-box') {
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        copySound.volume = 0.5;
        copySound.play();
        if (toastContainer !== null && toastContainer) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`${child.getAttribute('data-color')} Copied`);
    }
}

function handleSaveToCustomBtn(parent, inputHex) {
    return function () {
        if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
            clearTimeout(setTimeOutOnToastMsg);
        }
        if (toastContainer !== null && toastContainer) {
            toastContainer.remove();
            toastContainer = null;
        }
        copySound.volume = 0.5;
        copySound.play();
        const color = `#${inputHex.value}`;
        if (customColors.includes(color)) {
            generateToastMessage(`This color is already saved.`);
            return;
        }
        generateToastMessage(`${color} Saved`);
        customColors.unshift(color);
        if (customColors.length > 24) {
            customColors = customColors.slice(0, 24);
        }
        localStorage.setItem('custom-colors', JSON.stringify(customColors));
        removeChildren(parent);
        displayColorBoxes(parent, customColors);
    }
}

function deleteCustomColor(event) {
    if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
        clearTimeout(setTimeOutOnToastMsg);
    }
    let customColorsArray = JSON.parse(localStorage.getItem('custom-colors'));
    const child = event.target;
    if (child.className === 'color-box') {
        child.parentNode.removeChild(child);
        copySound.volume = 0.5;
        copySound.play();
        if (toastContainer !== null && toastContainer) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`Color is deleted`);
    }
    customColorsArray = customColorsArray.filter((item) => item !== child.getAttribute('data-color'))
    localStorage.setItem('custom-colors', JSON.stringify(customColorsArray))
}

// DOM functions
function generateToastMessage(msg) {
    toastContainer = document.createElement('div');
    toastContainer.innerText = msg;
    toastContainer.style.color = 'white';
    toastContainer.className = 'toast-message toast-message-slide-in';

    if (toastContainer.classList.contains('toast-message-slide-in')) {
        setTimeOutOnToastMsg = setTimeout(() => {
            toastContainer.classList.remove('toast-message-slide-in');
            toastContainer.classList.add('toast-message-slide-out');

            toastContainer.addEventListener('animationend', function () {
                toastContainer.remove();
                toastContainer = null;
            })
        }, 1500);
    }

    toastContainer.addEventListener('click', function () {
        if (setTimeOutOnToastMsg !== '' && setTimeOutOnToastMsg) {
            clearTimeout(setTimeOutOnToastMsg);
        }

        toastContainer.classList.remove('toast-message-slide-in');
        toastContainer.classList.add('toast-message-slide-out');

        toastContainer.addEventListener('animationend', function () {
            toastContainer.remove();
            toastContainer = null;
        })
    })

    document.body.appendChild(toastContainer);
}

function updateColorCodeToDom(color) {
    const hexColor = generateHexColor(color);
    const rgbColor = generateRGBColor(color);

    document.getElementById('color-display').style.background = `#${hexColor}`;
    document.getElementById('input-hex').value = hexColor;
    document.getElementById('input-rgb').value = rgbColor;
    document.getElementById('color-slider-red').value = color.red;
    document.getElementById('color-slider-red-label').innerText = color.red;
    document.getElementById('color-slider-green').value = color.green;
    document.getElementById('color-slider-green-label').innerText = color.green;
    document.getElementById('color-slider-blue').value = color.blue;
    document.getElementById('color-slider-blue-label').innerText = color.blue;
}

function getCheckedValueFromRadios(nodes) {
    let checkedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

function generateColorBox(color) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.background = color;
    div.setAttribute('data-color', color);

    return div;
}

function displayColorBoxes(parent, colors) {
    colors.forEach((color) => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox);
    })
}

function removeChildren(parent) {
    let child = parent.lastElementChild;
    let len = parent.childNodes.length;
    for (let index = 0; index < len; index++) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

// Utils functions
function isValidHex(color) {
    if (color.length !== 6) {
        return false;
    }

    return /^[0-9A-F]{6}$/i.test(color);
}

function generateColorDecimal() {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return {
        red,
        green,
        blue
    };
}

function generateHexColor({ red, green, blue }) {
    const getTwoCode = function (value) {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }

    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}

function generateRGBColor({ red, green, blue }) {
    return `rgb(${red}, ${green}, ${blue})`;
}

function hexToDecimalColors(hex) {
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4), 16);

    return {
        red,
        green,
        blue
    };
}