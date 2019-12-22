export const labelNameJp = nameEn => {
  switch (nameEn) {
    case 'kasuri':
      return '絣'
    case 'kiku':
      return '菊'
    case 'ume':
      return '梅'
    case 'hishi':
      return '菱'
    case 'sakura':
      return '桜'
    case 'karakusa':
      return '唐草'
    case 'chou':
      return '蝶'
    case 'matsu':
      return '松'
    case 'kamenokou':
      return '亀甲'
    case 'asanoha':
      return '麻の葉'
    default:
      return '不明'
  }
}

export const selectedTileNumbers = tileStates => {
  const numbersStr = tileStates
    .map((tile, i) => (tile ? i : ' '))
    .filter(number => number !== ' ')
    .join(' ')

  return numbersStr ? numbersStr : '-'
}

export const selectedTilesArray = saveTiles => {
  let convertArray = new Array(9).fill(false)
  if (saveTiles) {
    saveTiles
      .split(' ')
      .forEach(tileNumber => (convertArray[tileNumber] = true))
  }
  return convertArray
}
