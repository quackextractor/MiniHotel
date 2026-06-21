const fs = require('fs');
const path = require('path');

try {
  const messagesDir = path.resolve(__dirname, 'messages');
  if (fs.existsSync(messagesDir)) {
    const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));
    const locales = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(messagesDir, file), 'utf-8');
      const json = JSON.parse(content);
      if (json._meta) {
        locales.push({
          code: json._meta.code,
          name: json._meta.name,
          flag: json._meta.flag
        });
      } else {
        const code = file.replace('.json', '');
        locales.push({
          code,
          name: code.toUpperCase()
        });
      }
    }
    fs.writeFileSync(
      path.resolve(__dirname, 'i18n/locales.json'),
      JSON.stringify(locales, null, 2)
    );
    console.log('[MiniHotel] Generated locales.json successfully via script');
  }
} catch (e) {
  console.error('[MiniHotel] Failed to generate locales.json', e);
  process.exit(1);
}
