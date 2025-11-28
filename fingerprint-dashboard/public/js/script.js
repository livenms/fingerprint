// Client-side functionality - this runs in the browser
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fingerprint Dashboard loaded');
    
    // Auto-refresh devices status every 30 seconds
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('tab=dashboard') || 
            currentUrl.includes('tab=devices')) {
            window.location.reload();
        }
    }, 30000);

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const currentUrl = window.location.href;
            if (currentUrl.includes('modal=enroll')) {
                // Remove modal parameter from URL
                const newUrl = currentUrl.replace('&modal=enroll', '').replace('?modal=enroll', '?').replace(/\?$/, '');
                window.location.href = newUrl;
            }
        }
    });

    // Add click outside to close modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fixed') && 
            e.target.classList.contains('inset-0')) {
            const currentUrl = window.location.href;
            if (currentUrl.includes('modal=enroll')) {
                // Remove modal parameter from URL
                const newUrl = currentUrl.replace('&modal=enroll', '').replace('?modal=enroll', '?').replace(/\?$/, '');
                window.location.href = newUrl;
            }
        }
    });
});