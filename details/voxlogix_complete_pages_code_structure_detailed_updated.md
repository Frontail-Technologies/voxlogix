# VoxLogiX Complete Web App Pages & Code Structure

## Purpose

This document defines the complete page structure, route structure, reusable components, utilities, and scalable code architecture for the VoxLogiX responsive web app.

VoxLogiX has 4 roles:

1. Master
2. Admin / Owner
3. Planner
4. Execution

The system should be built as a SaaS-ready web application using:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- PostgreSQL
- Prisma or Drizzle ORM
- Role-based access control

Recommended icon style: use Solar Icons, Phosphor Icons, Tabler Icons, Iconoir, or custom SVG icons because they look more polished and less default-developer-dashboard style than Lucide.



---

# Latest Scope Updates

- Roles are now: **Master, Admin/Owner, Planner, Execution**
- Trial/demo will use only **Equipment Log**
- Master data upload using Excel is required
- Different modules have different AI extraction fields
- Safety module uses safety-specific fields
- Measurement Point module includes unit of measurement, equipment assigned, target value, upper limit, and lower limit
- Light mode is default
- Dark mode is optional
- Client-provided color must be used as `--primary` in shadcn `globals.css`
- Do not keep default shadcn theme variables
- Do not use default Lucide icons directly


---
## Theme & Design System

Do not use the default shadcn/ui theme.

The project must override the default `globals.css` CSS variables and create a completely custom design system matching the VoxLogiX brand.

Update all semantic theme variables instead of hardcoding colors inside components.

The design should use semantic tokens such as:

```css
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--border
--input
--ring
--destructive
--chart-1
--chart-2
--chart-3
--chart-4
--chart-5
```

Never leave the default shadcn values.

Replace every token with VoxLogiX brand colors.

Example:

- Primary → Client-provided brand color
- Background → Warm Beige
- Card → White
- Accent → Soft version of client-provided brand color
- Border → Warm Gray
- Foreground → Dark Navy
- Muted → Neutral Gray

All components must consume semantic tokens such as:

```tsx
bg-background
text-foreground
bg-card
text-card-foreground
bg-primary
text-primary-foreground
border-border
text-muted-foreground
bg-accent
```

Avoid using direct Tailwind colors like:

```tsx
bg-yellow-500
bg-gray-100
text-black
border-gray-200
```

unless it's a very specific status color.

The entire application should be theme-driven using CSS variables so the branding can be changed from one place.

Main rule:

```txt
--primary = client-provided brand color
```

## Component Styling Rule

Never modify shadcn components directly.

Wrap or extend them inside `src/components/ui/` or `src/components/common/` so upgrades remain easy.

Example:

Button → AppButton
Card → AppCard
Dialog → AppDialog
Input → AppInput
Table → AppTable
Badge → StatusBadge

# Complete Page Count Summary

## Auth Pages

1. Login
2. Forgot Password
3. Reset Password
4. Unauthorized / Access Denied

## Master Pages

1. Master Dashboard
2. Companies List
3. Add Company
4. Edit Company
5. Company Detail
6. Company Access Control
7. Company Usage Detail
8. Admins / Owners List
9. Add Admin / Owner
10. Edit Admin / Owner
11. Admin / Owner Detail
12. Global Modules List
13. Add Global Module
14. Edit Global Module
15. AI Usage Dashboard
16. AI Usage Company Detail
17. Storage Usage
18. Billing List
19. Billing Detail / Update Payment Status
20. Activity Logs
21. Platform Settings
22. Master Profile

## Admin / Owner Pages

1. Admin Dashboard
2. Create Log
3. Logs List
4. Logs Grid View
5. Logs Table View
6. Log Detail
7. Edit Log
8. Equipment List
9. Add Equipment
10. Edit Equipment
11. Equipment Detail
12. Issue Categories List
13. Add/Edit Issue Category
14. Master Data Upload
15. Master Data Validation Result
16. Company Modules List
17. Edit Company Module
18. Module Field Schema
19. Planners List
20. Add Planner
21. Edit Planner
22. Planner Detail
23. Execution Users List
24. Add Execution User
25. Edit Execution User
26. Execution User Detail
27. Sections & Locations List
28. Add Location
29. Edit Location
30. Reports Dashboard
31. Logs Report
32. Equipment Report
33. Planner Report
34. Execution User Report
35. Downtime Report
36. Company Settings
37. Admin Profile

## Planner Pages

1. Planner Dashboard
2. Assigned Logs
3. Submitted Logs
4. Planned Logs
5. Log Detail
6. Planning Remarks
7. Status Update
8. Planner Profile
9. Change Password

## Execution Pages

1. Execution Dashboard
2. Create Voice Log
3. AI Review
4. Detailed Log Form
5. Media Upload
6. My Logs
7. My Logs Grid View
8. My Logs Table View
9. Log Detail
10. Edit Draft Log
11. Execution Profile
12. Change Password

---

# Complete Next.js App Route Structure

```txt
src/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── unauthorized/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   │
│   │   ├── master/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [companyId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── access/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── usage/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── admins/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [adminId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [moduleId]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── usage/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [companyId]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── storage/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── billing/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [billingId]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── activity-logs/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── create-log/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── logs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── grid/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── table/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [logId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── equipment/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [equipmentId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [moduleId]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── executions/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [executionId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── locations/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [locationId]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── logs/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── equipment/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── executions/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── downtime/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   └── execution/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       │
│   │       ├── create-log/
│   │       │   ├── page.tsx
│   │       │   ├── ai-review/
│   │       │   │   └── page.tsx
│   │       │   ├── details/
│   │       │   │   └── page.tsx
│   │       │   └── media/
│   │       │       └── page.tsx
│   │       │
│   │       ├── my-logs/
│   │       │   ├── page.tsx
│   │       │   ├── grid/
│   │       │   │   └── page.tsx
│   │       │   ├── table/
│   │       │   │   └── page.tsx
│   │       │   └── [logId]/
│   │       │       ├── page.tsx
│   │       │       └── edit-draft/
│   │       │           └── page.tsx
│   │       │
│   │       └── profile/
│   │           ├── page.tsx
│   │           └── change-password/
│   │               └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── master/
│   │   ├── admin/
│   │   ├── execution/
│   │   ├── ai/
│   │   ├── upload/
│   │   └── reports/
│   │
│   ├── layout.tsx
│   └── globals.css
```

---

# Auth Pages

## 1. Login Page

Route:

```txt
/login
```

Features:

- Username input
- Password input
- Sign In button
- Forgot Password link
- No Google login
- No SSO login

## 2. Forgot Password Page

Route:

```txt
/forgot-password
```

Features:

- Username or email input
- Submit reset request
- Success message

## 3. Reset Password Page

Route:

```txt
/reset-password
```

Features:

- New password
- Confirm password
- Reset button

## 4. Unauthorized Page

Route:

```txt
/unauthorized
```

Features:

- Access denied message
- Return to dashboard button

---

# Master Panel Pages

## 1. Master Dashboard

Route:

```txt
/master/dashboard
```

Features:

- Total companies
- Active companies
- Inactive companies
- Suspended companies
- Total admins
- Total executions
- Total logs
- AI logs processed
- AI usage this month
- Estimated AI cost
- Storage used
- Recent companies
- Recent activities

## 2. Companies List

Route:

```txt
/master/companies
```

Features:

- Companies table
- Search companies
- Filter by status
- Filter by plan
- Add company button
- View company action
- Edit company action
- Suspend company action
- Delete company action

## 3. Add Company

Route:

```txt
/master/companies/new
```

Fields:

- Company name
- Company logo
- Owner name
- Owner email
- Owner phone
- Business type
- Address
- Plan type
- Status
- Start date
- Expiry date
- Notes

## 4. Edit Company

Route:

```txt
/master/companies/[companyId]/edit
```

Features:

- Edit all company details
- Update status
- Update plan
- Save changes

## 5. Company Detail

Route:

```txt
/master/companies/[companyId]
```

Features:

- Company overview
- Owner details
- Company status
- Plan details
- Total users
- Total logs
- AI usage
- Storage usage
- Recent logs
- Company activity
- Quick actions

## 6. Company Access Control

Route:

```txt
/master/companies/[companyId]/access
```

Features:

- Enable/disable voice logging
- Enable/disable AI extraction
- Enable/disable image upload
- Enable/disable reports
- Enable/disable modules
- Set user limit
- Set AI usage limit
- Set storage limit

## 7. Company Usage Detail

Route:

```txt
/master/companies/[companyId]/usage
```

Features:

- Company AI usage
- Voice minutes
- Logs processed
- Storage used
- Uploaded images
- Estimated API cost
- Usage by date

## 8. Admins / Owners List

Route:

```txt
/master/admins
```

Features:

- Admin list
- Search admin
- Filter by company
- Filter by status
- Add admin button
- View admin
- Edit admin
- Reset password
- Activate/deactivate admin

## 9. Add Admin / Owner

Route:

```txt
/master/admins/new
```

Fields:

- Full name
- Username
- Password
- Email
- Phone
- Company
- Status

## 10. Edit Admin / Owner

Route:

```txt
/master/admins/[adminId]/edit
```

Features:

- Edit admin details
- Change assigned company
- Change status
- Reset password

## 11. Admin / Owner Detail

Route:

```txt
/master/admins/[adminId]
```

Features:

- Admin profile
- Assigned company
- Login history
- Activity history
- Status
- Quick actions

## 12. Global Modules List

Route:

```txt
/master/modules
```

Features:

- Default modules list
- Module color
- Module icon
- Module status
- Add module
- Edit module
- Enable/disable module

## 13. Add Global Module

Route:

```txt
/master/modules/new
```

Fields:

- Module name
- Module type
- Icon
- Color
- Description
- Required fields
- Status

## 14. Edit Global Module

Route:

```txt
/master/modules/[moduleId]/edit
```

Features:

- Edit module name
- Edit icon
- Edit color
- Edit required fields
- Update status

## 15. AI Usage Dashboard

Route:

```txt
/master/usage
```

Features:

- Total AI usage
- Voice minutes used
- AI logs generated
- AI success count
- AI failed count
- Estimated API cost
- Company-wise usage table
- Date-wise usage chart

## 16. AI Usage Company Detail

Route:

```txt
/master/usage/[companyId]
```

Features:

- Usage detail for one company
- Voice minutes
- AI processed logs
- Failed AI requests
- Estimated cost
- Daily usage
- Monthly usage

## 17. Storage Usage

Route:

```txt
/master/storage
```

Features:

- Total storage used
- Company-wise storage
- Uploaded images count
- Attachment count
- Largest storage users

## 18. Billing List

Route:

```txt
/master/billing
```

Features:

- Company billing table
- Plan type
- Payment status
- Due date
- Expiry date
- Update payment status

## 19. Billing Detail / Update Payment Status

Route:

```txt
/master/billing/[billingId]
```

Features:

- Billing details
- Manual payment update
- Payment notes
- Expiry update
- Status update

## 20. Activity Logs

Route:

```txt
/master/activity-logs
```

Features:

- Platform activity table
- Filter by company
- Filter by user
- Filter by action
- Filter by date

## 21. Platform Settings

Route:

```txt
/master/settings
```

Features:

- Platform name
- Platform logo
- Default theme
- AI settings
- Storage settings
- Upload size limit
- Default trial days
- Email settings

## 22. Master Profile

Route:

```txt
/master/profile
```

Features:

- Master account details
- Change password
- Logout

---

# Admin / Owner Panel Pages

## 1. Admin Dashboard

Route:

```txt
/admin/dashboard
```

Features:

- Today logs
- Total logs
- Pending logs
- Completed logs
- Needs correction logs
- Total executions
- Total equipment
- AI processed logs
- Downtime hours
- Recent logs
- Recent activity

## 2. Create Log

Route:

```txt
/admin/create-log
```

Features:

- Admin can also create manual/voice logs
- Select module
- Voice recording
- Transcript
- AI extraction
- Manual review
- Media upload
- Submit log

## 3. Logs List

Route:

```txt
/admin/logs
```

Features:

- Combined logs page
- View switcher: Grid/Table
- Search
- Filter by module
- Filter by status
- Filter by execution
- Filter by date
- Export logs

## 4. Logs Grid View

Route:

```txt
/admin/logs/grid
```

Features:

- Explore style log cards
- Before/after image preview
- Module badge
- Status badge
- Severity badge
- Quick view

## 5. Logs Table View

Route:

```txt
/admin/logs/table
```

Features:

- Business table view
- Log ID
- Module
- Title
- Equipment
- Location
- Created by
- Severity
- Status
- Date
- Actions

## 6. Log Detail

Route:

```txt
/admin/logs/[logId]
```

Features:

- Log summary
- Full transcript
- AI structured data
- Editable details
- Before/after images
- Attachments
- Status timeline
- Notes
- Created by details

## 7. Edit Log

Route:

```txt
/admin/logs/[logId]/edit
```

Features:

- Edit title
- Edit description
- Edit equipment
- Edit location
- Edit root cause
- Edit action taken
- Edit downtime
- Edit severity
- Update status
- Save changes

## 8. Equipment List

Route:

```txt
/admin/equipment
```

Features:

- Equipment table
- Search equipment
- Filter by status
- Filter by location
- Add equipment
- View equipment detail
- Edit equipment
- Delete equipment

## 9. Add Equipment

Route:

```txt
/admin/equipment/new
```

Fields:

- Equipment name
- Equipment ID
- Category
- Plant
- Unit
- Location
- Status
- Last service date
- Next service date
- Notes

## 10. Edit Equipment

Route:

```txt
/admin/equipment/[equipmentId]/edit
```

Features:

- Edit equipment fields
- Update status
- Save changes

## 11. Equipment Detail

Route:

```txt
/admin/equipment/[equipmentId]
```

Features:

- Equipment overview
- Equipment location
- Equipment status
- Service history
- Related logs
- Downtime history


## 12. Issue Categories List

Route:

```txt
/admin/issue-categories
```

Features:

- Issue category table
- Search issue categories
- Filter by applicable category
- Add issue category
- Edit issue category
- Delete issue category
- Import from master data template

## 13. Add/Edit Issue Category

Route:

```txt
/admin/issue-categories/new
/admin/issue-categories/[issueCategoryId]/edit
```

Fields:

- Issue Category ID
- Issue Category
- Issue Function
- Issue Sub Function
- Applicable Category
- Failure Mode
- Spare Part Reference
- Notes

## 14. Master Data Upload

Route:

```txt
/admin/master-data/upload
```

Features:

- Upload Excel master template
- Download sample template
- Select import type
- Validate data before import
- Show missing required fields
- Detect duplicate IDs
- Detect invalid roles
- Detect invalid section/location references

## 15. Master Data Validation Result

Route:

```txt
/admin/master-data/validation-result
```

Features:

- Row-wise validation result
- Error and warning table
- Valid rows count
- Invalid rows count
- Import only valid data
- Re-upload corrected file
- Download error report


## 16. Company Modules List

Route:

```txt
/admin/modules
```

Features:

- Company modules list
- Module colors
- Module icons
- Required fields
- Enable/disable module
- Edit module

## 13. Edit Company Module

Route:

```txt
/admin/modules/[moduleId]/edit
```

Features:

- Edit module name
- Edit module color
- Edit required fields
- Update module status
- Save changes

## 14. Executions List

Route:

```txt
/admin/executions
```

Features:

- Execution table
- Search execution
- Filter by status
- Add execution
- View execution
- Edit execution
- Reset password
- Activate/deactivate

## 15. Add Execution

Route:

```txt
/admin/executions/new
```

Fields:

- Full name
- Username
- Password
- Email
- Phone
- Assigned plant/location
- Status

## 16. Edit Execution

Route:

```txt
/admin/executions/[executionId]/edit
```

Features:

- Edit execution details
- Reset password
- Assign location
- Update status

## 17. Execution Detail

Route:

```txt
/admin/executions/[executionId]
```

Features:

- Execution profile
- Assigned location
- Total logs
- Recent logs
- Activity history
- Status

## 18. Locations List

Route:

```txt
/admin/locations
```

Features:

- Plant/unit/location table
- Add location
- Edit location
- Delete location
- Search location

## 19. Add Location

Route:

```txt
/admin/locations/new
```

Fields:

- Plant name
- Unit name
- Area name
- Location name
- Description
- Status

## 20. Edit Location

Route:

```txt
/admin/locations/[locationId]/edit
```

Features:

- Edit plant/unit/location details
- Update status

## 21. Reports Dashboard

Route:

```txt
/admin/reports
```

Features:

- Report overview
- Logs summary
- Equipment summary
- Execution activity
- Downtime summary
- Export options

## 22. Logs Report

Route:

```txt
/admin/reports/logs
```

Features:

- Logs by date
- Logs by module
- Logs by status
- Logs by severity
- Export

## 23. Equipment Report

Route:

```txt
/admin/reports/equipment
```

Features:

- Logs by equipment
- Downtime by equipment
- Repeated issues
- Service activity
- Export

## 24. Execution Report

Route:

```txt
/admin/reports/executions
```

Features:

- Logs by execution
- Execution activity
- Completed logs
- Pending logs
- Export

## 25. Downtime Report

Route:

```txt
/admin/reports/downtime
```

Features:

- Total downtime
- Downtime by equipment
- Downtime by location
- Downtime by date
- Export

## 26. Company Settings

Route:

```txt
/admin/settings
```

Features:

- Company name
- Company logo
- Address
- Contact details
- Default module colors
- Upload settings
- AI visibility settings
- Status settings

## 27. Admin Profile

Route:

```txt
/admin/profile
```

Features:

- Admin account details
- Change password
- Logout

---

# Execution Panel Pages

## 1. Execution Dashboard

Route:

```txt
/execution/dashboard
```

Features:

- Today logs
- My submitted logs
- Draft logs
- Completed logs
- Needs correction logs
- Recent logs

## 2. Create Voice Log

Route:

```txt
/execution/create-log
```

Features:

- Select module
- Record voice
- Stop/pause recording
- Transcript generation
- Generate AI structured log

## 3. AI Review

Route:

```txt
/execution/create-log/ai-review
```

Features:

- View transcript
- View AI extracted fields
- Edit generated fields
- Regenerate
- Continue to detail form

## 4. Detailed Log Form

Route:

```txt
/execution/create-log/details
```

Features:

- Module
- Title
- Description
- Equipment ID
- Plant
- Unit
- Location
- Root cause
- Action taken
- Downtime
- Severity
- Pending work
- Notes

## 5. Media Upload

Route:

```txt
/execution/create-log/media
```

Features:

- Before image
- After image
- Additional images
- Attachments
- Submit log

## 6. My Logs

Route:

```txt
/execution/my-logs
```

Features:

- My submitted logs
- Search
- Filter by status
- Filter by module
- Grid/table switcher

## 7. My Logs Grid View

Route:

```txt
/execution/my-logs/grid
```

Features:

- Visual log card view
- Module badge
- Status badge
- Date
- Quick detail

## 8. My Logs Table View

Route:

```txt
/execution/my-logs/table
```

Features:

- Log ID
- Module
- Title
- Status
- Date
- Actions

## 9. Log Detail

Route:

```txt
/execution/my-logs/[logId]
```

Features:

- View own log detail
- Transcript
- AI structured fields
- Uploaded images
- Status timeline
- Notes

## 10. Edit Draft Log

Route:

```txt
/execution/my-logs/[logId]/edit-draft
```

Features:

- Edit draft log
- Continue submission
- Upload images
- Submit log

## 11. Execution Profile

Route:

```txt
/execution/profile
```

Features:

- Name
- Username
- Role
- Assigned location
- Account status

## 12. Change Password

Route:

```txt
/execution/profile/change-password
```

Features:

- Old password
- New password
- Confirm password
- Save password

---

# API Route Structure

## Auth APIs

```txt
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Master APIs

```txt
GET    /api/master/companies
POST   /api/master/companies
GET    /api/master/companies/:id
PATCH  /api/master/companies/:id
DELETE /api/master/companies/:id
PATCH  /api/master/companies/:id/access

GET    /api/master/admins
POST   /api/master/admins
GET    /api/master/admins/:id
PATCH  /api/master/admins/:id
DELETE /api/master/admins/:id
PATCH  /api/master/admins/:id/reset-password

GET    /api/master/modules
POST   /api/master/modules
PATCH  /api/master/modules/:id
DELETE /api/master/modules/:id

GET    /api/master/usage
GET    /api/master/usage/:companyId
GET    /api/master/storage
GET    /api/master/billing
PATCH  /api/master/billing/:id
GET    /api/master/activity-logs
GET    /api/master/settings
PATCH  /api/master/settings
```

## Admin APIs

```txt
GET    /api/admin/logs
POST   /api/admin/logs
GET    /api/admin/logs/:id
PATCH  /api/admin/logs/:id
DELETE /api/admin/logs/:id
PATCH  /api/admin/logs/:id/status

GET    /api/admin/equipment
POST   /api/admin/equipment
GET    /api/admin/equipment/:id
PATCH  /api/admin/equipment/:id
DELETE /api/admin/equipment/:id

GET    /api/admin/issue-categories
POST   /api/admin/issue-categories
PATCH  /api/admin/issue-categories/:id
DELETE /api/admin/issue-categories/:id

POST   /api/admin/master-data/upload
POST   /api/admin/master-data/validate
POST   /api/admin/master-data/import
GET    /api/admin/master-data/template

GET    /api/admin/modules
PATCH  /api/admin/modules/:id
GET    /api/admin/modules/:id/schema
PATCH  /api/admin/modules/:id/schema

GET    /api/admin/executions
POST   /api/admin/executions
GET    /api/admin/executions/:id
PATCH  /api/admin/executions/:id
DELETE /api/admin/executions/:id
PATCH  /api/admin/executions/:id/reset-password

GET    /api/admin/locations
POST   /api/admin/locations
PATCH  /api/admin/locations/:id
DELETE /api/admin/locations/:id

GET    /api/admin/reports
GET    /api/admin/reports/logs
GET    /api/admin/reports/equipment
GET    /api/admin/reports/executions
GET    /api/admin/reports/downtime

GET    /api/admin/settings
PATCH  /api/admin/settings
```

## Execution APIs

```txt
GET   /api/execution/logs
POST  /api/execution/logs
GET   /api/execution/logs/:id
PATCH /api/execution/logs/:id
PATCH /api/execution/logs/:id/draft

GET   /api/execution/profile
PATCH /api/execution/profile
PATCH /api/execution/profile/change-password
```

## AI APIs

```txt
POST /api/ai/transcribe
POST /api/ai/extract-log
POST /api/ai/extract-log/:moduleType
```

## Upload APIs

```txt
POST /api/upload/images
POST /api/upload/attachments
```

---

# Shared Components Needed

## Layout Components

- DashboardLayout
- DashboardSidebar
- DashboardTopbar
- RoleBasedSidebar
- PageContainer
- PageHeader
- MobileNav
- RoleGuard

## Common Components

- StatCard
- DataTable
- SearchFilterBar
- StatusBadge
- ModuleBadge
- RoleBadge
- EmptyState
- LoadingState
- ConfirmDialog
- ActionMenu
- FileUpload
- ImagePreview
- PaginationBar
- FilterDrawer
- DateRangePicker

## Feature Components

### Voice Log

- VoiceRecorder
- TranscriptBox
- AIReviewPanel
- StructuredFieldsPreview
- VoiceLogStepper

### Logs

- LogGridCard
- LogTable
- LogDetailDrawer
- LogTimeline
- LogMediaGallery
- LogStatusUpdate
- LogFilters

### Companies

- CompanyCard
- CompanyTable
- CompanyForm
- CompanyAccessForm
- CompanyUsageSummary

### Master Data

- MasterDataUpload
- MasterDataValidationTable
- MasterDataTemplateDownload
- MasterDataImportSummary

### Users

- AdminOwnerForm
- PlannerForm
- ExecutionUserForm
- UserTable
- UserStatusBadge
- ResetPasswordDialog

### Equipment

- EquipmentForm
- EquipmentTable
- EquipmentDetailCard
- EquipmentLogHistory

### Reports

- ReportCard
- ReportChart
- ExportButton
- ReportFilterBar

### Usage

- AIUsageCard
- AIUsageTable
- StorageUsageCard
- BillingStatusBadge

---

# shadcn/ui Components Needed

Install first:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add alert-dialog
npx shadcn@latest add sonner
npx shadcn@latest add separator
npx shadcn@latest add avatar
npx shadcn@latest add scroll-area
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add form
npx shadcn@latest add progress
```

Optional later:

```bash
npx shadcn@latest add command
npx shadcn@latest add drawer
npx shadcn@latest add pagination
npx shadcn@latest add chart
```

---

# Development Priority

## Phase 1: Base Setup

- Project setup
- shadcn/ui setup
- Theme setup
- Folder structure
- Auth layout
- Dashboard layout
- Sidebar/topbar

## Phase 2: Role & Auth

- Login
- Logout
- Current user
- Role-based redirect
- Protected routes
- Role guard
- Permissions config

## Phase 3: Master Panel

- Dashboard
- Companies
- Add/edit company
- Company detail
- Company access
- Admin/Owner management
- Modules
- Usage

## Phase 4: Admin Panel + Master Data

- Dashboard
- Logs
- Equipment
- Issue Categories
- Master Data Upload
- Excel Validation
- Modules
- Module Field Schema
- Planners
- Execution Users
- Locations
- Reports
- Settings

## Phase 5: Equipment Log Trial

- Equipment Log voice recorder
- Speech-to-text
- Module-wise AI extraction for Equipment Log
- AI review
- Dynamic form
- Media upload
- Submit log
- Logs grid/table/detail

## Phase 6: Planner Panel

- Planner dashboard
- Assigned logs
- Submitted logs
- Planning remarks
- Status update

## Phase 7: Execution Panel

- Dashboard
- Create voice log
- AI review
- Detail form
- Media upload
- My logs
- Profile

## Phase 6: AI + Upload

- Voice recorder
- Speech-to-text
- AI structured extraction
- Image upload
- Attachment upload

## Phase 7: Polish

- Loading states
- Empty states
- Error states
- Toast notifications
- Responsive testing
- Export buttons
- Final QA

---

# Final Note

The earlier code structure was only a starting structure. This version includes the complete route-level pages needed for Master, Admin/Owner, Planner, and Execution panels.

This should be used as the main planning file before starting development.
