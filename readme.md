VJTI Finds 🔍

VJTI Finds is a localized, full-stack web application developed for the Veermata Jijabai Technological Institute (VJTI) community. It provides a centralized, secure, and real-time platform for students and faculty to report lost belongings and facilitate their return, replacing the inefficiency of scattered social media groups.


✨ Key Features
Verified Campus Access: Restricts entry to users with a valid @vjti.ac.in email address, ensuring the platform remains a trusted space for the college community.
Dual-Track Galleries: Separate, searchable interfaces for Lost and Found items, allowing for high-speed scanning and discovery.
Real-time Synchronization: Powered by Firebase Firestore, ensuring that any report filed is instantly visible to all users across the campus.
Cloud Image Integration: Seamlessly handles item photos via the Cloudinary REST API, providing high-performance hosting and optimized delivery.
Automated Claim System: Integrated with EmailJS to facilitate communication between the finder and the owner without exposing private contact details on the platform.
Status Lifecycle Management: Reporters can update item status to "Returned," which dynamically updates the UI by fading the item card and disabling further claims.


🛠️ Technical Stack
Frontend: HTML5, CSS3 (Custom Grid layouts, Modal logic, and backdrop-blur effects).
Database: Firebase Firestore (NoSQL real-time database).
Media Hosting: Cloudinary (Secure image storage and URL delivery).
Communication: EmailJS SDK.
Logic: Vanilla JavaScript (ES6+) utilizing async/await for asynchronous API interactions and localStorage for session persistence.


🏗️ File Architecture
index.html: The entrance gateway with regex-based email verification.
home.html: The dashboard providing a quick overview of how the system works.
report.html: The intake portal for new items (Connects to Cloudinary & Firestore).
lost.html / found.html: The discovery galleries featuring search logic and claim modals.
project.js: The "brain" of the app handling all API calls and database management.


🎯 Usage Flow
Login: Verify yourself as a VJTI student/staff.
Report: File a report with a description, location (e.g., Quadrangle, Canteen), and a photo.
Browse: Search for your lost item in the gallery.
Claim: Submit a claim form to send an automated email notification to the reporter.
Resolve: Once returned, the reporter updates the status to clean up the gallery.