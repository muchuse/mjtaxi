// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
	mobileMenu.classList.toggle('hidden');
	mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
mobileMenu.querySelectorAll('a').forEach(link => {
	link.addEventListener('click', () => {
		mobileMenu.classList.add('hidden');
		mobileMenu.classList.remove('active');
	});
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
	if (window.scrollY > 50) {
		navbar.classList.add('scrolled');
	} else {
		navbar.classList.remove('scrolled');
	}
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	});
});

// Booking form submission
const bookingForm = document.getElementById('booking-form');
const bookingModal = document.getElementById('booking-modal');
const modalContent = document.getElementById('modal-content');

if (bookingForm) {
	bookingForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		
		const submitBtn = bookingForm.querySelector('button[type="submit"]');
		const originalText = submitBtn.innerHTML;
		submitBtn.innerHTML = '<div class="spinner mx-auto"></div>';
		submitBtn.disabled = true;
		
		try {
			const response = await fetch(bookingForm.action, {
				method: 'POST',
				body: new FormData(bookingForm),
				headers: {
					'Accept': 'application/json'
				}
			});
			
			if (response.ok) {
				// Show modal
				bookingModal.classList.remove('hidden');
				bookingModal.classList.add('flex');
				
				setTimeout(() => {
					modalContent.classList.remove('scale-95', 'opacity-0');
					modalContent.classList.add('scale-100', 'opacity-100');
				}, 10);
				
				bookingForm.reset();
			} else {
				alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.');
			}
		} catch (error) {
			alert('Erreur de connexion. Veuillez vérifier votre connexion internet ou nous appeler directement.');
		} finally {
			submitBtn.innerHTML = originalText;
			submitBtn.disabled = false;
		}
	});
}

// Contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
	contactForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		
		const submitBtn = contactForm.querySelector('button[type="submit"]');
		const originalText = submitBtn.innerHTML;
		submitBtn.innerHTML = '<div class="spinner mx-auto"></div>';
		submitBtn.disabled = true;
		
		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				body: new FormData(contactForm),
				headers: {
					'Accept': 'application/json'
				}
			});
			
			if (response.ok) {
				alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
				contactForm.reset();
			} else {
				alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter par téléphone.');
			}
		} catch (error) {
			alert('Erreur de connexion. Veuillez vérifier votre connexion internet.');
		} finally {
			submitBtn.innerHTML = originalText;
			submitBtn.disabled = false;
		}
	});
}

// Close modal function
function closeModal() {
	modalContent.classList.remove('scale-100', 'opacity-100');
	modalContent.classList.add('scale-95', 'opacity-0');
	
	setTimeout(() => {
		bookingModal.classList.add('hidden');
		bookingModal.classList.remove('flex');
	}, 300);
}

// Close modal when clicking outside
bookingModal.addEventListener('click', (e) => {
	if (e.target === bookingModal) {
		closeModal();
	}
});

// Select vehicle from fleet section
function selectVehicle(type) {
	// Scroll to booking section
	document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
	
	// Select the corresponding radio button
	setTimeout(() => {
		const radio = document.querySelector(`input[name="vehicle"][value="${type}"]`);
		if (radio) {
			radio.checked = true;
		}
	}, 500);
}

// Set today's date as minimum for date input
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
	const today = new Date().toISOString().split('T')[0];
	input.setAttribute('min', today);
});

// Intersection Observer for fade-in animations
const observerOptions = {
	root: null,
	rootMargin: '0px',
	threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('fade-in');
			entry.target.style.opacity = '1';
			observer.unobserve(entry.target);
		}
	});
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.group').forEach((el) => {
	el.style.opacity = '0';
	observer.observe(el);
});

// Form validation enhancement
const forms = document.querySelectorAll('form');
forms.forEach(form => {
	const inputs = form.querySelectorAll('input, textarea');
	
	inputs.forEach(input => {
		input.addEventListener('blur', () => {
			if (input.checkValidity()) {
				input.classList.remove('border-red-500');
				input.classList.add('border-green-500');
			} else if (input.value !== '') {
				input.classList.add('border-red-500');
			}
		});
	});
});

// Phone number formatting (if phone input exists)
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
	input.addEventListener('input', (e) => {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length > 10) value = value.slice(0, 10);
		e.target.value = value;
	});
});

// Price calculation simulation (for demo purposes)
const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');
vehicleRadios.forEach(radio => {
	radio.addEventListener('change', () => {
		// Could add price calculation logic here
		console.log('Vehicle selected:', radio.value);
	});
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src || img.src;
				img.classList.remove('lazy');
				imageObserver.unobserve(img);
			}
		});
	});

	document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}

const ORS_API_KEY = "TA_CLE_ORS";

// ===== TARIFS NANTES =====
const tarifs = {
  A: 1.11,
  B: 1.5
};

async function calculatePrice() {

  const origin = document.getElementById("depart").value;
  const destination = document.getElementById("destination").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!origin || !destination || !date || !time) return;

  try {

    const coords = await Promise.all([
      geocode(origin),
      geocode(destination)
    ]);

    if (!coords[0] || !coords[1]) return;

    const [o, d] = coords;

    const routeRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates: [
            [o.lng, o.lat],
            [d.lng, d.lat]
          ]
        })
      }
    );

    const routeData = await routeRes.json();

    const distanceKm =
      routeData.features[0].properties.summary.distance / 1000;

    const tarifType = getTarifType(date, time);
    const total = distanceKm * tarifs[tarifType];

    document.getElementById("priceDisplay").innerHTML =
      `Tarif ${tarifType} estimé : ${total.toFixed(2)} €`;

  } catch (error) {
    console.error(error);
  }
}

// ===== Déterminer jour ou nuit =====
function getTarifType(dateStr, timeStr) {

  const dateObj = new Date(`${dateStr}T${timeStr}`);
  const hour = dateObj.getHours();
  const day = dateObj.getDay(); // 0 = dimanche

  const isNight = (hour >= 19 || hour < 7);
  const isSunday = (day === 0);

  if (isNight || isSunday) {
    return "B";
  } else {
    return "A";
  }
}

// ===== Géocodage =====
async function geocode(address) {

  const res = await fetch(
    `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address + " Nantes")}`
  );

  const data = await res.json();

  if (data.features.length > 0) {
    return {
      lat: data.features[0].geometry.coordinates[1],
      lng: data.features[0].geometry.coordinates[0]
    };
  }

  return null;
}

// ===== Déclenchement automatique =====
document.getElementById("depart").addEventListener("change", calculatePrice);
document.getElementById("destination").addEventListener("change", calculatePrice);
document.getElementById("date").addEventListener("change", calculatePrice);
document.getElementById("heure").addEventListener("change", calculatePrice);




console.log('🚕 MJ44TAXI website loaded successfully!');
