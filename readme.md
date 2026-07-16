# VJTI Finds 🔍

VJTI Finds is a localized web-based solution developed for the Veermata Jijabai Technological Institute (VJTI) community. It provides a centralized, secure, and real-time platform for students and faculty to report lost belongings and facilitate their return; eliminating the inefficiency of scattered social media groups.

---

##  Key Features

- **Verified Campus Access**  
Only VJTI students and faculty can sign up and log in using their official VJTI email IDs. This prevents spam and ensures that only verified campus members can report or claim items.

- **Dual-Track Galleries**  
  Separate and searchable sections for *Lost* and *Found* items, enabling quick discovery.

- **Real-time Synchronization**  
  Powered by Firebase Firestore, ensuring all reports are instantly visible across users.

- **Cloud Image Integration**  
  Uses Cloudinary REST API for efficient image upload, storage, and optimized delivery.

- **Automated Claim System**  
  Integrated with EmailJS to allow users to contact item reporters without exposing personal details.

- **Item Updates**  
  Items can be marked as *Returned*, which updates the UI by fading the item card and disabling further claims.

---

##  Technical Stack

- **Frontend:** HTML5, CSS3  
- **Database:** Firebase Firestore (NoSQL, real-time)  
- **Media Hosting:** Cloudinary  
- **Communication:** EmailJS SDK  
- **Logic:** Vanilla JavaScript using async/await and localStorage  

---

##  File Structure

- `index.html` → User login with VJTI email authentication
- 'signup.html'→ User account registration
- `home.html` → Main dashboard and navigation 
- `report.html` → Form to submit lost/found items  
- `lost.html' → Display and search lost items
- 'found.html' → Display and search found items 
- `project.js` → Core logic (API calls, database handling)

---

##  Usage Flow

1. **Sign Up / Login** → Create an account or sign in using your VJTI email.
2. **Report** → Submit item details (description, location, image)  
3. **Browse** → Search through Lost/Found listings  
4. **Claim** → Send request via automated email system  
5. **Resolve** → Mark item as returned to update system status  

---

##  Deployment Link
https://bhumikaborkar7.github.io/VJTI-Finds/

---
##   Authors
This project was developed by:

Bhumika D. Borkar - https://github.com/bhumikaborkar7

Akshita Mahapatra - https://github.com/akshitamahapatra703-gif

Gauravi Rathod - https://github.com/gauravirathod0307-png
