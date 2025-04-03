document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');
  const formAlert = document.getElementById('formAlert');
  
  // Validate form
  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add('was-validated');
    return;
  }
  
  // Show loading state
  submitText.textContent = 'Sending...';
  submitSpinner.classList.remove('d-none');
  submitBtn.disabled = true;
  
  try {

    let body = '';
    req.on('data', chunk => {
       body += chunk.toString();
   });
     req.on('end', async () => {
      try {
       const { name, email, subject, message } = JSON.parse(body);
    // Rest of your email sending code
       } catch (error) {
    // Error handling
       }
      });
    // Create FormData object properly
    const formData = new FormData(form);
    
    // Convert to plain object
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formDataObj)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    
    const result = await response.json();
    
    formAlert.innerHTML = `
      <div class="alert alert-success">
        Message sent successfully! I'll get back to you soon.
      </div>
    `;
    form.reset();
    form.classList.remove('was-validated');
  } catch (error) {
    console.error('Error:', error);
    formAlert.innerHTML = `
      <div class="alert alert-danger">
        ${error.message || 'An error occurred while sending your message. Please try again later.'}
      </div>
    `;
  } finally {
    submitText.textContent = 'Send Message';
    submitSpinner.classList.add('d-none');
    submitBtn.disabled = false;
  }
});