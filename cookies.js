// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.cookieName = 'cakebooking_cookie_consent';
        this.cookieExpiryDays = 365;
        this.bannerId = 'cookie-banner';
        this.init();
    }

    init() {
        // Check if user has already made a decision
        if (!this.getCookie(this.cookieName)) {
            this.showBanner();
        }
    }

    showBanner() {
        // Create banner HTML
        const bannerHTML = `
            <div id="${this.bannerId}" class="cookie-banner">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-header">
                        <div class="cookie-icon">
                            <i class="fa-solid fa-cookie-bite"></i>
                        </div>
                        <h3>Używamy plików cookie</h3>
                    </div>
                    <p>
                        Używamy plików cookie, aby poprawić Twoje doświadczenie na naszej stronie, 
                        analizować ruch i personalizować treści. Klikając "Akceptuję", wyrażasz zgodę 
                        na używanie wszystkich plików cookie.
                    </p>
                    <div class="cookie-banner-actions">
                        <button class="cookie-btn cookie-btn-secondary" onclick="cookieConsent.reject()">
                            <i class="fa-solid fa-times"></i>
                            Odrzuć
                        </button>
                        <button class="cookie-btn cookie-btn-primary" onclick="cookieConsent.accept()">
                            <i class="fa-solid fa-check"></i>
                            Akceptuję
                        </button>
                    </div>
                    <div class="cookie-banner-links">
                        <a href="#" onclick="cookieConsent.showDetails()">Więcej informacji</a>
                        <a href="#" onclick="cookieConsent.hideBanner()">Ukryj</a>
                    </div>
                </div>
            </div>
        `;

        // Add banner to page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Add styles
        this.addStyles();

        // Animate banner in
        setTimeout(() => {
            const banner = document.getElementById(this.bannerId);
            if (banner) {
                banner.classList.add('cookie-banner-show');
            }
        }, 100);
    }

    addStyles() {
        const styleId = 'cookie-banner-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            .cookie-banner {
                position: fixed;
                bottom: -100%;
                left: 0;
                right: 0;
                background: rgba(15, 34, 56, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-top: 1px solid rgba(215, 184, 143, 0.3);
                z-index: 9999;
                transition: bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 1rem;
            }

            .cookie-banner-show {
                bottom: 0;
            }

            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .cookie-banner-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .cookie-icon {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                background: linear-gradient(135deg, #D7B88F, #F1E0C8);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0F2238;
                font-size: 1.25rem;
                animation: cookie-bounce 2s infinite;
            }

            @keyframes cookie-bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-5px);
                }
                60% {
                    transform: translateY(-3px);
                }
            }

            .cookie-banner-header h3 {
                color: #FFFFFF;
                font-family: 'Playfair Display', serif;
                font-size: 1.25rem;
                font-weight: 700;
                margin: 0;
            }

            .cookie-banner-content p {
                color: #BFCAD9;
                line-height: 1.6;
                margin: 0;
                font-size: 0.95rem;
            }

            .cookie-banner-actions {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
            }

            .cookie-btn {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                border-radius: 2rem;
                font-weight: 600;
                font-size: 0.9rem;
                border: none;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
                min-width: 120px;
                justify-content: center;
            }

            .cookie-btn-primary {
                background: linear-gradient(135deg, #D7B88F, #F1E0C8);
                color: #0F2238;
                box-shadow: 0 4px 12px rgba(215, 184, 143, 0.3);
            }

            .cookie-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(215, 184, 143, 0.4);
            }

            .cookie-btn-secondary {
                background: transparent;
                color: #BFCAD9;
                border: 2px solid rgba(191, 202, 217, 0.3);
            }

            .cookie-btn-secondary:hover {
                background: rgba(191, 202, 217, 0.1);
                border-color: rgba(191, 202, 217, 0.5);
                color: #FFFFFF;
            }

            .cookie-banner-links {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .cookie-banner-links a {
                color: #D7B88F;
                text-decoration: none;
                font-size: 0.85rem;
                transition: color 0.3s ease;
            }

            .cookie-banner-links a:hover {
                color: #F1E0C8;
                text-decoration: underline;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .cookie-banner {
                    padding: 1rem;
                }

                .cookie-banner-content {
                    gap: 0.75rem;
                }

                .cookie-banner-header {
                    flex-direction: column;
                    text-align: center;
                    gap: 0.5rem;
                }

                .cookie-banner-actions {
                    justify-content: center;
                }

                .cookie-btn {
                    flex: 1;
                    min-width: auto;
                }

                .cookie-banner-links {
                    justify-content: center;
                }
            }

            /* Animation for banner hide */
            .cookie-banner-hide {
                bottom: -100% !important;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    accept() {
        this.setCookie(this.cookieName, 'accepted', this.cookieExpiryDays);
        this.hideBanner();
        this.showNotification('Dziękujemy! Twoje preferencje zostały zapisane.', 'success');
    }

    reject() {
        this.setCookie(this.cookieName, 'rejected', this.cookieExpiryDays);
        this.hideBanner();
        this.showNotification('Rozumiemy. Pliki cookie zostały odrzucone.', 'info');
    }

    hideBanner() {
        const banner = document.getElementById(this.bannerId);
        if (banner) {
            banner.classList.add('cookie-banner-hide');
            setTimeout(() => {
                banner.remove();
            }, 500);
        }
    }

    showDetails() {
        // Create a modal with detailed cookie information
        const modalHTML = `
            <div id="cookie-modal" class="cookie-modal">
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h3>Polityka plików cookie</h3>
                        <button onclick="cookieConsent.closeModal()" class="cookie-modal-close">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="cookie-modal-body">
                        <h4>Jakie pliki cookie używamy?</h4>
                        <ul>
                            <li><strong>Niezbędne:</strong> Umożliwiają podstawowe funkcjonowanie strony</li>
                            <li><strong>Analityczne:</strong> Pomagają nam zrozumieć, jak użytkownicy korzystają ze strony</li>
                            <li><strong>Funkcjonalne:</strong> Zapamiętują Twoje preferencje i ustawienia</li>
                        </ul>
                        
                        <h4>Jak zarządzać plikami cookie?</h4>
                        <p>Możesz zmienić ustawienia przeglądarki, aby blokować pliki cookie lub otrzymywać powiadomienia o ich używaniu.</p>
                        
                        <h4>Wiecej informacji</h4>
                        <p>Szczegółowe informacje znajdziesz w naszej <a href="#" style="color: #D7B88F;">Polityce prywatności</a>.</p>
                    </div>
                    <div class="cookie-modal-footer">
                        <button onclick="cookieConsent.closeModal()" class="cookie-btn cookie-btn-primary">
                            Rozumiem
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                animation: modal-fade-in 0.3s ease;
            }

            @keyframes modal-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .cookie-modal-content {
                background: #FFFFFF;
                border-radius: 1rem;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: modal-slide-in 0.3s ease;
            }

            @keyframes modal-slide-in {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .cookie-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #E5E7EB;
            }

            .cookie-modal-header h3 {
                color: #0F2238;
                font-family: 'Playfair Display', serif;
                margin: 0;
                font-size: 1.5rem;
            }

            .cookie-modal-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                color: #6B7280;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
            }

            .cookie-modal-close:hover {
                background: #F3F4F6;
                color: #374151;
            }

            .cookie-modal-body {
                padding: 1.5rem;
                color: #374151;
                line-height: 1.6;
            }

            .cookie-modal-body h4 {
                color: #0F2238;
                font-family: 'Playfair Display', serif;
                margin: 1.5rem 0 0.75rem 0;
                font-size: 1.1rem;
            }

            .cookie-modal-body h4:first-child {
                margin-top: 0;
            }

            .cookie-modal-body ul {
                margin: 0.75rem 0;
                padding-left: 1.5rem;
            }

            .cookie-modal-body li {
                margin: 0.5rem 0;
            }

            .cookie-modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #E5E7EB;
                text-align: right;
            }

            @media (max-width: 768px) {
                .cookie-modal-content {
                    margin: 1rem;
                    max-height: calc(100vh - 2rem);
                }
            }
        `;

        // Add modal styles if not already present
        if (!document.getElementById('cookie-modal-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'cookie-modal-styles';
            styleElement.textContent = modalStyles;
            document.head.appendChild(styleElement);
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.style.animation = 'modal-fade-out 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        const notificationHTML = `
            <div class="cookie-notification cookie-notification-${type}">
                <div class="cookie-notification-content">
                    <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;

        // Add notification styles if not already present
        if (!document.getElementById('cookie-notification-styles')) {
            const notificationStyles = `
                .cookie-notification {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    background: #FFFFFF;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    z-index: 10001;
                    animation: notification-slide-in 0.5s ease;
                    max-width: 400px;
                }

                @keyframes notification-slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .cookie-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                }

                .cookie-notification-success .cookie-notification-content i {
                    color: #10B981;
                }

                .cookie-notification-info .cookie-notification-content i {
                    color: #3B82F6;
                }

                .cookie-notification-content span {
                    color: #374151;
                    font-size: 0.9rem;
                }

                @media (max-width: 768px) {
                    .cookie-notification {
                        top: 1rem;
                        right: 1rem;
                        left: 1rem;
                        max-width: none;
                    }
                }
            `;

            const styleElement = document.createElement('style');
            styleElement.id = 'cookie-notification-styles';
            styleElement.textContent = notificationStyles;
            document.head.appendChild(styleElement);
        }

        document.body.insertAdjacentHTML('beforeend', notificationHTML);

        // Auto-remove notification after 4 seconds
        setTimeout(() => {
            const notification = document.querySelector('.cookie-notification');
            if (notification) {
                notification.style.animation = 'notification-slide-out 0.5s ease';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }
        }, 4000);
    }

    // Cookie utility functions
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}

// Initialize cookie consent when DOM is loaded
let cookieConsent;
document.addEventListener('DOMContentLoaded', function() {
    cookieConsent = new CookieConsent();
});

// Add notification slide-out animation
const additionalStyles = `
    @keyframes notification-slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// Add the additional styles to the existing notification styles
if (document.getElementById('cookie-notification-styles')) {
    document.getElementById('cookie-notification-styles').textContent += additionalStyles;
} 