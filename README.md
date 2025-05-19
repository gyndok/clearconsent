# ClearConsent

ClearConsent is a modern healthcare platform that streamlines patient education and digital consent, providing doctors with an intuitive portal to assign multimedia procedure packets and obtain e-signatures, while giving patients a guided, mobile-friendly experience that answers questions and tracks progress.

![ClearConsent Dashboard](https://placeholder.com/your-dashboard-screenshot.png)

## Purpose & Vision

ClearConsent aims to revolutionize the patient consent process by:
- Reducing paperwork and administrative overhead
- Improving patient understanding through multimedia education
- Streamlining the consent workflow for healthcare providers
- Ensuring HIPAA compliance and data security
- Creating an auditable trail of patient consent

## Key Features

### Doctor Portal
- **Onboarding Wizard**: 5-step process for doctor registration
- **Dashboard**: Overview of patients, procedures, and consent status
- **Patient Management**: Add, view, and manage patient information
- **Procedure Management**: Create and edit procedure information with multimedia support
- **Messaging System**: Communicate directly with patients about procedures
- **Analytics**: Track consent rates, patient engagement, and procedure metrics

### Patient Portal
- **Invitation-Only Onboarding**: Secure registration through doctor-provided links
- **Dashboard**: View assigned procedures and their status
- **Assignment Page**: Review educational materials and provide consent
- **E-Signature**: Dual-mode signature capture (typed/drawn)
- **Progress Saving**: Resume consent process later if needed
- **Messaging**: Ask questions directly to healthcare providers

## Technology Stack

- **Frontend**: React with Next.js App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: JWT-based auth system
- **Backend**: Node.js + Express (planned migration to PostgreSQL)
- **Future Storage**: AWS S3 or similar for uploaded PDFs and videos

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/gyndok/clearconsent.git
cd clearconsent
