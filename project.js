// ==========================================
// 1. PROJECT CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAyp_4O__nfWlzd42KyvOxyZF45rYknIs0",
    authDomain: "vjti-finds.firebaseapp.com",
    projectId: "vjti-finds",
    storageBucket: "vjti-finds.firebasestorage.app",
    messagingSenderId: "694809009546",
    appId: "1:694809009546:web:d17f1c8835aa4c7ccb7c73",
    measurementId: "G-0SV7GHYVF3"
};

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqikyzkgs/image/upload';
const CLOUDINARY_PRESET = 'acale0kj';
const EMAILJS_SERVICE_ID = 'service_57g279a';
const REPORT_TEMPLATE_ID = 'template_n192bki';
const CLAIM_TEMPLATE_ID = 'template_ar4ykru';
const EMAILJS_PUBLIC_KEY = 'MUnsRGWyk6T9LoUVL';

emailjs.init(EMAILJS_PUBLIC_KEY);


// ==========================================
// 2. REPORTING LOGIC
// ==========================================
async function handleReportSubmission(event) {
   event.preventDefault();
   const submitBtn = document.getElementById('submitBtn');
   const fileInput = document.getElementById('imageInput');
   const file = fileInput.files[0];


   if (!file) {
       alert("Please upload an image.");
       return;
   }

   submitBtn.innerText = "Uploading...";
   submitBtn.disabled = true;

   try {    // error handeling block
       const formData = new FormData();
       formData.append('file', file);
       formData.append('upload_preset', CLOUDINARY_PRESET);

       const cloudRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });    //fetch= sending http request to server 
       const cloudData = await cloudRes.json();
       if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

       const reportType = document.querySelector('input[name="itemType"]:checked').value;

       const itemData = {
           type: reportType,
           status: "available",
           reporterName: document.getElementById('reporterName').value,
           reporterEmail: document.getElementById('reporterEmail').value,
           itemName: document.getElementById('itemName').value,
           category: document.getElementById('itemCategory').value,
           location: document.getElementById('location').value,
           description: document.getElementById('description').value,
           dateOccurred: document.getElementById('itemDate').value,
           imageUrl: cloudData.secure_url,
           createdAt: firebase.firestore.FieldValue.serverTimestamp()
       };

       await db.collection("items").add(itemData);

       try {
           await emailjs.send(
    EMAILJS_SERVICE_ID,
    REPORT_TEMPLATE_ID,
    {
        from_name: itemData.reporterName,
        reporter_email: itemData.reporterEmail,
        item_name: itemData.itemName,
        type: itemData.type,
        location: itemData.location,
        image_url: itemData.imageUrl
    }
);
       } catch (emailError) {
           console.error("Email notification failed:", emailError); //console= used for debuuging and displaying msgs, only for developers
       }

       alert("Successfully Reported!");
       window.location.href = reportType === "lost" ? "lost.html" : "found.html";

   } catch (error) {
       console.error("Submission Error:", error);
       alert("Error occurred. Check console.");
       submitBtn.disabled = false;
       submitBtn.innerText = "SUBMIT REPORT";
   }
}

// ==========================================
// 3. GALLERY & STATUS LOGIC
// ==========================================
async function loadGalleryItems(filterType) {
   const gallery = document.getElementById('itemsGallery');
   if (!gallery) return;

   try {
       const snapshot = await db.collection("items")
           .where("type", "==", filterType)
           .orderBy("createdAt", "desc")
           .get();

       gallery.innerHTML = "";

       if (snapshot.empty) {
           gallery.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No items found.</p>";
           return;
       }

       snapshot.forEach(doc => {
           const item = doc.data();
           const itemId = doc.id;
           const encodedData = encodeURIComponent(JSON.stringify(item));
           const itemStatus = item.status || "available";
           const isReturned = itemStatus === "returned";

           gallery.innerHTML += `
               <div class="item-card" style="${isReturned ? 'opacity: 0.6;' : ''}">
                   <img src="${item.imageUrl}" alt="${item.itemName}">
                   <div class="item-info">
                       <h3>${item.itemName} ${isReturned ? '<span style="color:red; font-size: 0.8em;">(RETURNED)</span>' : ''}</h3>
                       <p><span class="label">Location:</span> ${item.location}</p>
                       <p><span class="label">Date:</span> ${item.dateOccurred}</p>
                   </div>
                   <div class="button-group" style="display: flex; flex-direction: column; gap: 8px;">
                       <div style="display: flex; gap: 5px;">
                           <button class="btn-claim"
                               ${isReturned ? 'disabled style="background-color: #ccc; flex:1;"' : 'style="flex:1;"'}
                               onclick="openClaimModal('${item.reporterEmail}', '${item.itemName}')">
                               ${isReturned ? 'Returned' : 'Claim Item'}
                           </button>
                           <button class="btn-details" style="flex:1;" onclick="openDetails('${encodedData}')">Details</button>
                       </div>
                       <button class="btn-status"
                           style="background-color: #baa5e1; color: black; border: none; padding: 8px; border-radius: 4px; cursor: pointer;"
                           onclick="markItemAsReturned('${itemId}', '${itemStatus}')">
                           Update Status
                       </button>
                   </div>
               </div>`;
       });
   } catch (error) {
       console.error("Error loading gallery:", error);
   }
}

async function markItemAsReturned(itemId, currentStatus) {
const newStatus = currentStatus === "available" ? "returned" : "available";
if (confirm(`Mark this item as ${newStatus}?`)) {
try {
await db.collection("items").doc(itemId).update({
status: newStatus,
updatedAt: firebase.firestore.FieldValue.serverTimestamp()
});
location.reload();
} catch (error) {
console.error("Status update error:", error);
}
}
}

function openDetails(encodedData) {
   const item = JSON.parse(decodeURIComponent(encodedData));
   const modal = document.getElementById("itemModal");
   const container = document.getElementById("modalDetails");

   if (modal && container) {
       container.innerHTML = `
           <img src="${item.imageUrl}" alt="Item" style="width:100%; border-radius:8px; margin-bottom:15px;">
           <h2>${item.itemName}</h2>
           <p><strong>Category:</strong> ${item.category}</p>
           <p><strong>Location:</strong> ${item.location}</p>
           <p><strong>Date:</strong> ${item.dateOccurred}</p>
           <hr>
           <p><strong>Description:</strong> ${item.description}</p>
           <p><strong>Contact:</strong> ${item.reporterName}</p>
       `;
       modal.style.display = "block";
   }
}

function openClaimModal(reporterEmail, itemName) {
   const modal = document.getElementById("claimModal");
   if (modal) {
       modal.dataset.targetEmail = reporterEmail;
       modal.dataset.itemName = itemName;
       modal.style.display = "block";
   }
}

const claimForm = document.getElementById('claimForm');
if (claimForm) {
   claimForm.addEventListener('submit', async function(e) {
       e.preventDefault();
       const submitBtn = claimForm.querySelector('button[type="submit"]');
       const modal = document.getElementById("claimModal");
      
       submitBtn.innerText = "Sending...";
       submitBtn.disabled = true;

       try {
           await emailjs.send(
    EMAILJS_SERVICE_ID,
    CLAIM_TEMPLATE_ID,
    {
        to_email: modal.dataset.targetEmail,
        from_name: document.getElementById("claimerName").value,
        reporter_email: document.getElementById("claimerEmail").value,
        item_name: modal.dataset.itemName
    }
);
           alert("Sent!");
           modal.style.display = "none";
           claimForm.reset();
       } catch (err) {
    console.error("CLAIM ERROR:", err);
    alert(JSON.stringify(err));

       } finally {
           submitBtn.innerText = "SUBMIT CLAIM";
           submitBtn.disabled = false;
       }
   });
}

window.addEventListener('click', function(event) {
   const itemModal = document.getElementById('itemModal');
   const claimModal = document.getElementById('claimModal');

   if (event.target === itemModal) itemModal.style.display = "none";
   if (event.target === claimModal) claimModal.style.display = "none";
   if (event.target.classList.contains('close-button') ||
       event.target.classList.contains('close') ||
       event.target.id === 'closeClaim' ||
       event.target.id === 'closeDetails') {
      
       if (itemModal) itemModal.style.display = "none";
       if (claimModal) claimModal.style.display = "none";
   }
});

document.addEventListener('DOMContentLoaded', () => {
   if (window.location.pathname.includes('lost.html')) loadGalleryItems('lost');
   if (window.location.pathname.includes('found.html')) loadGalleryItems('found');
});


// ==========================================
// 4. UPDATED SEARCH LOGIC
// ==========================================
async function searchItems(pageType) {  //pagetype= tells which pg u r on
const inputField = document.getElementById("search-input");
const input = inputField ? inputField.value.toLowerCase().trim() : "";
const resultsContainer = document.getElementById("results");
const galleryContainer = document.getElementById("itemsGallery");

if (!resultsContainer || !galleryContainer) return;

if (input === "") {
galleryContainer.style.display = "grid";
resultsContainer.style.display = "none";
resultsContainer.style.padding = "0px";
return;
}

galleryContainer.style.display = "none";
resultsContainer.style.display = "grid";
resultsContainer.style.padding = "40px 20px";
resultsContainer.innerHTML = `<p style='color:#333; grid-column:1/-1; text-align:center; font-size:20px;'>Searching...</p>`;

try {
const snapshot = await db.collection("items").get();
let foundMatch = false;
resultsContainer.innerHTML = "";

snapshot.forEach(doc => {
const data = doc.data();
const isCorrectPage = (pageType === 'home') || (data.type === pageType);

if (isCorrectPage) {
const text = (data.itemName || "").toLowerCase();

if (text.includes(input)) {
foundMatch = true;
const targetPage = data.type === 'found' ? 'found.html' : 'lost.html';
const statusLabel = data.type === 'found' ? 'FOUND ITEM' : 'LOST ITEM';

const cardLink = document.createElement("a");
cardLink.href = targetPage;
cardLink.className = "item-card";
cardLink.style.textDecoration = "none";
cardLink.style.color = "inherit";

cardLink.innerHTML = `
<img src="${data.imageUrl || 'https://via.placeholder.com/200'}" alt="${data.itemName}">
<div class="item-info">
<h3>${data.itemName}</h3>
<p><span class="label">Location:</span> ${data.location}</p>
<p><span class="label">Status:</span> ${statusLabel}</p>
</div>
`;
resultsContainer.appendChild(cardLink);
}
}
});

if (!foundMatch) {
resultsContainer.innerHTML = `<p class="no-results" style="color:#333; grid-column:1/-1; text-align:center; font-size: 28px; font-weight: bold; padding: 40px;">No items found for "${input}"</p>`;
}
} catch (error) {
console.error("Search Error:", error);
resultsContainer.innerHTML = "<p style='color:red; grid-column:1/-1; text-align:center;'>Error fetching data</p>";
}
}






