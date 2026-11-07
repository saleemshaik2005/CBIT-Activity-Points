import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMagicBytes } from '@/app/api/upload/route';

describe('Magic Bytes Validation (Binary Sniffing)', () => {
  it('correctly identifies valid PDF file signatures (%PDF-)', () => {
    // 0x25 0x50 0x44 0x46 (%PDF-)
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const result = validateMagicBytes(pdfBuffer);
    assert.equal(result.isValid, true);
    assert.equal(result.detectedMime, 'application/pdf');
  });

  it('correctly identifies valid PNG file signatures', () => {
    // 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
    const result = validateMagicBytes(pngBuffer);
    assert.equal(result.isValid, true);
    assert.equal(result.detectedMime, 'image/png');
  });

  it('correctly identifies valid JPEG file signatures (SOI marker)', () => {
    // 0xFF 0xD8 0xFF 0xE0 ...
    const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const result = validateMagicBytes(jpegBuffer);
    assert.equal(result.isValid, true);
    assert.equal(result.detectedMime, 'image/jpeg');
  });

  it('correctly identifies valid WEBP file signatures (RIFF....WEBP)', () => {
    // 0x52 0x49 0x46 0x46 (RIFF) + 4 bytes length + 0x57 0x45 0x42 0x50 (WEBP)
    const webpBuffer = Buffer.from([
      0x52, 0x49, 0x46, 0x46,
      0x00, 0x00, 0x00, 0x20,
      0x57, 0x45, 0x42, 0x50,
      0x56, 0x50, 0x38, 0x20
    ]);
    const result = validateMagicBytes(webpBuffer);
    assert.equal(result.isValid, true);
    assert.equal(result.detectedMime, 'image/webp');
  });

  it('rejects executable / PE binaries disguised as images (MZ header)', () => {
    // 0x4D 0x5A (MZ header of Windows executable)
    const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
    const result = validateMagicBytes(exeBuffer);
    assert.equal(result.isValid, false);
    assert.equal(result.detectedMime, undefined);
  });

  it('rejects plaintext scripts or HTML files masquerading as images/PDFs', () => {
    const htmlBuffer = Buffer.from('<html><script>alert(1)</script></html>', 'utf-8');
    const result = validateMagicBytes(htmlBuffer);
    assert.equal(result.isValid, false);
  });

  it('rejects empty or truncated buffers (< 4 bytes)', () => {
    assert.equal(validateMagicBytes(Buffer.alloc(0)).isValid, false);
    assert.equal(validateMagicBytes(Buffer.from([0x25, 0x50])).isValid, false);
  });
});
