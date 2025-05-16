# ClearConsent – **Updated PRD** (January 2025)

## 1. Purpose & Vision

ClearConsent streamlines patient education and digital consent, giving **doctors** an intuitive portal to assign multimedia procedure packets and obtain e‑signatures, while **patients** get a guided, mobile‑friendly experience that answers questions and tracks progress. The platform aims to be **HIPAA‑ready**, modular, and rapidly extensible.

---

## 2. Key User Roles

| Role                  | Primary Goals                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Doctor**            | Create/edit procedures, invite patients (link / QR / SMS / email), track consent status, answer patient messages.                     |
| **Patient**           | Enroll through invitation link, review assigned modules (video + PDF), ask questions, provide typed or drawn signature, resume later. |
| **Admin** *(Phase 3)* | Customer support, user verification, audit logs, subscription & billing.                                                              |

---

## 3. Feature Set (MVP Completed & In‑Progress)

### 3.1 Doctor Side

| Area                            | Status        | Notes                                                                                                                           |
| ------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Onboarding Wizard** (5 steps) | ✔ Implemented | Basic info → Credentials → Practice → Account setup → Summary. Skips verification for now.                                      |
| **Auth**                        | ✔             | Email / password with JWT (mock hashing for dev).                                                                              |
| **Dashboard**                   | ✔             | Two tables (Patients, Procedures); search & add buttons; quick stats panel (optional).                                          |
| **Patient CRUD**                | ✔             | Add / view patient; assign materials modal.                                                                                     |
| **Procedure CRUD**              | ✔             | Create / edit page with Title, Desc, PDF link/upload, Video URL, optional "Record Video" stub. Live video preview if URL valid. |
| **Messaging**                   | ☐ (stub)      | Backend-ready table `chat_messages` planned; placeholder UI exists.                                                            |
| **Profile & Settings**          | ✔             | Editable profile page; settings page (change password, notifications).                                                          |
| **Logout**                      | ✔             | Clears token and returns to home.                                                                                               |

### 3.2 Patient Side

| Area                                  | Status   | Notes                                                                                                                                             |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Invitation‑Only Onboarding Wizard** | ✔        | Link / QR hits `/patient/onboarding/:token`; collects demographics + password.                                                                    |
| **Auth & Session**                    | ✔        | JWT stored in localStorage.                                                                                                                       |
| **Dashboard**                         | ✔        | List of assignments with status (Sent, Viewed, In Progress, Completed); "Open" button.                                                            |
| **Assignment Page**                   | ✔        | Embedded Video viewer, PDF/PowerPoint viewer, messaging pane, dual‑mode e‑signature (typed/drawn), save progress, complete & return to dashboard. |
| **Messaging**                         | ☐ (stub) | Writes to in‑memory store; UI ready.                                                                                                              |
| **Save Progress**                     | ✔        | Stores partial form state in localStorage (MVP); DB persistence planned.                                                                          |
| **Navbar Dropdown**                   | ✔        | Profile, Settings, Logout.                                                                                                                        |

---

## 4. Technical Architecture

| Layer                      | Tech                                               | Notes                                                                                                     |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend**               | React (+ Vite), Context API for auth state         | Tailwind styling; hero & palette refresh complete.                                                        |
| **Backend**                | Node.js + Express                                  | JWT auth, mock in‑memory datastore; CORS enabled; planned migration to PostgreSQL.                        |
| **Database (Phase 2)**     | PostgreSQL via Knex or Prisma                      | Initial tables: doctors, patients, procedures, assignments, chat\_messages. Versioned migrations planned. |
| **File Storage (Phase 2)** | AWS S3 or similar                                  | For uploaded PDFs, videos; MVP uses URL links.                                                            |
| **Hosting (Phase 2+)**     | HIPAA‑capable cloud (AWS HIPAA, Azure Health Data) | HTTPS, env‑vars for secrets, encryption at rest.                                                          |

---

## 5. Updated Milestones

| Milestone                             | Target   | Deliverables                                                                                                 |
| ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| **MVP v1 (doctor + patient portals)** | DONE     | Core onboarding, dashboards, procedure CRUD, assignment flow, e‑signature.                                   |
| **MVP v2 (Database Integration)**     | Feb 2025 | PostgreSQL schema + migrations; store users, procedures, assignments; migrate save‑progress; hash passwords. |
| **Messaging & Notifications**         | Mar 2025 | Real‑time or queued chat; email/SMS reminders via Twilio or SendGrid; audit logs start.                      |
| **HIPAA Hardening**                   | Q2 2025  | Encryption at rest, full audit trails, BAA with hosting provider.                                            |
| **Admin Portal & Billing**            | Q3 2025  | Support dashboard, subscription tiers, Stripe integration.                                                   |

---

## 6. Metrics of Success

1. **Adoption**: ≥ 50 active doctors and 500 patients in first 6 months post‑launch.
2. **Completion Rate**: ≥ 80 % of assignments reach "Completed" within 7 days of being sent.
3. **Time Saved**: Average consent workflow time reduced by 50 % vs. paper baseline.
4. **User Satisfaction**: 80 % + positive feedback on clarity and ease‑of‑use.
5. **Security Incidents**: 0 reportable HIPAA breaches or P1 vulnerabilities.

---

## 7. Open Risks & Mitigations

| Risk                                    | Mitigation                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Schema Drift** as requirements evolve | Adopt Knex/Prisma migrations; keep non‑critical fields in JSONB until stable.                    |
| **HIPAA Compliance Overhead**           | Modularize security layers; start audits early; choose HIPAA‑certified hosting.                  |
| **User Adoption Resistance**            | Provide onboarding videos, offer templates, ensure minimal click workflow.                       |
| **Scaling Messaging**                   | Prototype with in‑memory, then migrate to managed message queue (e.g., AWS SQS) as volume grows. |

---

## 8. Next Steps (January → February 2025)

1. **Finish DB schema + initial migrations**
2. **Persist save‑progress & messaging** in PostgreSQL
3. **Implement patient–doctor chat backend**
4. **Add minimal analytics widget** on doctor dashboard
5. **Begin HIPAA encryption / logging groundwork**

---

ClearConsent now has solid wiring for doctor and patient flows, with scalable next steps focused on database integration, messaging, and compliance. This updated PRD should guide development through MVP v2 and beyond.
