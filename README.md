# Roamstead V2 - Modern Mountain Hospitality

A clean, scalable, theme-driven Next.js marketing site for Roamstead using TypeScript and Tailwind CSS.

## Architecture Overview

### Design Philosophy
- **Single source of truth**: One set of reusable components
- **Token-driven theming**: No hardcoded colors, spacing, or typography
- **Semantic design system**: CSS variables for easy theme switching
- **Scalable structure**: Easy to add new properties, themes, and pages

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Theming**: CSS variables with `data-theme` attribute

## Project Structure

```
roamstead-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with Navigation/Footer
│   │   ├── page.tsx             # Home page composition
│   │   └── globals.css          # Global styles and token imports
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx   # Site navigation with mobile menu
│   │   │   ├── Footer.tsx       # Site footer with links
│   │   │   └── Container.tsx    # Container and Section wrappers
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Primary/secondary button variants
│   │   │   ├── Hero.tsx         # Hero with background image
│   │   │   ├── PropertyCard.tsx # Secondary property cards
│   │   │   ├── PrimaryProperty.tsx # Featured property showcase
│   │   │   └── ValueCard.tsx    # Three-column value cards
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── ValueStatement.tsx
│   │       ├── ValueCards.tsx
│   │       ├── FeaturedHomes.tsx
│   │       └── CommunityCTA.tsx
│   └── styles/
│       └── tokens.css            # Design tokens (colors, typography, spacing)
├── public/
│   └── images/                   # Property and hero images
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Design System

### Typography
- **Headings**: Bricolage Grotesque (400, 500)
- **Body**: Funnel Sans (400, 500)
- **Scales**: Display → H1 → H2 → H3 → H4 → XL → LG → MD → SM → XS
- **Responsive**: Scales down proportionally on tablet/mobile

### Spacing (8px grid)
- `space-1` through `space-10` (8px → 80px)
- Sections use `space-8` (64px) for vertical padding
- Internal gaps use `space-2` or `space-3`

### Radius
- `radius-1`: 4px (small elements)
- `radius-2`: 8px (buttons)
- `radius-3`: 12px (cards)
- `radius-4`: 16px (large containers)

### Color Tokens

#### Base Theme (Neutral)
```css
Background: canvas, subtle, surface, surface-hover, second-surface
Border: subtle, default, strong
Text: primary, secondary, muted, disabled
Dark Text: dark-primary, dark-secondary, dark-muted, dark-disabled
Brand: subtle, default, hover, active, text
```

#### Winter Theme Override
```css
Brand: Winter blue palette (#3d5a75, etc.)
Second Surface: Winter dark blue (#1b3d54)
```

### Theme Switching
Themes are applied via `data-theme` attribute on `<html>`:
```tsx
<html data-theme="winter">  // or "base"
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd roamstead-v2
npm install
```

### 2. Add Images
Place your images in `/public/images/`:
- `hero-mountain.jpg` - Hero background
- `community-first.jpg` - Value card 1
- `four-season.jpg` - Value card 2
- `local-nature.jpg` - Value card 3
- `senator-main.jpg` - Primary property main image
- `senator-gallery-1.jpg`, `senator-gallery-2.jpg`, `senator-gallery-3.jpg`
- `hugge-house.jpg`, `granary.jpg`, `daystar.jpg`

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended for New Project)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd roamstead-v2
vercel
```

4. **Follow prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account/team
   - Link to existing project? `N`
   - Project name? `roamstead-v2`
   - Directory? `./`
   - Override settings? `N`

5. **Deploy to Production**
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Click "Deploy"

### Environment Variables
No environment variables required for initial deployment.

### Domain Configuration

**After v2 is stable and tested:**

1. In Vercel dashboard → Project Settings → Domains
2. Add your production domain (e.g., `roamstead.com`)
3. Update DNS records as instructed
4. Keep old deployment as rollback option

**DO NOT switch domain until:**
- ✅ All pages tested
- ✅ Images loading correctly
- ✅ Mobile responsive verified
- ✅ Theme switching working
- ✅ Navigation and links functional

## Adding New Content

### Add a New Property
Create property page at `src/app/properties/[slug]/page.tsx`:
```tsx
import { PropertyDetail } from '@/components/sections/PropertyDetail'

export default function PropertyPage() {
  return <PropertyDetail {...propertyData} />
}
```

### Add a New Theme
1. Add theme colors in `src/styles/tokens.css`:
```css
[data-theme="summer"] {
  --color-brand-default: #your-color;
  --color-bg-second-surface: #your-color;
}
```

2. Update `data-theme` in `src/app/layout.tsx`:
```tsx
<html lang="en" data-theme="summer">
```

### Customize Typography
Edit values in `src/styles/tokens.css`:
```css
:root {
  --text-h1: 64px;
  --text-h1-lh: 72px;
}
```

## Component Usage Examples

### Button
```tsx
<Button variant="primary" href="/book">
  Book Now
</Button>

<Button variant="secondary" onClick={handleClick}>
  Learn More
</Button>
```

### PropertyCard
```tsx
<PropertyCard
  image="/images/property.jpg"
  location="Heber City, UT"
  name="Property Name"
  sleeps={8}
  bedrooms={3}
  baths={2}
  href="/properties/property-name"
/>
```

### Hero
```tsx
<Hero
  backgroundImage="/images/hero.jpg"
  headline="Your Headline"
  description="Your description text"
  ctaText="Call to Action"
  ctaHref="/destination"
/>
```

## Best Practices

### ✅ DO
- Use semantic tokens (`bg-brand-default`) instead of raw colors
- Use spacing tokens (`space-4`) for consistent spacing
- Use typography classes (`text-h2`) for proper scaling
- Keep components generic and reusable
- Test theme switching before deployment

### ❌ DON'T
- Hardcode hex colors in components
- Use arbitrary values like `p-[23px]`
- Duplicate layouts across themes
- Change layout/spacing per theme (only colors/images)

## Troubleshooting

### Images not loading
- Verify images exist in `/public/images/`
- Check file names match exactly (case-sensitive)
- Ensure proper file extensions (.jpg, .png, etc.)

### Styles not applying
- Run `npm run dev` to restart dev server
- Check for typos in Tailwind classes
- Verify token names match `tokens.css`

### Build errors
```bash
npm run build
```
Fix any TypeScript errors before deploying

## Future Enhancements

- [ ] Add property detail pages
- [ ] Implement booking system integration
- [ ] Add seasonal theme switcher UI
- [ ] Create admin panel for content management
- [ ] Add more property types (Lowell, Powder Room)
- [ ] Implement image optimization
- [ ] Add animations and transitions
- [ ] SEO optimization

## Support

For questions or issues, contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready
