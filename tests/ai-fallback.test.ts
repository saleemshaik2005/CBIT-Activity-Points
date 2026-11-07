import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fallbackSemanticDocumentAnalyzer } from '@/lib/gemini';

describe('Honest AI Fallback Engine', () => {
  it('never fabricates an authenticity score when AI vision is unavailable', () => {
    const result = fallbackSemanticDocumentAnalyzer(
      'base64sampledata',
      'image/png',
      'nptel_course.png',
      undefined,
      'SHAIK SALEEM'
    );

    // Assert NO fabricated 97% or 95% authenticity scores
    assert.equal(result.tamperAnalysis?.authenticityScore, undefined);
    assert.equal(result.confidenceScore, 0);
  });

  it('marks the document for manual mentor verification honestly', () => {
    const result = fallbackSemanticDocumentAnalyzer(
      'base64sampledata',
      'application/pdf',
      'workshop_certificate.pdf',
      undefined,
      'SHAIK SALEEM'
    );

    assert.equal(result.issuingOrganization, 'Pending Mentor Verification');
    assert.equal(result.tamperAnalysis?.statusLabel, 'Requires manual verification');
    assert.equal(result.suggestedPoints, 0);
    assert.match(result.summary, /routed honestly for direct mentor review/i);
    assert.ok(
      result.tamperAnalysis?.findings.some(f => f.includes('No synthetic authenticity score was generated')),
      'Should explicitly declare that no synthetic score was generated'
    );
  });

  it('cleanly derives human-readable title from the certificate filename', () => {
    const result = fallbackSemanticDocumentAnalyzer(
      'base64sampledata',
      'image/jpeg',
      'coursera-machine-learning-specialization.jpeg',
      undefined,
      'SHAIK SALEEM'
    );

    assert.equal(result.certificateTitle, 'coursera machine learning specialization');
    assert.equal(result.recipientName, 'SHAIK SALEEM');
  });
});
