# VoxLogiX Web App Feature Scope

## Project Overview

**VoxLogiX** is an AI voice-powered operations logging platform for businesses, factories, plants, service teams, and equipment maintenance workflows.

The first version will be a **responsive web app**, so businesses can test the complete workflow from a browser without installing a mobile app.

## Product Type

- Responsive Web Application
- SaaS-ready architecture
- Role-based panel access
- AI voice-to-log system
- Admin-controlled business operations platform

## Core Purpose

The system allows users to:

1. Select a log module/category.
2. Record a voice update.
3. Convert voice into text.
4. Use AI to extract structured log details.
5. Review and edit details before submission.
6. Upload before/after images or attachments.
7. Save, manage, track, and analyze logs from the web panel.

---

# User Roles

The system will include **4 roles**:

1. Master
2. Admin / Owner
3. Planner
4. Execution

---

# 1. Master Role Features

## Master Role Definition

Master is the platform-level access. This role controls the complete VoxLogiX system and can manage all businesses, owners, modules, usage, and platform settings.

## Master Dashboard

Master can view platform-wide statistics:

- Total companies
- Active companies
- Inactive companies
- Suspended companies
- Total admins/owners
- Total planners
- Total execution users
- Total logs created
- AI processed logs
- AI usage this month
- Estimated AI/API cost
- Storage used
- Recent company activity
- Recent platform activity

## Company Management

Master can create and manage businesses/companies.

### Company Fields

- Company name
- Company logo
- Owner name
- Owner email
- Owner phone
- Business type
- Address
- Status
- Plan type
- Start date
- Expiry date
- Notes

### Company Status

- Demo
- Active
- Inactive
- Suspended
- Expired

### Company Actions

- Create company
- Edit company
- Activate company
- Deactivate company
- Suspend company
- Delete company
- View company dashboard
- View company logs
- Manage company access

## Admin / Owner Management

Master can create and manage Admin/Owner accounts for each company.

### Admin Fields

- Full name
- Username
- Password
- Email
- Phone number
- Assigned company
- Status
- Created date

### Admin Actions

- Create admin account
- Edit admin details
- Reset admin password
- Activate/deactivate admin
- Assign admin to company
- View admin login/activity

## Company Access Control

Master can control what each company can use.

Access toggles:

- Voice logging
- AI structured extraction
- Image upload
- Equipment module
- Shift module
- Safety module
- Counter/Meter module
- Suggestion module
- Reports
- Export
- Storage access
- User creation limit
- AI usage limit

## Global Module Management

Master can manage default modules of the platform.

Default modules:

- Shift
- Equipment
- Safety
- Counter / Meter
- Suggestion

### Module Fields

- Module name
- Module icon
- Module color
- Status
- Default required fields
- Description

### Module Actions

- Add module
- Edit module
- Enable/disable module
- Set default color
- Set default required fields

## AI / API Usage Monitoring

Master can monitor AI usage company-wise.

### AI Usage Data

- Total voice minutes used
- Total AI logs generated
- AI success count
- AI failed count
- Company-wise AI usage
- Date-wise AI usage
- Estimated AI/API cost
- High-usage companies

## Storage Monitoring

Master can monitor platform storage usage.

### Storage Data

- Total storage used
- Company-wise storage usage
- Total uploaded images
- Total attachments
- Largest storage users

## Billing / Subscription Status

For the first version, billing can be manual.

### Billing Fields

- Company
- Plan name
- Monthly/annual charges
- Payment status
- Due date
- Expiry date
- Internal notes

### Billing Status

- Demo
- Trial
- Active
- Payment Due
- Expired
- Suspended

## Platform Settings

Master can manage global platform settings.

Settings include:

- Platform name
- Platform logo
- Default theme
- Default module colors
- AI provider settings
- Storage settings
- Email settings
- Maximum upload size
- Default trial days
- Global status options

## Activity Logs / Audit Trail

Master can view important actions across the platform.

Examples:

- Company created
- Company suspended
- Admin account created
- Admin password reset
- Module enabled/disabled
- AI usage limit changed
- Execution created log
- Admin updated settings

## Master Sidebar Menu

Recommended menu:

- Dashboard
- Companies
- Admins / Owners
- Modules
- AI Usage
- Storage
- Billing
- Activity Logs
- Settings

---

# 2. Admin / Owner Role Features

## Admin / Owner Role Definition

Admin/Owner is the business-level owner. This role manages only their own company data, users, logs, equipment, modules, and reports.

## Admin Dashboard

Admin can view business-level statistics:

- Today logs
- Total logs
- Pending logs
- Completed logs
- Rejected / correction logs
- Total planners
- Total execution users
- Total equipment
- AI logs processed
- Downtime hours
- Recent logs
- Recent activity

## Planner & Execution User Management

Admin can manage planners and execution users for their company.

### User Fields

- Full name
- Username
- Password
- Email
- Phone
- Assigned plant/location
- Status
- Created date

### Execution Actions

- Add planner / execution user
- Edit planner / execution user
- Reset password
- Activate/deactivate planner / execution user
- Delete planner / execution user
- View planner / execution user logs

## Log Management

Admin can manage all logs created inside their company.

### Admin Log Actions

- View all logs
- Search logs
- Filter logs
- Open log details
- Edit log details
- Delete logs
- Change log status
- Export logs
- View transcript
- View AI structured output
- View before/after images
- Add internal notes

## Log Status Management

Simple status flow for the first version:

- Draft
- Submitted
- In Progress
- Completed
- Rejected / Needs Correction

Admin can update log status manually.

## Equipment Management

Admin can manage equipment/assets.

### Equipment Fields

- Equipment name
- Equipment ID
- Image
- Equipment category
- Plant
- Unit
- Location
- Status
- Last service date
- Next service date
- Notes

### Equipment Actions

- Add equipment
- Edit equipment
- Delete equipment
- Search equipment
- Filter equipment
- View equipment log history

## Module Management

Admin can manage company-level modules.

Default modules:

- Shift
- Equipment
- Safety
- Counter / Meter
- Suggestion

### Module Customization

- Module name
- Module color
- Module icon
- Active/inactive
- Required fields
- Display order

Admin can customize module colors according to business requirement.

Example:

- Shift: Yellow
- Equipment: Teal
- Safety: Red
- Counter/Meter: Blue
- Suggestion: Purple

## Plant / Unit / Location Management

Admin can manage company structure.

### Structure Levels

- Plant
- Unit
- Area
- Location

Examples:

- Plant A
- LTT 6 Area
- Warehouse Area
- Utility Room
- Chemical Storage
- Pump House

## Reports & Analytics

Admin can view company-level reports.

Reports include:

- Logs by date
- Logs by module
- Logs by equipment
- Logs by execution user
- Logs by severity
- Logs by status
- Downtime report
- Root cause report
- Repeated equipment issues
- AI processed logs
- Image/attachment usage

## Export

Admin can export:

- Logs CSV
- Logs Excel
- Equipment list
- User list
- Basic reports

PDF export can be added later if needed.

## Company Settings

Admin can manage company-level settings.

Settings include:

- Company name
- Company logo
- Contact details
- Address
- Default module colors
- Default status options
- Upload settings
- User access settings
- AI usage visibility

## Admin Sidebar Menu

Recommended menu:

- Dashboard
- Create Log
- Logs
- Equipment
- Modules
- Users
- Locations
- Reports
- Settings

---

---

# 3. Planner Role Features

## Planner Role Definition

Planner is the planning, review, and verification level between Admin/Owner and Execution users.

The Planner role is similar to a supervisor level, but the client has finalized the name as **Planner**.

Planner users can review submitted logs, add planning remarks, assign status, and verify or send logs back for correction.

## Planner Dashboard

Planner can view:

- Assigned logs
- Submitted logs
- Planned logs
- In-progress logs
- Completed logs
- Needs correction logs
- Recent log activity
- Logs requiring action

## Assigned Logs

Planner can view logs assigned to them or available for planning.

Features:

- Search logs
- Filter by status
- Filter by module
- Filter by equipment
- Filter by section/location
- Filter by date
- Open log detail
- Add planning remarks
- Update status

## Planner Log Actions

Planner can:

- View log details
- View transcript
- View AI structured output
- View before/after images
- Add planning remarks
- Add internal comments
- Mark log as planned
- Mark log as in progress
- Mark log as completed
- Send log back for correction
- Verify work if required

## Planner Restrictions

Planner should not access:

- Master platform settings
- Company billing
- Company access control
- Global modules
- Other company data
- Master data upload unless Admin allows it later

## Planner Sidebar Menu

Recommended menu:

- Dashboard
- Assigned Logs
- Submitted Logs
- Planned Logs
- Profile


# 4. Execution Role Features

## Execution Role Definition

Execution is the operational user who creates logs using voice or manual entry.

## Execution Dashboard

Execution can view:

- Today logs
- Own submitted logs
- Draft logs
- Completed logs
- Rejected/correction logs
- Recent activity

## Create Voice Log

Execution can create a log using voice.

### Voice Log Flow

1. Select module/category
2. Start voice recording
3. Speak the update naturally
4. System converts voice to text
5. AI extracts structured details
6. Execution reviews/edit fields
7. Upload images/attachments
8. Submit log

## Module Selection

Execution can select from available modules:

- Shift
- Equipment
- Safety
- Counter / Meter
- Suggestion

## Voice Recording

Features:

- Start recording
- Pause/stop recording
- Recording timer
- Voice waveform
- Transcript preview
- Generate AI log button

## AI Transcript

System generates transcript from voice.

Transcript example:

> LTT 6 electrical panel me fuse issue tha. Fuse replace kar diya. Downtime 20 minutes tha. Root cause fuse failure tha. Pending work nahi hai.

## AI Structured Extraction

AI extracts fields such as:

- Title
- Description
- Equipment ID
- Plant
- Unit
- Location
- Root cause
- Action taken
- Downtime minutes
- Severity
- Pending work

## AI Review

Execution can review AI-generated details before submitting.

Actions:

- Edit details
- Regenerate
- Save as draft
- Continue
- Submit

## Manual Log Form

Execution can manually edit the log form.

Fields:

- Module
- Title
- Description
- Equipment ID
- Plant
- Unit
- Location
- Root cause
- Action taken
- Downtime minutes
- Severity
- Has pending work
- Notes

## Media Upload

Execution can upload proof.

Upload types:

- Before photo
- After photo
- Additional images
- PDF/document attachment

For the first version:

- Before/after images optional
- Maximum 3-5 images per log
- Video upload not included initially

## My Logs

Execution can view only their own logs.

Features:

- Grid view
- Table view
- Search
- Filter by status
- Filter by module
- View log detail
- Edit draft logs
- Check submitted log status

## Execution Profile

Execution can view/update limited profile details.

Profile includes:

- Name
- Username
- Role
- Assigned plant/location
- Password change
- Logout

Execution cannot access:

- Company settings
- User management
- Master settings
- Other users' logs
- AI billing
- Platform usage
- Reports unless allowed later

## Execution Sidebar Menu

Recommended menu:

- Dashboard
- Create Log
- My Logs
- Profile

---

# Core Web App Screens

## Authentication Screens

- Login screen
- Forgot password screen
- Reset password screen

Current login method:

- Username
- Password

No Google login or SSO in the first version.

## Master Panel Screens

- Master Dashboard
- Companies List
- Add/Edit Company
- Company Detail
- Admin/Owner Management
- Add/Edit Admin
- Global Modules
- AI Usage
- Storage Usage
- Billing Status
- Activity Logs
- Platform Settings

## Admin / Owner Panel Screens

- Admin Dashboard
- Create Log
- Logs List
- Logs Grid View
- Logs Table View
- Log Detail
- Equipment List
- Add/Edit Equipment
- Module Management
- Location Management
- User/Execution Management
- Reports
- Company Settings

## Execution Panel Screens

- Execution Dashboard
- New Voice Log
- AI Review
- Detailed Log Form
- Media Upload
- My Logs
- Log Detail
- Profile

---

# Main Log Modules

## Shift Module

Used for:

- Shift handover
- Daily work updates
- Team notes
- Production notes
- General operational updates

Possible fields:

- Shift name
- Team
- Work summary
- Pending work
- Issues
- Handover notes

## Equipment Module

Used for:

- Equipment issue
- Service activity
- Maintenance work
- Breakdown report
- Repair history

Possible fields:

- Equipment ID
- Equipment name
- Location
- Issue
- Root cause
- Action taken
- Downtime
- Severity
- Pending work

## Safety Module

Used for:

- Safety incident
- Hazard report
- Chemical spill
- Unsafe condition
- Compliance issue

Possible fields:

- Incident type
- Location
- Severity
- Description
- Immediate action
- Person involved
- Image proof
- Status

## Counter / Meter Module

Used for:

- Meter reading
- Counter value
- Machine reading
- Daily reading entry
- Abnormal reading report

Possible fields:

- Meter name
- Reading value
- Previous reading
- Current reading
- Unit
- Date/time
- Notes

## Suggestion Module

Used for:

- Improvement idea
- Operational suggestion
- Safety suggestion
- Maintenance improvement
- Cost-saving idea

Possible fields:

- Suggestion title
- Description
- Related area
- Expected benefit
- Priority
- Submitted by

---

# Log Lifecycle

Recommended lifecycle for first version:

1. Draft
2. Submitted
3. In Progress
4. Completed
5. Rejected / Needs Correction

Future lifecycle if supervisor is added:

1. Draft
2. Submitted
3. Pending Verification
4. Verified
5. Rejected
6. Reopened
7. Completed

---

# AI Workflow

## Step-by-Step AI Flow

1. User selects a module.
2. System loads the selected module schema.
3. User records voice.
4. Audio is sent to speech-to-text API.
5. Transcript is generated.
6. Transcript is sent to AI model with the selected module schema.
7. AI extracts only that module's structured fields.
8. User reviews the result.
9. User edits if needed.
10. Log is saved to database.

## AI Output Should Include

- Clean summary
- Structured fields
- Severity suggestion
- Pending work detection
- Root cause extraction
- Action taken extraction
- Equipment/location detection

Important rule:

AI output should not be saved directly as final data. User must review it before submission.

---

# UI / Design Direction

## Theme

- Light mode as default
- Dark mode optional
- Client-provided color as primary
- White cards
- Dark navy/charcoal text
- Soft borders
- Rounded corners
- Clean SaaS dashboard layout
- shadcn `globals.css` variables should be customized

## Primary Colors

- Client-provided brand color: Primary action
- Teal: Equipment
- Red: Safety
- Blue: Counter / Meter
- Purple: Suggestion
- Yellow: Shift

## UI Style

- Modern SaaS dashboard
- Clean tables
- Quick action cards
- Grid + table views
- AI review side panel
- Simple forms
- Clear role-based navigation

---

# First Version Scope

## Included in First Version

- Responsive web app
- Username/password login
- Light mode default
- Optional dark mode
- Client-provided primary theme color
- Master data Excel upload
- Module-wise AI field extraction architecture
- Equipment Log trial module
- 4 roles: Master, Admin/Owner, Planner, Execution
- Master dashboard
- Company management
- Admin/Owner management
- Admin dashboard
- Execution management
- Voice log creation
- Speech-to-text integration
- AI structured extraction
- Manual review/edit form
- Before/after image upload
- Logs grid view
- Logs table view
- Log detail page
- Equipment management
- Module management with colors
- Location management
- Basic reports
- Status management
- Basic usage tracking
- Settings

## Not Included in First Version

- Mobile app
- Offline mode
- QR scanning
- WhatsApp alerts
- SMS alerts
- Advanced PDF reports
- Subscription payment gateway
- Custom AI model training
- Complex approval workflow beyond Planner status updates
- Fully active supervisor-style workflow beyond Planner basics
- Fully active multi-module workflow
- Advanced automation
- Video upload

---

# Recommended Development Priority

## Priority 1

- Auth and role-based access
- Master company management
- Admin/Owner management
- Admin dashboard
- Execution management

## Priority 2

- Voice recording
- Speech-to-text
- AI structured extraction
- Log creation flow
- Manual edit form

## Priority 3

- Logs grid/table
- Log detail
- Media upload
- Status management

## Priority 4

- Equipment management
- Module management
- Location management
- Reports
- Usage tracking
- Settings

---

# Final Product Summary

VoxLogiX will be a responsive AI-powered operations logging web app where businesses can create structured operational logs using voice. The system will include Master, Admin/Owner, Planner, and Execution roles. Master manages the complete platform, Admin/Owner manages their company, and Execution users create logs through voice, AI review, manual editing, and media proof upload.

The first version will focus on web-based trial/demo usage with Equipment Log first. Mobile apps, supervisor workflow, offline mode, and advanced automation can be added later.
