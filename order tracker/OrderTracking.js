// CONFIG - replace these with your actual API settings
const apiUrl = 'https://corsproxy.io/?https://board.maphefosigns.co.za/jsonrpc.php'; // <-- now using CORSProxy.io
const apiUsername = 'jsonrpc'; // <-- replace if needed
const apiPassword = 'a328ecd9eef82243d443f6c0e3d9622cbe929e7d1447df8d8de575dc6ba2'; // <-- replace with your API token

function pretty(obj) {
  try { return JSON.stringify(obj, null, 2); } catch (e) { return String(obj); }
}

// The trackOrder function (calls JSON-RPC method "getOrder")
async function trackOrder(orderId) {
  const payload = {
    jsonrpc: "2.0",
    method: "getTask", // Change to your API's method name if needed
    id: Date.now(),
    params: {
      task_id: Number(orderId)
    }
  };

  document.getElementById('requestArea').textContent = pretty(payload);

  const authHeader = 'Basic ' + btoa(`${apiUsername}:${apiPassword}`);

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    // Show title and column name if result exists
    if (data && data.result) {
      const title = data.result.title || '';
      const columnId = data.result.column_id;
      // Stepper steps mapping (ordered)
      const singleStatusMap = {
        '1': { label: 'BACKLOG', img: 'BACKLOG.png' },
        '2': { label: 'NEW', img: 'NEW.png' },
        '5': { label: 'PENDING PAYMENT', img: 'PENDING PAYMENT.png' }
      };      if (singleStatusMap[columnId]) {
        // Only show the single status image and label
        const status = singleStatusMap[columnId];
        document.getElementById('progressBar').innerHTML = `<div class='progress-step active'><div class='progress-circle'><img src='${status.img}' alt='${status.label}' style='width:60px; height:60px; object-fit:contain; transition: width 0.3s, height 0.3s;'/></div><div class='progress-label'>${status.label}</div></div>`;
        document.getElementById('responseArea').innerHTML = `<strong>${title}</strong><br><span>${status.label}</span><hr><pre>${pretty(data)}</pre>`;
      } else {
        // Show full progress bar for other statuses
        const steps = [
          { id: '3', label: 'DESIGN', img: 'DESIGN.png' },
          { id: '8', label: 'QUEUE FOR PRINTING', img: 'QUEUE FOR PRINTING.png' },
          { id: '6', label: 'PRINTING', img: 'PRINTING.png' },
          { id: '7', label: 'FACTORY', img: 'manufacturing-process.png' },
          { id: '4', label: 'DONE', img: 'DONE.png' }
        ];
        const activeIdx = steps.findIndex(s => s.id === columnId);
        let stepperHtml = '';
        steps.forEach((step, idx) => {
          stepperHtml += `<div class='progress-step${idx === activeIdx ? ' active' : ''}'>` +
            `<div class='progress-circle'><img src='${step.img}' alt='${step.label}' style='width:40px; height:40px; object-fit:contain;'/></div>` +
            `<div class='progress-label'>${step.label}</div></div>`;
          if (idx < steps.length - 1) {
            stepperHtml += `<div class='progress-line'></div>`;
          }
        });
        document.getElementById('progressBar').innerHTML = stepperHtml;
        document.getElementById('responseArea').innerHTML = `<strong>${title}</strong><br><span>${steps[activeIdx]?.label || columnId}</span><hr><pre>${pretty(data)}</pre>`;
      }
    } else {
      document.getElementById('progressBar').innerHTML = '';
      document.getElementById('responseArea').textContent = pretty(data);
    }    console.log('API response:', data);
    
    // Wait for 5 seconds before showing results
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    document.getElementById('wifi-loader').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    return data;
  } catch (err) {
    const errMsg = { error: 'Request failed', details: String(err) };
    document.getElementById('responseArea').textContent = pretty(errMsg);
    console.error('Request error:', err);
    
    // Even on error, wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    document.getElementById('wifi-loader').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    return null;
  }
}

// Wire UI
// Multi-order tracking logic
const orderIntervals = {};

function renderOrderResult(orderId, data) {
  const resultsContainer = document.getElementById('resultsContainer');
  let resultDiv = document.getElementById('orderResult_' + orderId);
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'orderResult_' + orderId;
    resultDiv.className = 'order-card';
    resultsContainer.appendChild(resultDiv);
  }
  // ...existing code for rendering progress bar and response...
  let progressBarHtml = '';
  let responseHtml = '';
  if (data && data.result) {
    const title = data.result.title || '';
    const columnId = data.result.column_id;
    const singleStatusMap = {
      '1': { label: 'BACKLOG', img: 'BACKLOG.png' },
      '2': { label: 'NEW', img: 'NEW.png' },
      '5': { label: 'PENDING PAYMENT', img: 'PENDING PAYMENT.png' }
    };
    if (singleStatusMap[columnId]) {
      const status = singleStatusMap[columnId];
      progressBarHtml = `<div class='progress-step active'><div class='progress-circle'><img src='${status.img}' alt='${status.label}' style='width:60px; height:60px; object-fit:contain; transition: width 0.3s, height 0.3s;'/></div><div class='progress-label'>${status.label}</div></div>`;
      responseHtml = `<strong>${title}</strong><br><span>${status.label}</span>`;
    } else {
      const steps = [
        { id: '3', label: 'DESIGN', img: 'DESIGN.png' },
        { id: '8', label: 'QUEUE FOR PRINTING', img: 'QUEUE FOR PRINTING.png' },
        { id: '6', label: 'PRINTING', img: 'PRINTING.png' },
        { id: '7', label: 'FACTORY', img: 'manufacturing-process.png' },
        { id: '4', label: 'DONE', img: 'DONE.png' }
      ];
      const activeIdx = steps.findIndex(s => s.id === columnId);      steps.forEach((step, idx) => {
        const isActive = idx === activeIdx;
        const imgSize = isActive ? '60px' : '40px';
        progressBarHtml += `<div class='progress-step${isActive ? ' active' : ''}'>` +
          `<div class='progress-circle'><img src='${step.img}' alt='${step.label}' style='width:${imgSize}; height:${imgSize}; object-fit:contain; transition: width 0.3s, height 0.3s;'/></div>` +
          `<div class='progress-label'>${step.label}</div></div>`;
        if (idx < steps.length - 1) {
          progressBarHtml += `<div class='progress-line'></div>`;
        }
      });
      responseHtml = `<strong>${title}</strong><br><span>${steps[activeIdx]?.label || columnId}</span>`;
    }
  } else {
    responseHtml = 'No data found.';
    progressBarHtml = '';
  }
  resultDiv.innerHTML = `<div class='progress-bar' style='margin-bottom:16px;'>${progressBarHtml}</div><div>${responseHtml}</div>`;
}

async function trackOrder(orderId, isRefresh = false) {
  const loaderEl = document.getElementById('wifi-loader');
  
  // Only show loader for initial load, never hide the results container
  if (!isRefresh) {
    loaderEl.style.display = 'flex';
  }
  
  const payload = {
    jsonrpc: "2.0",
    method: "getTask",
    id: Date.now(),
    params: {
      task_id: Number(orderId)
    }
  };
  
  document.getElementById('requestArea').textContent = pretty(payload);
  const authHeader = 'Basic ' + btoa(`${apiUsername}:${apiPassword}`);
  
  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });
    
    const data = await resp.json();
    
    // Only show loader animation for initial load
    if (!isRefresh) {
      const randomDelay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      loaderEl.style.display = 'none';
      initialLoadComplete[orderId] = true;
    }
    
    // Always render the results immediately for refreshes
    renderOrderResult(orderId, data);
    if (data && data.result) {
      document.getElementById('responseArea').innerHTML = `<pre>${pretty(data)}</pre>`;
    }
    return data;
    
  } catch (err) {
    if (!isRefresh) {
      const randomDelay = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);
      await new Promise(resolve => setTimeout(resolve, randomDelay));
      loaderEl.style.display = 'none';
      initialLoadComplete[orderId] = true;
    }
    
    renderOrderResult(orderId, { error: 'Request failed', details: String(err) });
    return null;
  }
}

// Keep track of initial loads vs refreshes
let updateInProgress = false;
let initialLoadComplete = {};

function startAutoRefresh(orderId) {
  if (orderIntervals[orderId]) clearInterval(orderIntervals[orderId]);
  
  // Set interval for background updates (every 3 seconds)
  orderIntervals[orderId] = setInterval(async () => {
    // Skip this update if one is already in progress
    if (updateInProgress) return;
    
    updateInProgress = true;
    // Only do a silent update (no loader) for refreshes
    await trackOrder(orderId, initialLoadComplete[orderId]);
    updateInProgress = false;
  }, 3000);
}

// Modal logic for random code generation
function showRandomCodeModal() {
  document.getElementById('randomCodeModal').style.display = 'flex';
  document.getElementById('modalTrackingInput').value = '';
  document.getElementById('modalResult').textContent = '';
}
function hideRandomCodeModal() {
  document.getElementById('randomCodeModal').style.display = 'none';
}
document.getElementById('closeRandomCodeModal').onclick = hideRandomCodeModal;

// Generate a random code (alphanumeric, 8 chars)
function generateRandomCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Check tracking number and generate code if found
async function checkTrackingAndGenerate() {
  const trackingNum = document.getElementById('modalTrackingInput').value;
  const resultDiv = document.getElementById('modalResult');
  if (!trackingNum) {
    resultDiv.textContent = 'Please enter a tracking number.';
    return;
  }
  resultDiv.textContent = 'Checking...';
  const data = await trackOrder(trackingNum);
  if (data && data.result) {
    const code = generateRandomCode();
    resultDiv.innerHTML = `<span>Tracking found!<br>Generated Code: <strong>${code}</strong></span>`;
    storeTrackingCode(trackingNum, code);
  } else {
    resultDiv.textContent = 'Tracking number not found.';
  }
}
document.getElementById('checkTrackingBtn').onclick = checkTrackingAndGenerate;

// Firebase SDK setup (no import, use global firebase)
const firebaseConfig = {
  apiKey: "AIzaSyDpFbary3lfy20UngDlzwir28JgFW3rLBI",
  authDomain: "smart-tag-system.firebaseapp.com",
  databaseURL: "https://smart-tag-system-default-rtdb.firebaseio.com",
  projectId: "smart-tag-system",
  storageBucket: "smart-tag-system.firebasestorage.app",
  messagingSenderId: "1050770272745",
  appId: "1:1050770272745:web:8dbbfa02e3336e2cfadb78",
  measurementId: "G-65JG1JSWJH"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
const db = firebase.database(app);

// Lookup tracking number by generated key
async function getTrackingByCode(generatedCode) {
  const snapshot = await db.ref('codes').orderByChild('code').equalTo(generatedCode).once('value');
  const val = snapshot.val();
  if (!val) return null;
  // Return the first matching tracking number
  const firstKey = Object.keys(val)[0];
  return val[firstKey].tracking;
}

// Modify tracking logic to accept generated code
async function trackOrderByGeneratedCode(generatedCode) {
  const trackingNum = await getTrackingByCode(generatedCode);
  if (!trackingNum) {
    document.getElementById('responseArea').textContent = 'No tracking found for this code.';
    document.getElementById('progressBar').innerHTML = '';
    return null;
  }
  await trackOrder(trackingNum);
  return trackingNum;
}

// Add UI for entering generated code
window.addEventListener('DOMContentLoaded', () => {
  // Remove tracking number input UI
  const ordersContainer = document.getElementById('ordersContainer');
  if (ordersContainer) ordersContainer.style.display = 'none';
  const addOrderBtn = document.getElementById('addOrderBtn');
  if (addOrderBtn) addOrderBtn.style.display = 'none';
  const trackingLabel = document.querySelector('.tracking-box label');
  if (trackingLabel) trackingLabel.style.display = 'none';

  // Add input for generated code
  const codeInputWrapper = document.createElement('div');
  codeInputWrapper.style.marginBottom = '18px';
  codeInputWrapper.style.textAlign = 'center';
  codeInputWrapper.innerHTML = `    <label style="font-size:1.1rem; font-weight:700; margin-bottom:6px; display:block;">Enter your generated code</label>
    <input id="generatedCodeInput" type="text" inputmode="text" pattern="[A-Za-z0-9]+" placeholder="Enter your generated code..." style="width:200px; padding:8px; font-size:1rem; border-radius:8px; border:1px solid #bbb; margin-right:8px;" />
    <button id="trackByCodeBtn" class="btn-track">Track Order</button>
  `;
  // Fix: append to .tracking-box instead of using insertBefore
  document.querySelector('.tracking-box').appendChild(codeInputWrapper);  document.getElementById('trackByCodeBtn').onclick = function() {
    const code = document.getElementById('generatedCodeInput').value.trim().toUpperCase();
    if (!code) {
      alert('Please enter a generated code.');
      return;
    }
    // Start auto-refresh after tracking the code
    trackOrderByGeneratedCode(code).then(trackingNum => {
      if (trackingNum) {
        startAutoRefresh(trackingNum);
      }
    });
  };

  // Listen for D key to show modal
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
      showRandomCodeModal();
    }
  });
});
