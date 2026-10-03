/**
 * Pitch Doctor — Frontend Application Script
 * 
 * Responsibilities:
 * 1. Calculate live word count & estimated speaking time.
 * 2. Validate that the pitch textarea is not empty.
 * 3. On valid submit, show loading state and disable the Analyze button.
 * 4. Save pitch, target audience, and pitch duration to sessionStorage.
 * 5. Clearly marked TODO for future backend /analyze API call.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const pitchForm = document.getElementById('pitchForm');
  const pitchText = document.getElementById('pitchText');
  const targetAudience = document.getElementById('targetAudience');
  const pitchDuration = document.getElementById('pitchDuration');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loadingState = document.getElementById('loadingState');
  const pitchError = document.getElementById('pitchError');
  const wordCountBadge = document.getElementById('wordCountBadge');
  const estimatedTimeBadge = document.getElementById('estimatedTimeBadge');
  const loadSampleBtn = document.getElementById('loadSampleBtn');

  // --- Real-time Word Count & Speaking Duration Calculation ---
  function updateCounters() {
    const text = pitchText.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    
    // Average conversational delivery speed is ~135 words per minute
    const wordsPerMinute = 135;
    const totalSeconds = Math.round((words / wordsPerMinute) * 60);

    let timeDisplay = '~0 sec speaking time';
    if (totalSeconds > 0) {
      if (totalSeconds < 60) {
        timeDisplay = `~${totalSeconds}s speaking time`;
      } else {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timeDisplay = secs > 0 ? `~${mins}m ${secs}s speaking time` : `~${mins}m speaking time`;
      }
    }

    if (wordCountBadge) {
      wordCountBadge.textContent = `${words} word${words === 1 ? '' : 's'}`;
    }
    if (estimatedTimeBadge) {
      estimatedTimeBadge.textContent = timeDisplay;
    }
  }

  // Update counters and clear error as user types
  pitchText.addEventListener('input', () => {
    updateCounters();
    if (pitchText.value.trim().length > 0) {
      clearError();
    }
  });

  // --- Validation Helpers ---
  function showError(message) {
    pitchText.classList.add('has-error');
    if (pitchError) {
      pitchError.textContent = message;
      pitchError.classList.add('is-visible');
    }
    pitchText.focus();
  }

  function clearError() {
    pitchText.classList.remove('has-error');
    if (pitchError) {
      pitchError.textContent = '';
      pitchError.classList.remove('is-visible');
    }
  }

  // --- Sample Pitch Loader (For quick user testing) ---
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      pitchText.value = 
`Every year, over 50 million independent retailers lose up to 15% of annual revenue to unpredictable supply chain delays. Existing ERP software is built for conglomerates, requires 6-month deployments, and offers zero predictive foresight.

We built FlowSync: an autonomous inventory predictor designed specifically for SMB retailers. FlowSync connects directly to Shopify, Square, and supplier feeds in under 5 minutes. Using real-time logistics modeling, it flags stockout risks 21 days before they happen and automatically negotiates batch buffer orders.

In just 4 months of beta testing across 42 boutique retailers in the Northeast, FlowSync reduced stockouts by 68% and generated $420,000 in saved sales. We operate on a $199/month SaaS tier with a 115% net revenue retention.

We're raising a $1.2M seed round to scale our automated supplier integrations and accelerate merchant acquisition. Join us in making modern supply chain intelligence accessible to every business on the planet.`;

      targetAudience.value = 'Seed & Series A Venture Capitalists';
      pitchDuration.value = '2m';
      clearError();
      updateCounters();
    });
  }

  // --- Form Submit Handler ---
  pitchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const pitch = pitchText.value.trim();
    const audience = targetAudience ? targetAudience.value.trim() : '';
    const duration = pitchDuration ? pitchDuration.value : '';

    // 1. Validate that the pitch textarea is not empty
    if (!pitch) {
      showError('Please enter your pitch before analyzing.');
      return;
    }

    // Clear any previous error
    clearError();

    // 2. Show the existing loading state
    loadingState.classList.add('is-visible');
    loadingState.style.display = 'flex';
    loadingState.setAttribute('aria-hidden', 'false');

    // 3. Disable the Analyze button while loading
    analyzeBtn.disabled = true;

    // 4. Save pitch, target audience, and pitch duration to sessionStorage
    try {
      sessionStorage.setItem('pitch', pitch);
      sessionStorage.setItem('targetAudience', audience);
      sessionStorage.setItem('pitchDuration', duration);

      // Also save structured object for convenient single-key retrieval
      sessionStorage.setItem('pitchData', JSON.stringify({
        pitch: pitch,
        targetAudience: audience,
        pitchDuration: duration,
        submittedAt: new Date().toISOString()
      }));

      console.log('Pitch Doctor: Saved pitch details to sessionStorage.');
    } catch (storageErr) {
      console.warn('Pitch Doctor: sessionStorage access failed:', storageErr);
    }

    // =========================================================================
    // TODO: BACKEND /analyze API CALL
    // =========================================================================
    // Integrate the backend /analyze endpoint here when ready:
    //
    // const payload = {
    //   pitch: sessionStorage.getItem('pitch'),
    //   target_audience: sessionStorage.getItem('targetAudience'),
    //   pitch_duration: sessionStorage.getItem('pitchDuration')
    // };
    //
    // try {
    //   const response = await fetch('/analyze', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error(`Server returned status: ${response.status}`);
    //   }
    //
    //   const data = await response.json();
    //   sessionStorage.setItem('pitchAnalysisResults', JSON.stringify(data));
    //
    //   // Future redirect to results page:
    //   // window.location.href = 'results.html';
    // } catch (err) {
    //   console.error('Failed to analyze pitch:', err);
    //   // Re-enable button and reset loading state on failure:
    //   // analyzeBtn.disabled = false;
    //   // loadingState.classList.remove('is-visible');
    //   // loadingState.style.display = 'none';
    // }
    // =========================================================================
  });

  // Initial calculation on page load
  updateCounters();
});
