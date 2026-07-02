# MiniHotel FE

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000`

### User Manual
A comprehensive user manual is available in the `manual` directory:
- [English Manual](./manual/manual-EN.html)
- [Czech Manual](./manual/manual-CZ.html)

### Developing & Translating
When adding new translations or components, run the internationalization linter to check for missing keys:
```bash
pnpm run lint:i18n
```
> **Note**: The build process and SSR logic now strictly throws errors for any missing localization keys. Run the linter constantly to avoid build and server errors.

### Building for Production

```bash
pnpm run build
pnpm start
```
