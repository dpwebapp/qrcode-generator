const qrCode = document.getElementById('qrcode');
const input = document.getElementById('qr-value');
const textarea = document.getElementById('qr-text-value');
const promptText = document.getElementById('prompt');
const qrSize = document.getElementById('choose-size');
const inputSize = document.getElementById('qr-size');
const downloadBtn = document.getElementById('download-btn');

document.addEventListener('DOMContentLoaded', function(){
    input.value = textarea.value = '';
    inputSize.value = 500;
});

const qrType = {
    'inactive': {
        'color': '#dededd',
        'size': 100
    },
    'active': {
        'color': 'black',
        'size': 250
    }
}

// https://github.com/neocotic/qrious
const qr = new QRious({
    element: qrCode,
    foreground: qrType.inactive.color,
    level: 'M',
});

const hide = (...elements) => {
    elements.forEach(el => el.classList.add('hide'));
};
const show = (...elements) => {
    elements.forEach(el => el.classList.remove('hide'));
};
const editQr = (status) => {
    if(status === 'inactive'){
        qr.foreground = qrType.inactive.color;
        qr.size = qrType.inactive.size;
    } else if(status === 'active'){
        qr.foreground = qrType.active.color;
        qr.size = qrType.active.size;
    }
};

// nasconde il qrcode se il valore è vuoto e nasconde il prompt se il valore esiste 
function showQr(value){
    if(!value){
        editQr('inactive');
        hide(downloadBtn);
        hide(qrSize);
        show(promptText);
    } else {
        editQr('active');
        show(downloadBtn);
        show(qrSize);
        hide(promptText);
    };
};

//svuota il valore dei campi di testo
function resetQr(element){
    element.value = '';
    show(promptText);
    hide(downloadBtn);
    editQr('inactive');
};


//(input) aggiorna il valore del qr in tempo reale
input.addEventListener('input', function(e){ 
    let value = e.target.value;
    qr.value = value;
    showQr(value)
});


//(textarea) aggiorna il valore del qr in tempo reale + textarea responsive
textarea.addEventListener('input', function(e){
    let value = e.target.value;
    qr.value = value;
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    showQr(value);
});

//cambia il tipo dell'input
function getInput(type, placeholder){
    show(input);
    hide(textarea);
    input.type = type;
    input.setAttribute('placeholder', placeholder);
    if(input.type == 'file'){
        input.setAttribute('accept', '.pdf');
    };
    resetQr(input);
};

//trasforma l'input in una textarea
function getTextarea(){
    show(textarea);
    hide(input);
    resetQr(textarea);
}

//download del qrcode
downloadBtn.addEventListener('click', function(){
    if(inputSize.value < 50){
        qr.size = 50;
    } else if(inputSize.value > 1000){
        qr.size = 1000;
    } else {
        qr.size = inputSize.value;
    };
    const data = qrCode.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = 'qrcode.png';
    link.click();
    qr.size = qrType.active.size;
});
