/** Brand theme generated from css/tokens.css — single source of truth stays tokens.css. */
export default {
  content: ['./src/**/*.{astro,html,js}'],
  corePlugins: { preflight: false, container: false },
  theme: {
    extend: {
      colors: {
        'cherry': '#C9322A',
        'cherry-dark': '#A82820',
        'cherry-light': '#FDECEA',
        'blueberry': '#264E7B',
        'blueberry-dark': '#1A3856',
        'blueberry-light': '#E8EFF7',
        'candy-pink': '#F7D2DF',
        'banana-split': '#F4E6AC',
        'banana-dark': '#C9B56A',
        'vanilla': '#FCF0E4',
        'melted': '#FAEEEE',
        'pistachio': '#BACEAF',
        'mint-chip': '#E3EFD3',
        'white': '#FFFFFF',
        'off-white': '#FDFAF7',
        'text': '#264E7B',
        'text-mid': '#456787',
        'text-light': '#4A6E91',
        'border': '#EDE0D8'
      },
      fontFamily: {
        script: ['FunkiDori', 'cursive'],
        display: ['Brandon Grotesque', 'Helvetica Neue', 'sans-serif'],
        body: ['GT America', 'Helvetica Neue', 'sans-serif']
      }
    }
  }
};
