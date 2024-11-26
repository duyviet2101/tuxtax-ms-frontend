export default function getFlag({lang}) {
  switch (lang) {
    case 'vi':
      return '🇻🇳';
    case 'en':
      return '🇺🇸';
    case 'th':
      return '🇹🇭';
    default:
      return '🌐';
  }
}