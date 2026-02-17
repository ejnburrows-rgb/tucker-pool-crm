import { performance } from 'perf_hooks';

interface ExtractedClient {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  monthly_rate: number;
  service_day: string;
  selected: boolean;
}

// Original Implementation (Unoptimized)
function parseClientDataFromOcrOriginal(text: string): Partial<ExtractedClient> {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const data: Partial<ExtractedClient> = {};

  // Name: First line that looks like a name (capitalized words, no digits, at least 2 words)
  for (const line of lines) {
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line) && !/\d/.test(line)) {
      data.name = line;
      break;
    }
  }

  // Address: Look for patterns starting with digits
  for (const line of lines) {
    if (/^\d+\s+[A-Za-z]+/.test(line)) {
      data.address = line;
      // Heuristic: Check if line or next lines contain city
      if (line.toLowerCase().includes('miami')) {
        data.city = 'Miami';
      }
      break;
    }
  }

  // Phone: Look for phone patterns
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  return data;
}

// Optimized Implementation (Proposed)
const NAME_REGEX = /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/;
const DIGIT_REGEX = /\d/;
const ADDRESS_REGEX = /^\d+\s+[A-Za-z]+/;
const PHONE_REGEX = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function parseClientDataFromOcrOptimized(text: string): Partial<ExtractedClient> {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const data: Partial<ExtractedClient> = {};

  // Name: First line that looks like a name (capitalized words, no digits, at least 2 words)
  for (const line of lines) {
    if (NAME_REGEX.test(line) && !DIGIT_REGEX.test(line)) {
      data.name = line;
      break;
    }
  }

  // Address: Look for patterns starting with digits
  for (const line of lines) {
    if (ADDRESS_REGEX.test(line)) {
      data.address = line;
      // Heuristic: Check if line or next lines contain city
      if (line.toLowerCase().includes('miami')) {
        data.city = 'Miami';
      }
      break;
    }
  }

  // Phone: Look for phone patterns
  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  return data;
}

// Generate Sample Data
function generateSampleText(iterations: number): string[] {
    const samples: string[] = [];
    for (let i = 0; i < iterations; i++) {
        const lines = [
            "INVOICE #12345",
            "DATE: 2023-10-27",
            "BILL TO:",
            `John Doe ${i}`, // Usually fails name regex due to digits? No wait, regex is ^[A-Z][a-z]+(\s[A-Z][a-z]+)+$ so "John Doe 1" fails. "John Doe" passes.
            "Jane Smith",      // Valid name
            "123 Main St Apt 4B", // Valid address
            "Miami, FL 33101",
            "Phone: (555) 123-4567", // Valid phone
            "Service Description",
            "Pool Cleaning - Weekly",
            "Total: $150.00",
            "Thank you for your business!"
        ];
        // Mix it up to force loops to run
        if (i % 2 === 0) {
           // Good case
           samples.push(lines.join('\n'));
        } else {
           // Bad case (force scan)
           const badLines = [
               "Junk line 1",
               "junk line 2",
               "123456",
               "nomatch",
               "Still searching...",
               "Finally A Name", // valid name
               "999 Ocean Drive", // valid address
               "555-999-8888" // valid phone
           ];
           samples.push(badLines.join('\n'));
        }
    }
    return samples;
}

async function runBenchmark() {
    const iterations = 10000;
    const samples = generateSampleText(iterations);

    console.log(`Starting benchmark with ${iterations} samples...`);

    // Warmup
    for (let i = 0; i < 100; i++) {
        parseClientDataFromOcrOriginal(samples[i % samples.length]);
        parseClientDataFromOcrOptimized(samples[i % samples.length]);
    }

    // Measure Original
    const startOriginal = performance.now();
    for (const sample of samples) {
        parseClientDataFromOcrOriginal(sample);
    }
    const endOriginal = performance.now();
    const timeOriginal = endOriginal - startOriginal;

    console.log(`Original Time: ${timeOriginal.toFixed(2)}ms`);

    // Measure Optimized
    const startOptimized = performance.now();
    for (const sample of samples) {
        parseClientDataFromOcrOptimized(sample);
    }
    const endOptimized = performance.now();
    const timeOptimized = endOptimized - startOptimized;

    console.log(`Optimized Time: ${timeOptimized.toFixed(2)}ms`);

    const improvement = timeOriginal / timeOptimized;
    console.log(`Improvement: ${improvement.toFixed(2)}x faster`);
}

runBenchmark();
