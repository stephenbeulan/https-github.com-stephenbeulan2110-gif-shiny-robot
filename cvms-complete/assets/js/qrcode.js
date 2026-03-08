// Pure JavaScript QR Code Generator for CVMS
// No external libraries - custom implementation

class QRCode {
  constructor(text, options = {}) {
    this.text = text;
    this.options = {
      size: 256,
      margin: 4,
      errorCorrection: 'M', // L, M, Q, H
      ...options
    };

    this.modules = [];
    this.version = this.getVersion();
    this.errorCorrectionLevel = this.getErrorCorrectionLevel();
    this.maskPattern = 0;

    this.generate();
  }

  getVersion() {
    const length = this.text.length;
    if (length <= 25) return 1;
    if (length <= 47) return 2;
    if (length <= 77) return 3;
    if (length <= 114) return 4;
    if (length <= 154) return 5;
    return 6; // Default to version 6 for longer texts
  }

  getErrorCorrectionLevel() {
    const levels = { L: 1, M: 0, Q: 3, H: 2 };
    return levels[this.options.errorCorrection] || 0;
  }

  generate() {
    // Initialize modules array
    const size = 21 + (this.version - 1) * 4; // Basic size calculation
    this.modules = Array(size).fill().map(() => Array(size).fill(false));

    // Add finder patterns
    this.addFinderPattern(0, 0);
    this.addFinderPattern(size - 7, 0);
    this.addFinderPattern(0, size - 7);

    // Add alignment patterns (simplified)
    if (this.version > 1) {
      this.addAlignmentPattern(size - 9, size - 9);
    }

    // Add timing patterns
    this.addTimingPatterns();

    // Add format information (simplified)
    this.addFormatInformation();

    // Encode data
    const encodedData = this.encodeData(this.text);
    this.placeData(encodedData);

    // Apply mask
    this.applyMask();

    // Add version information if needed
    if (this.version >= 7) {
      this.addVersionInformation();
    }
  }

  addFinderPattern(x, y) {
    // Outer square
    for (let i = 0; i < 7; i++) {
      this.modules[y][x + i] = true;
      this.modules[y + 6][x + i] = true;
      this.modules[y + i][x] = true;
      this.modules[y + i][x + 6] = true;
    }

    // Inner square
    for (let i = 1; i < 6; i++) {
      this.modules[y + 1][x + i] = false;
      this.modules[y + 5][x + i] = false;
      this.modules[y + i][x + 1] = false;
      this.modules[y + i][x + 5] = false;
    }

    // Center dot
    for (let i = 2; i < 5; i++) {
      for (let j = 2; j < 5; j++) {
        this.modules[y + i][x + j] = true;
      }
    }
  }

  addAlignmentPattern(x, y) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        this.modules[y + i][x + j] = Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0);
      }
    }
  }

  addTimingPatterns() {
    const size = this.modules.length;
    for (let i = 8; i < size - 8; i++) {
      this.modules[6][i] = (i % 2 === 0);
      this.modules[i][6] = (i % 2 === 0);
    }
  }

  addFormatInformation() {
    // Simplified format information
    const formatInfo = this.getFormatInfo();
    const size = this.modules.length;

    // Top-left
    for (let i = 0; i < 8; i++) {
      if (i !== 6) { // Skip timing pattern
        this.modules[8][i] = formatInfo[i];
        this.modules[i][8] = formatInfo[i];
      }
    }

    // Bottom-left and top-right
    for (let i = 0; i < 7; i++) {
      this.modules[size - 1 - i][8] = formatInfo[i + 8];
      this.modules[8][size - 1 - i] = formatInfo[i + 8];
    }
  }

  getFormatInfo() {
    // Simplified - return a basic pattern
    return [1,0,1,0,1,0,0,1,0,0,1,0,0,1,0];
  }

  encodeData(text) {
    // Simple alphanumeric encoding
    const encoded = [];
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length) {
        const char1 = this.getAlphanumericValue(text[i]);
        const char2 = this.getAlphanumericValue(text[i + 1]);
        encoded.push(char1 * 45 + char2);
      } else {
        encoded.push(this.getAlphanumericValue(text[i]));
      }
    }
    return encoded;
  }

  getAlphanumericValue(char) {
    const alphanumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
    return alphanumeric.indexOf(char.toUpperCase());
  }

  placeData(data) {
    let bitIndex = 0;
    const size = this.modules.length;
    let direction = -1; // Start going up
    let row = size - 1;
    let col = size - 1;

    while (col > 0) {
      if (col === 6) col--; // Skip timing pattern

      while (row >= 0 && row < size) {
        for (let i = 0; i < 2; i++) {
          const currentCol = col - i;
          if (currentCol >= 0 && !this.isReserved(currentCol, row)) {
            if (bitIndex < data.length * 8) {
              const byteIndex = Math.floor(bitIndex / 8);
              const bitOffset = bitIndex % 8;
              const bit = (data[byteIndex] >> (7 - bitOffset)) & 1;
              this.modules[row][currentCol] = bit === 1;
              bitIndex++;
            }
          }
        }
        row += direction;
      }

      direction = -direction;
      row += direction;
      col -= 2;
    }
  }

  isReserved(x, y) {
    // Check if position is part of finder/alignment/timing patterns
    const size = this.modules.length;

    // Finder patterns
    if ((x < 9 && y < 9) || (x < 9 && y >= size - 9) || (x >= size - 9 && y < 9)) {
      return true;
    }

    // Timing patterns
    if (x === 6 || y === 6) {
      return true;
    }

    // Format information
    if ((x === 8 && y < 9) || (y === 8 && x < 9) ||
        (x === 8 && y >= size - 8) || (y === 8 && x >= size - 8)) {
      return true;
    }

    return false;
  }

  applyMask() {
    // Simple mask pattern (checkerboard)
    const size = this.modules.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!this.isReserved(x, y) && ((x + y) % 2 === 0)) {
          this.modules[y][x] = !this.modules[y][x];
        }
      }
    }
  }

  addVersionInformation() {
    // Simplified version information
    const versionInfo = this.getVersionInfo();
    const size = this.modules.length;

    for (let i = 0; i < 18; i++) {
      const x = Math.floor(i / 3);
      const y = i % 3;
      this.modules[size - 11 + y][x] = versionInfo[i];
      this.modules[x][size - 11 + y] = versionInfo[i];
    }
  }

  getVersionInfo() {
    // Simplified - return basic pattern
    return Array(18).fill(0);
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    const size = this.modules.length;
    const moduleSize = this.options.size / size;
    const margin = this.options.margin * moduleSize;

    canvas.width = this.options.size + margin * 2;
    canvas.height = this.options.size + margin * 2;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw modules
    ctx.fillStyle = '#000000';
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (this.modules[y][x]) {
          ctx.fillRect(
            margin + x * moduleSize,
            margin + y * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    return canvas;
  }

  toDataURL() {
    const canvas = document.createElement('canvas');
    this.render(canvas);
    return canvas.toDataURL();
  }

  toImage(size = this.options.size) {
    const img = new Image();
    img.src = this.toDataURL();
    img.width = size;
    img.height = size;
    return img;
  }
}

// Utility function to generate QR code
function generateQRCode(text, canvasId, options = {}) {
  const qr = new QRCode(text, options);
  const canvas = document.getElementById(canvasId);
  if (canvas) {
    qr.render(canvas);
  }
  return qr;
}

// Export for global use
window.QRCode = QRCode;
window.generateQRCode = generateQRCode;