const fs = require('fs');

const tokens = [];
let idCounter = 1;

function generateId(tier, type) {
  return `t-${tier}-${type}-${idCounter++}`;
}

const date = new Date().toISOString();

// Core Tokens
const coreRaw = [
  // Common
  { name: 'color.palette.coomon.white', value: '#FFFFFF', group: 'Common' },
  { name: 'color.palette.coomon.black', value: '#0B0B0B', group: 'Common' },
  // Red
  { name: 'color.palette.red.100', value: '#FFF4F2', group: 'Red' },
  { name: 'color.palette.red.200', value: '#FFD3D6', group: 'Red' },
  { name: 'color.palette.red.300', value: '#F2ABB0', group: 'Red' },
  { name: 'color.palette.red.400', value: '#E86C75', group: 'Red' },
  { name: 'color.palette.red.450', value: '#F23845', group: 'Red' },
  { name: 'color.palette.red.500-mainMain', value: '#DE2E3A', group: 'Red' },
  { name: 'color.palette.red.600', value: '#C4222D', group: 'Red' },
  { name: 'color.palette.red.700', value: '#A11E26', group: 'Red' },
  { name: 'color.palette.red.800', value: '#6F171D', group: 'Red' },
  { name: 'color.palette.red.900', value: '#541B1D', group: 'Red' },
  { name: 'color.palette.red.990', value: '#430E12', group: 'Red' },
  // GreenYellow
  { name: 'color.palette.greenYellow.50', value: '#F7FBDC', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.100', value: '#F3FFAC', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.200', value: '#EEFF82', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.300', value: '#EBFF6D', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.400', value: '#E8FF59', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.500-mainMain', value: '#E2FF2F', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.600', value: '#B5CC26', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.700', value: '#899731', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.800', value: '#718018', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.900', value: '#69751F', group: 'GreenYellow' },
  { name: 'color.palette.greenYellow.990', value: '#444D0E', group: 'GreenYellow' },
  // Neutral
  { name: 'color.palette.neutral.50', value: '#F5F5F5', group: 'Neutral' },
  { name: 'color.palette.neutral.100', value: '#E8E8E8', group: 'Neutral' },
  { name: 'color.palette.neutral.200', value: '#D1D1D1', group: 'Neutral' },
  { name: 'color.palette.neutral.300', value: '#B0B0B0', group: 'Neutral' },
  { name: 'color.palette.neutral.400', value: '#8B8B8B', group: 'Neutral' },
  { name: 'color.palette.neutral.500', value: '#6B6B6B', group: 'Neutral' },
  { name: 'color.palette.neutral.600', value: '#4A4A4A', group: 'Neutral' },
  { name: 'color.palette.neutral.700', value: '#3A3A3A', group: 'Neutral' },
  { name: 'color.palette.neutral.800', value: '#2B2B2B', group: 'Neutral' },
  { name: 'color.palette.neutral.900', value: '#1E1E1E', group: 'Neutral' },
  // Status / Normal
  { name: 'color.palette.status.normal.success-LT', value: '#16AD87', group: 'Status / Normal' },
  { name: 'color.palette.status.normal.success-DK', value: '#0DA982', group: 'Status / Normal' },
  { name: 'color.palette.status.normal.fail-LT', value: '#F64B51', group: 'Status / Normal' },
  { name: 'color.palette.status.normal.fail-DK', value: '#F26469', group: 'Status / Normal' },
  { name: 'color.palette.status.normal.information-LT', value: '#4589FF', group: 'Status / Normal' },
  { name: 'color.palette.status.normal.information-DK', value: '#5D99FF', group: 'Status / Normal' },
  // Status / PTOS
  { name: 'color.palette.status.ptos.accent-LT', value: '#3E22F5', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.accent-DK', value: '#543AFF', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.win-LT', value: '#FD1140', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.win-DK', value: '#FF2F59', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.lose-LT', value: '#2285EE', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.lose-DK', value: '#258AF6', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.ready-LT', value: '#1D9CE4', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.ready-DK', value: '#32ACF2', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.play-LT', value: '#FF1E3F', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.play-DK', value: '#FF3654', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.end-LT', value: '#9E9E9E', group: 'Status / PTOS' },
  { name: 'color.palette.status.ptos.end-DK', value: '#B6B6B6', group: 'Status / PTOS' },
  // Secondary / Class
  { name: 'color.palette.secondary.class.aClass-LT', value: '#FFAE00', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.aClass-DK', value: '#FFB800', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.bClass-LT', value: '#00B7EF', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.bClass-DK', value: '#0DC5FE', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.cClass-LT', value: '#00E576', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.cClass-DK', value: '#01FF84', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.master-LT', value: '#F92C03', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.master-DK', value: '#FF3007', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.none-LT', value: '#A6A6A6', group: 'Secondary / Class' },
  { name: 'color.palette.secondary.class.none-DK', value: '#A2A1A1', group: 'Secondary / Class' },
  // Secondary / Game
  { name: 'color.palette.secondary.game.rating-LT', value: '#FA5A5A', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.rating-DK', value: '#FF6262', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.01game-LT', value: '#3097F5', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.01game-DK', value: '#50A8F8', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.countup-LT', value: '#EA4B92', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.countup-DK', value: '#F6579E', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.cricket-LT', value: '#6AB235', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.cricket-DK', value: '#78CE38', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.funzone-LT', value: '#BF66FF', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.funzone-DK', value: '#CB82FF', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.award-LT', value: '#FED500', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.award-DK', value: '#FFDC25', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.practice-LT', value: '#1EBAA5', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.practice-DK', value: '#1EC6AF', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.calendar-LT', value: '#E41F1D', group: 'Secondary / Game' },
  { name: 'color.palette.secondary.game.calendar-DK', value: '#DE2E3A', group: 'Secondary / Game' },
  // Card
  { name: 'color.palette.card.greenYellow-LT', value: '#E2FF2F', group: 'Card' },
  { name: 'color.palette.card.greenYellow-DK', value: '#E3FF33', group: 'Card' },
  { name: 'color.palette.card.blue-LT', value: '#65F3FF', group: 'Card' },
  { name: 'color.palette.card.blue-DK', value: '#7FF5FF', group: 'Card' },
  { name: 'color.palette.card.pink-LT', value: '#FFA6FD', group: 'Card' },
  { name: 'color.palette.card.pink-DK', value: '#FF9CFD', group: 'Card' },
  { name: 'color.palette.card.orange-LT', value: '#FFCC00', group: 'Card' },
  { name: 'color.palette.card.orange-DK', value: '#FFD634', group: 'Card' },
  { name: 'color.palette.card.purple-LT', value: '#C4B8FF', group: 'Card' },
  { name: 'color.palette.card.purple-DK', value: '#BBAEFF', group: 'Card' },
  // Opacity
  { name: 'color.palette.opacity.black.8', value: 'rgba(0,0,0,0.08)', group: 'Opacity' },
  { name: 'color.palette.opacity.black.12', value: 'rgba(0,0,0,0.12)', group: 'Opacity' },
  { name: 'color.palette.opacity.black.20', value: 'rgba(0,0,0,0.20)', group: 'Opacity' },
  { name: 'color.palette.opacity.black.44', value: 'rgba(0,0,0,0.44)', group: 'Opacity' },
  { name: 'color.palette.opacity.black.72', value: 'rgba(0,0,0,0.72)', group: 'Opacity' },
  { name: 'color.palette.opacity.white.8', value: 'rgba(255,255,255,0.08)', group: 'Opacity' },
  { name: 'color.palette.opacity.white.12', value: 'rgba(255,255,255,0.12)', group: 'Opacity' },
  { name: 'color.palette.opacity.white.20', value: 'rgba(255,255,255,0.20)', group: 'Opacity' },
  { name: 'color.palette.opacity.white.44', value: 'rgba(255,255,255,0.44)', group: 'Opacity' },
  { name: 'color.palette.opacity.white.72', value: 'rgba(255,255,255,0.72)', group: 'Opacity' }
];

coreRaw.forEach(item => {
  tokens.push({
    id: generateId('core', 'color'),
    category: 'color',
    tier: 'core',
    name: item.name,
    value: item.value,
    description: `Palette / ${item.group}`,
    updated_at: date
  });
});

// Semantic Tokens
const semanticRaw = [
  // Primary
  { name: 'color.semantic.primary.subtle', light: 'Red/100', dark: 'Red/990', group: 'Primary' },
  { name: 'color.semantic.primary.normal', light: 'Red/500-main', dark: 'Red/500-main', group: 'Primary' },
  { name: 'color.semantic.primary.strong', light: 'Red/600', dark: 'Red/600', group: 'Primary' },
  { name: 'color.semantic.primary.heavy', light: 'Red/700', dark: 'Red/700', group: 'Primary' },
  // Label
  { name: 'color.semantic.label.normal', light: 'Coomon/Black', dark: 'Coomon/White', group: 'Label' },
  { name: 'color.semantic.label.strong', light: 'Neutral/900', dark: 'Neutral/100', group: 'Label' },
  { name: 'color.semantic.label.neutral', light: 'Neutral/700', dark: 'Neutral/200', group: 'Label' },
  { name: 'color.semantic.label.alternative', light: 'Neutral/500', dark: 'Neutral/400', group: 'Label' },
  { name: 'color.semantic.label.assistive', light: 'Neutral/300', dark: 'Neutral/500', group: 'Label' },
  { name: 'color.semantic.label.disable', light: 'Neutral/200', dark: 'Neutral/600', group: 'Label' },
  // Line
  { name: 'color.semantic.line.subtle', light: 'Neutral/100', dark: 'Neutral/700', group: 'Line' },
  { name: 'color.semantic.line.normal', light: 'Neutral/300', dark: 'Neutral/500', group: 'Line' },
  { name: 'color.semantic.line.neutral', light: 'Neutral/400', dark: 'Neutral/400', group: 'Line' },
  { name: 'color.semantic.line.alternative', light: 'Neutral/500', dark: 'Neutral/300', group: 'Line' },
  // Fill
  { name: 'color.semantic.fill.normal', light: 'Coomon/White', dark: 'Coomon/Black', group: 'Fill' },
  { name: 'color.semantic.fill.surface', light: 'Coomon/White', dark: 'Neutral/700', group: 'Fill' },
  { name: 'color.semantic.fill.gray', light: 'Neutral/50', dark: 'Neutral/800', group: 'Fill' },
  { name: 'color.semantic.fill.subtle', light: 'Neutral/50', dark: 'Neutral/900', group: 'Fill' },
  // Status / Normal
  { name: 'color.semantic.status.normal.success', light: 'success-LT', dark: 'success-DK', group: 'Status / Normal' },
  { name: 'color.semantic.status.normal.fail', light: 'fail-LT', dark: 'fail-DK', group: 'Status / Normal' },
  { name: 'color.semantic.status.normal.information', light: 'information-LT', dark: 'information-DK', group: 'Status / Normal' },
  // Status / PTOS / Tournament
  { name: 'color.semantic.status.ptos.tournament.accent', light: 'Accent-LT', dark: 'Accent-DK', group: 'Status / PTOS / Tournament' },
  { name: 'color.semantic.status.ptos.tournament.win', light: 'Win-LT', dark: 'Win-DK', group: 'Status / PTOS / Tournament' },
  { name: 'color.semantic.status.ptos.tournament.lose', light: 'Lose-LT', dark: 'Lose-DK', group: 'Status / PTOS / Tournament' },
  // Status / PTOS / Match
  { name: 'color.semantic.status.ptos.match.ready', light: 'Ready-LT', dark: 'Ready-DK', group: 'Status / PTOS / Match' },
  { name: 'color.semantic.status.ptos.match.play', light: 'Play-LT', dark: 'Play-DK', group: 'Status / PTOS / Match' },
  { name: 'color.semantic.status.ptos.match.end', light: 'End-LT', dark: 'End-DK', group: 'Status / PTOS / Match' }
];

semanticRaw.forEach(item => {
  tokens.push({
    id: generateId('semantic', 'color'),
    category: 'color',
    tier: 'semantic',
    name: item.name,
    value: {
      light: item.light.trim(),
      dark: item.dark.trim()
    },
    description: `Semantic / ${item.group}`,
    updated_at: date
  });
});

fs.writeFileSync('./src/data/tokens.json', JSON.stringify(tokens, null, 2));
console.log('tokens.json generated successfully.');
