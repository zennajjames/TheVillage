# Internationalization (i18n) Setup

This application supports multiple languages: English, Spanish, Somali, and Hmong.

## Installation

First, install the required packages:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## How to Use Translations in Components

### 1. Import the hook

```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use the hook in your component

```typescript
const MyComponent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('landing.hero')}</h1>
      <p>{t('landing.description')}</p>
      <button>{t('common.login')}</button>
    </div>
  );
};
```

### 3. Translation Keys

All translation keys are organized in JSON files in `src/i18n/locales/`:

- `en.json` - English
- `es.json` - Spanish (Español)
- `so.json` - Somali (Soomaali)
- `hmn.json` - Hmong (Hmoob)

**Common translations:**
- `common.appName` - "The Village"
- `common.login` - "Log In"
- `common.signup` - "Sign Up"
- `common.loading` - "Loading..."

**Navigation:**
- `nav.home` - "Home"
- `nav.about` - "About"
- `nav.groups` - "Groups"
- `nav.messages` - "Messages"

**Landing page:**
- `landing.hero` - "Your School Community, Connected"
- `landing.description` - Full description
- `landing.joinSchool` - "Join Your School"

**About page:**
- `about.title` - "About The Village"
- `about.mission` - "Our Mission"
- And more...

## Example: Converting a Page to Use Translations

### Before:
```typescript
const Landing: React.FC = () => {
  return (
    <div>
      <h1>Your School Community, Connected</h1>
      <p>A hyperlocal platform for school PTAs...</p>
      <button>Sign Up</button>
    </div>
  );
};
```

### After:
```typescript
import { useTranslation } from 'react-i18next';

const Landing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('landing.hero')}</h1>
      <p>{t('landing.description')}</p>
      <button>{t('common.signup')}</button>
    </div>
  );
};
```

## Language Selector Component

The `LanguageSelector` component has been added to the Header. Users can click on it to change the language.

The selected language is automatically saved to localStorage and will persist across sessions.

## Adding New Translations

1. Add the English key and value to `locales/en.json`
2. Add the corresponding translations to:
   - `locales/es.json` (Spanish)
   - `locales/so.json` (Somali)
   - `locales/hmn.json` (Hmong)

Example:
```json
// en.json
{
  "groups": {
    "newKey": "New text in English"
  }
}

// es.json
{
  "groups": {
    "newKey": "Nuevo texto en español"
  }
}
```

## Getting Professional Translations

The current translations were auto-translated and should be reviewed by native speakers for accuracy, especially for:
- **Somali**: Community-specific terms and cultural context
- **Hmong**: Proper transliteration and cultural terminology

Consider having these reviewed by:
1. Community members who are native speakers
2. Professional translation services
3. School district translation departments

## Best Practices

1. **Use descriptive keys**: `landing.hero` is better than `text1`
2. **Group related translations**: All landing page text under `landing.*`
3. **Keep common text in `common`**: Buttons, actions, etc.
4. **Avoid hardcoded text**: Always use translation keys
5. **Test all languages**: Switch languages and verify layout doesn't break

## Current Status

✅ Translation files created for all 4 languages
✅ Language selector component added to Header
✅ i18n initialized in App.tsx
⏳ Pages not yet converted to use translations (to be done gradually)

## Next Steps

Pages to convert (in priority order):
1. Landing.tsx - Main entry point
2. About.tsx - Information page
3. Login.tsx / Signup.tsx - Authentication
4. Groups.tsx - Core feature
5. Profile.tsx - User settings
6. Other pages as needed
