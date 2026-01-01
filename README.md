# Dshbloks

A minimalistic dashboard application with accessible SolidUI components, powered by [`solid-start`](https://start.solidjs.com). Create personalized widgets and organize your information in a customizable dashboard.

## Tech Stack

- **Framework:** [SolidStart](https://start.solidjs.com/)
- **Database & ORM:** [Prisma](https://www.prisma.io/) with PostgreSQL
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Drag & Drop:** [@thisbeyond/solid-dnd](https://github.com/thisbeyond/solid-dnd)
- **UI Components & Styling:** [SolidUI](https://www.solid-ui.com/) with [Kobalte](https://kobalte.dev/) & [Tailwind CSS](https://tailwindcss.com/)
- **Typography:** [Geist Variable](https://vercel.com/font)

## Features

- ✅ Dark/Light (system)
- ✅ Accessible UI components
- ✅ Drag-and-drop widget system
- ✅ Guest mode (no authentication required)
- ✅ Persistent dashboard configurations
- ✅ Authentication with email verification

## Check out now

[Dshbloks](https://dshbloks.popjosef.se/) live at https://dshbloks.popjosef.se/

**⚠️ Production deployment issue:** The deployed version currently has a bug preventing authenticated users from creating, updating, or deleting widgets. This functionality works correctly when running locally (`npm run dev`) or with Netlify Dev (`netlify dev`), but fails in the Netlify production environment. Guest mode continues to work in all environments.

This bug seems to be about the way serverless functions handle streams. I was hoping to fix the bug through the architectural refactoring where I separated all Server Actions into isolated modules (/src/lib/actions), but sadly not. Although this ensured that the stream is not prematurely consumed by middleware or adapters, which was a critical lesson for scalable development in a serverless environment.

## Project evolution & scope

The final scope of Dshbloks was adjusted to ensure a high-quality "Vertical Slice" and stable core functionality within the timeframe.

### Key challenges that influenced the scope included:

- Initial Design: Extensive prototyping in Figma to refine the user experience.

- Technical Complexity: Implementing a robust drag-and-drop system and integrating secure email-verified authentication.

- Critical Debugging: Significant focus was redirected to diagnosing the "Response body disturbed" issue affecting authenticated users in production.

### Resulting adjustments:

- Single Dashboard: Instead of multiple dashboards, the UI was streamlined to one primary, high-performance dashboard to ensure stability.

- Simplified Layout: The planned progressive grid was replaced by a stable 3x2 system to prioritize accessibility and eliminate layout shifts (CLS).

## Getting Started

### Prerequisites

- Node.js >= 22
- PostgreSQL database (or access to a hosted PostgreSQL instance)
- Resend API key (in order to utilize email verification through sign-up)

### Installation

1. **Clone the repository**

```bash
   git clone <repository-url>
   cd dshbloks
```

2. **Install dependencies**

```bash
   npm install
```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

   # Better Auth
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=base-url-of-your-app

   # Comma separated list of truster origins
   AUTH_TRUSTED_ORIGINS=http://localhost:3000,https://your-production-url.com

   # Email (Resend)
   RESEND_API_KEY=your-resend-api-key
```

**Note:** Replace the placeholder values with your actual credentials:

- `DATABASE_URL`: Your PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Generate a random secret (use `openssl rand -base64 32`) or visit [Better Auth](https://www.better-auth.com/) under Installation and generate a secret.
- `BETTER_AUTH_URL`: Base URL of your app
- `AUTH_TRUSTED_ORIGINS`: Comma-separated list of allowed origins
- `RESEND_API_KEY`: Your Resend API key for sending emails

4. **Set up the database**

   Generate Prisma client and run migrations:

```bash
   npx prisma generate
   npx prisma migrate deploy
```

Optional - Seed the database with test data:

```bash
   npx prisma db seed
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Testing with Netlify Dev

To test in an environment similar to production:

```bash
netlify dev
```

The application will be available at [http://localhost:8888](http://localhost:8888)

### Build for Production

```bash
npm run build
npm start
```

## Key Features Explained

### Widget System

- Drag and drop widget from the sidebar to dashboard slots
- Configure widget with custom settings
- Save configurations to database (authenticated users)
- Session storage for guest users

### Authentication

- Email/password registration with verification
- Session management with Better Auth
- Guest mode for trying the app without account

### State Management

- Custom SolidJS stores for dashboard and widget state
- Snapshot system for undo functionality
- Separation between saved and unsaved widget states

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is running and accessible
- Check firewall settings if using a remote database

### Email Verification Not Working

- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for sending limits
- Ensure sender email is verified in Resend

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Regenerate Prisma client: `npx prisma generate`

## Checklista med betygskriterier

<details>

<summary>Checklista med betygskriterier</summary>

### Godkänt (G)

#### Planering och resarch

- [x] Målgruppsanalys
- [x] Projekthanteringsverktyg (till exempel Trello, Linear eller Github projects)

#### Design och prototyping

- [x] Wireframes i Figma
- [x] Prototyp i Figma enligt UX/UI-principer
- [x] Responsiv design för minst två skärmstorlekar
- [x] Följer WCAG 2.1-standarder

#### Applikationsutveckling

- [x] Utveckla med modernt JavaScript-ramverk
- [x] Använda databas för lagring och hämtning av data
- [x] Implementera state-hantering
- [x] Dynamiska komponenter med reaktivitet och interaktivitet
- [x] Följa WCAG 2.1-standarder
- [x] Semantisk HTML
- [x] Responsiv för tablet och dator/laptop
- [x] README med innehåll enligt projektbeskrivningen

#### Versionshantering

- [x] Arbeta med Git och repo på Github

#### Deploy

- [x] Projektet hostat och publikt tillgängligt

#### Slutrapport (2-3 sidor)

- [x] Abstract på engelska
- [x] Tech-stack och motivering
- [x] Dokumentation av arbetsprocess, planering och research

#### Helhetsupplevelse

- [ ] Fri från tekniska fel
- [x] Konsekvent design
- [ ] Obruten navigation genom hela applikationen

### Väl godkänt (VG)

#### Allt för Godkänt (G)

#### Design och prototyping

- [x] Interaktiv prototyp i Figma
- [ ] Prototypen mycket lik färdig produkt
- [x] Följer WCAG 2.1 nivå A och AA utan undantag

#### Applikationsutveckling

- [x] Global state management-lösning (till exempel SolidJS Store/Signal, Redux eller Pinia)
- [x] Testad i WebAIM WAVE utan fel eller varningar
- [x] Optimerad kod (återanvända komponenter, koddelning)
- [x] CRUD-operationer implementerade (Fungerar fullt ut lokalt och i emulerad miljö, men bugg i produktionsmiljö).
- [x] Säker autentisering (till exempel OAuth/JWT/Firebase Auth/BetterAuth)
- [ ] Fullt responsiv för alla skärmstorlekar
- [x] Utförlig README med tekniska val och implementationsdetaljer

#### Versionshantering

- [x] Arbeta med feature branches
- [x] Pull requests innan merge
- [x] Tydliga och informativa commit-meddelanden

#### Deploy

- [x] Automatiserad CI/CD-pipeline (t.ex. GitHub Actions + Netlify)

#### Slutrapport (3-6 sidor)

- [x] Djupgående analys av arbetsprocess
- [x] Reflektera över utmaningar och lösningar
- [x] Detaljerad motivering av verktyg och tekniker
- [x] Förklara UX/UI-beslut och tillgänglighetslösningar

#### Helhetsupplevelse

- [x] Professionell användarupplevelse
- [x] Minimala laddningstider
- [x] Tydlig återkoppling vid interaktioner
- [x] Testad på flera enheter och webbläsare
</details>

## Contributing

This is an exam project and is not currently accepting contributions.

## License

This project was created as part of a school assignment.

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
