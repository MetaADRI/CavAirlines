document.addEventListener('DOMContentLoaded', () => {
    // Common functionality across all pages
    initializeWebsite();

    // Page-specific functionality
    if (document.body.contains(document.getElementById('bookingForm'))) {
        initializeBookingPage();
    }

    if (document.body.contains(document.querySelector('.service-card'))) {
        initializeServicesPage();
    }

    if (document.body.contains(document.getElementById('map'))) {
        initializeContactPage();
    }
});

function initializeWebsite() {
    // Smooth scrolling for navigation links
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

    // Navigation active state management
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function initializeBookingPage() {
    const bookingForm = document.getElementById('bookingForm');
    const fileInput = document.getElementById('passportUpload');
    const uploadBox = document.querySelector('.upload-box');
    const previewContainer = document.createElement('div');
    previewContainer.className = 'upload-preview mt-3';
    uploadBox.parentNode.insertBefore(previewContainer, uploadBox.nextSibling);

    // File upload handling
    fileInput.addEventListener('change', handleFileUpload);
    
    // Drag & drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, highlightBox, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, unhighlightBox, false);
    });

    uploadBox.addEventListener('drop', handleDrop, false);

    // Form validation and submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = new FormData(bookingForm);
            showLoadingState(true);
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                showConfirmationModal();
                bookingForm.reset();
                previewContainer.innerHTML = '';
            } catch (error) {
                showError('Submission failed. Please try again.');
            } finally {
                showLoadingState(false);
            }
        }
    });

    function handleFileUpload(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        handleFiles(files);
    }

    function handleFiles(files) {
        previewContainer.innerHTML = '';
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement('div');
                    preview.className = 'preview-item';
                    preview.innerHTML = 
                        <img src="${e.target.result}" class="preview-image" alt="Upload preview">
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${(file.size / 1024).toFixed(2)}KB</span>
                        </div>
                    ;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function validateForm() {
        // Add comprehensive validation logic
        return true;
    }
}

function initializeServicesPage() {
    // Service card interactions
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const details = this.querySelector('.full-details');
            if (details) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.service-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            filterServices(filterValue);
        });
    });
}

function initializeContactPage() {
    // Map initialization (would need Google Maps API key)
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Initialize Google Map here
        console.log('Map element found - initialize with API key');
    }

    // Social media interactions
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '_blank');
        });
    });
}

function showLoadingState(show) {
    const loader = document.getElementById('loadingOverlay') || createLoader();
    loader.style.display = show ? 'flex' : 'none';
}

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loadingOverlay';
    loader.innerHTML = 
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    ;
    Object.assign(loader.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    });
    document.body.appendChild(loader);
    return loader;
}

function showConfirmationModal() {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

function showError(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
    errorAlert.role = 'alert';
    errorAlert.textContent = message;
    document.body.appendChild(errorAlert);
    
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}

// Utility functions
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlightBox() {
    this.style.backgroundColor = 'rgba(0, 70, 171, 0.1)';
}

function unhighlightBox() {
    this.style.backgroundColor = '';
}

function filterServices(filter) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.display = card.dataset.service === filter || filter === 'all' ? 'block' : 'none';
    });
}
