# Jhon Florez Peluqueros — Platform

Premium luxury hair salon website built with Next.js 15, Supabase, Framer Motion and Three.js.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v3 + custom design system
- **Animations**: Framer Motion + Three.js (React Three Fiber)
- **Database + Auth**: Supabase
- **Emails**: EmailJS
- **Calendar**: Google Calendar API
- **i18n**: next-intl (ES / EN)
- **Deployment**: Vercel

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/eMiLiTiS/jhonflorezpeluqueros
cd jhon-florez-peluqueros
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/schema.sql`
3. Go to **Authentication → Users → Add user** to create the admin user
4. Copy your `Project URL` and `anon key` to `.env.local`

### 4. EmailJS setup

1. Create an account at [emailjs.com](https://www.emailjs.com)
2. Create an **Email Service** (Gmail, SMTP, etc.)
3. Create 4 **Email Templates**:
   - `template_admin_notification` — new booking notification to admin
   - `template_booking_received` — booking received confirmation to customer
   - `template_booking_confirmed` — booking confirmed email to customer
   - `template_booking_cancelled` — booking cancelled email to customer
4. Copy your **Service ID**, **Public Key**, and template IDs to `.env.local`

**Template variables available:**
- `{{customer_name}}`, `{{customer_email}}`, `{{customer_phone}}`
- `{{service_name}}`, `{{preferred_date}}`, `{{preferred_time}}`
- `{{notes}}`, `{{booking_id}}`, `{{admin_url}}`

### 5. Google Calendar setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project and enable the **Google Calendar API**
3. Create OAuth 2.0 credentials (Desktop app type)
4. Use the OAuth Playground to get a refresh token with `https://www.googleapis.com/auth/calendar` scope
5. Add the credentials to `.env.local`

### 6. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repository in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

The app will be available at your Vercel URL. Add a custom domain in Vercel settings if needed.

---

## Admin panel

- URL: `/admin/login` (or `/en/admin/login`)
- Login with the Supabase admin user credentials
- Dashboard: view, filter, confirm and cancel bookings

---

## Pages

| Path | Description |
|------|-------------|
| `/` or `/es` | Home page |
| `/en` | English home page |
| `/servicios` | Services catalogue |
| `/reservas` | Booking form |
| `/nosotros` | About page |
| `/contacto` | Contact page |
| `/privacidad` | Privacy policy |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Booking management panel |

---

## Business info

- **Business**: Jhon Florez Peluqueros
- **Phone**: +34 641 09 35 50
- **Email**: jhonarnulfa1402@gmail.com
- **Service area**: Province of Valencia, Spain
- **Hours**: Monday–Sunday · 09:00–21:00
- **Model**: Home service hairdresser

---

## Booking rules

- Minimum 24 hours in advance
- Maximum 60 days ahead
- Time slots every 30 minutes (09:00–21:00)
- Appointments require admin confirmation before being active
- No upfront payment
