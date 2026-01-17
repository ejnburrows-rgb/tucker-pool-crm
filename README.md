# Tucker Pool Service CRM

A bilingual (English/Spanish) full-stack CRM for pool service businesses built with Next.js 14, Supabase, and shadcn/ui.

## Features

- **Bilingual UI**: Full English/Spanish support with language toggle
- **Client Management**: Track clients, service days, pool types, and contact info
- **Payment Tracking**: Monthly invoices with status tracking (paid, pending, overdue)
- **Work Orders**: Additional work requests with cost tracking
- **Schedule View**: Weekly calendar showing appointments
- **SMS Reminders**: Automated payment reminders via Twilio
- **Email Notifications**: Email support via Resend
- **Overdue Dashboard**: Quick view of overdue payments and work orders

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl
- **SMS**: Twilio
- **Email**: Resend

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd tucker-pool-crm
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/0001_init.sql`
3. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
   ```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for cron jobs)
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `RESEND_API_KEY` - Resend API key
- `CRON_SECRET` - Random secret for cron job authentication

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── [locale]/           # Locale-aware routes
│   │   ├── (auth)/         # Auth pages (login)
│   │   └── (dashboard)/    # Dashboard pages
│   │       ├── clients/    # Client management
│   │       ├── payments/   # Payment tracking
│   │       ├── work/       # Work orders
│   │       ├── schedule/   # Weekly schedule
│   │       └── overdue/    # Overdue summary
│   └── api/                # API routes
│       ├── clients/
│       ├── payments/
│       ├── work/
│       ├── schedule/
│       ├── sms/
│       └── cron/           # Cron job endpoints
├── components/
│   └── layout/             # Header, Sidebar, etc.
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── twilio/             # Twilio client
│   ├── resend/             # Resend client
│   └── validations/        # Zod schemas
├── messages/               # i18n translations
│   ├── en.json
│   └── es.json
└── types/                  # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

The `vercel.json` includes cron job configuration for daily payment reminders at 9 AM.

## TypeScript Notes

Some TypeScript errors related to Supabase types will resolve after running:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

Then update `lib/supabase/client.ts` and `lib/supabase/server.ts` to use the generated types.

## License

MIT
