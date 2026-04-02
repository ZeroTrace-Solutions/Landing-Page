export const DIGIT_MATRIX = {
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['01110', '10001', '00001', '00110', '00001', '10001', '01110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100']
};

export const buildDigitTargets = (timeObject) => {
  const targets = [];
  const digitZones = ['H', 'M', 'S'];
  const baseX = 0.06;
  const totalWidth = 0.88;
  const zoneWidth = totalWidth / 3;

  for (let zoneIndex = 0; zoneIndex < 3; zoneIndex += 1) {
    const digits = timeObject[digitZones[zoneIndex]].split('');
    const zoneLeft = baseX + zoneIndex * zoneWidth;

    digits.forEach((digit, digitPosition) => {
      const matrix = DIGIT_MATRIX[parseInt(digit, 10)] || DIGIT_MATRIX[0];
      const digitOffsetX = zoneLeft + digitPosition * 0.28;

      matrix.forEach((line, rowIndex) => {
        line.split('').forEach((char, colIndex) => {
          if (char === '1') {
            targets.push({
              x: Math.min(0.97, Math.max(0.03, digitOffsetX + colIndex * 0.045 + (Math.random() - 0.5) * 0.006)),
              y: Math.min(0.92, Math.max(0.05, 0.22 + rowIndex * 0.055 + (Math.random() - 0.5) * 0.006))
            });
          }
        });
      });
    });
  }

  return targets;
};
