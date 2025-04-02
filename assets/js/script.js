document.addEventListener('DOMContentLoaded', function() {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    const tl = gsap.timeline();
    tl.from('.hero h1', { 
        opacity: 0, 
        y: -50, 
        duration: 1 
    })
    .from('.hero p', { 
        opacity: 0, 
        y: 20, 
        duration: 1 
    }, '-=0.5')
    .from('.hero .btn', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 1, 
        stagger: 0.2 
    }, '-=0.5');

    // Section animations
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Skill cards animation
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8
    });

    // Project cards animation
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1
    });

    // Contact form animation
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -50,
        duration: 1
    });

    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 50,
        duration: 1
    });

    
});


// Better mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.setAttribute('aria-expanded', 'false');
      } else {
        navbarToggler.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          navbarToggler.click();
        }
      });
    });
  });


      // form submission

  document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  
  // Client-side validation
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');
  const alertBox = document.getElementById('formAlert');
  
  // UI updates
  submitBtn.disabled = true;
  submitText.textContent = 'Sending...';
  submitSpinner.classList.remove('d-none');
  alertBox.innerHTML = '';

  try {
    const formData = new FormData(form);
    const response = await fetch('/api/sendmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const data = await response.json();

    if (response.ok) {
      alertBox.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show">
          Message sent successfully!
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
      form.reset();
      form.classList.remove('was-validated');
    } else {
      alertBox.innerHTML = `
        <div class="alert alert-danger">
          ${data.error || 'Failed to send message'}
        </div>
      `;
    }
  } catch (error) {
    alertBox.innerHTML = `
      <div class="alert alert-danger">
        Network error. Please try again later.
      </div>
    `;
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = 'Send Message';
    submitSpinner.classList.add('d-none');
  }
});