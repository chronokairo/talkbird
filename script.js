// TalkBird Animation Library
const TBAnimation = {
    // Utility to get element(s)
    getElements: (selector) => {
        return typeof selector === 'string' ?
            Array.from(document.querySelectorAll(selector)) : [selector];
    },

    // Fade in animation
    fadeIn: (selector, duration = 500, delay = 0, callback) => {
        const elements = TBAnimation.getElements(selector);
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = `opacity ${duration}ms ease`;
            el.style.display = 'block';

            setTimeout(() => {
                el.style.opacity = '1';
                if (callback) setTimeout(callback, duration);
            }, delay);
        });
    },

    // Fade out animation
    fadeOut: (selector, duration = 500, delay = 0, callback) => {
        const elements = TBAnimation.getElements(selector);
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transition = `opacity ${duration}ms ease`;

            setTimeout(() => {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.display = 'none';
                    if (callback) callback();
                }, duration);
            }, delay);
        });
    },

    // Slide in from direction
    slideIn: (selector, direction = 'left', duration = 500, distance = '50px', delay = 0) => {
        const elements = TBAnimation.getElements(selector);
        const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
        const sign = direction === 'left' || direction === 'top' ? '' : '-';

        elements.forEach(el => {
            el.style.transform = `translate${axis}(${sign}${distance})`;
            el.style.opacity = '0';
            el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

            setTimeout(() => {
                el.style.transform = 'translate(0, 0)';
                el.style.opacity = '1';
            }, delay);
        });
    },

    // animação de balanço
    bounce: (selector, intensity = '20px', duration = 500, times = 3) => {
        const elements = TBAnimation.getElements(selector);
        elements.forEach(el => {
            let keyframes = '';
            for (let i = 0; i <= times; i++) {
                const percentage = Math.round((i / times) * 100);
                const direction = i % 2 === 0 ? intensity : '0px';
                keyframes += `${percentage}% { transform: translateY(${direction}); }`;
            }

            const animationName = `bounce-${Math.random().toString(36).substr(2, 9)}`;
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @keyframes ${animationName} {
                    ${keyframes}
                }
            `;
            document.head.appendChild(styleSheet);

            el.style.animation = `${animationName} ${duration}ms ease`;
            el.addEventListener('animationend', () => {
                el.style.animation = '';
                document.head.removeChild(styleSheet);
            }, { once: true });
        });
    },

    // Parallax scrolling
    initParallax: (selector = '.parallax', factor = 0.5) => {
        const elements = TBAnimation.getElements(selector);
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            elements.forEach(el => {
                const offset = scrollTop * factor;
                el.style.transform = `translateY(${offset}px)`;
            });
        });
    },

    // Efeito de digitação
    typeText: (selector, text, speed = 50) => {
        const element = document.querySelector(selector);
        if (!element) return;

        element.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    },

    // Add hover effect
    addHoverEffect: (selector, effect = 'scale') => {
        const elements = TBAnimation.getElements(selector);
        elements.forEach(el => {
            el.style.transition = 'transform 0.3s ease';

            if (effect === 'scale') {
                el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.1)'; });
                el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
            } else if (effect === 'rotate') {
                el.addEventListener('mouseenter', () => { el.style.transform = 'rotate(5deg)'; });
                el.addEventListener('mouseleave', () => { el.style.transform = 'rotate(0)'; });
            } else if (effect === 'shake') {
                el.addEventListener('mouseenter', () => TBAnimation.bounce(el, '5px', 300, 2));
            }
        });
    },

    // Animate on scroll
    animateOnScroll: () => {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const checkIfInView = () => {
            const windowHeight = window.innerHeight;
            const windowTopPosition = window.pageYOffset;
            const windowBottomPosition = windowTopPosition + windowHeight;

            elements.forEach(element => {
                const elementHeight = element.offsetHeight;
                const elementTopPosition = element.offsetTop;
                const elementBottomPosition = elementTopPosition + elementHeight;

                // Check if element is in viewport
                if ((elementBottomPosition >= windowTopPosition) &&
                    (elementTopPosition <= windowBottomPosition)) {
                    element.classList.add('animated');
                }
            });
        };

        window.addEventListener('scroll', checkIfInView);
        window.addEventListener('resize', checkIfInView);

        // Initial check
        checkIfInView();
    }
};

// Initialize animations when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation to hero section elements
    TBAnimation.fadeIn('.logo', 800);
    TBAnimation.slideIn('.hero-text', 'left', 1000, '30px', 300);
    TBAnimation.slideIn('.hero-image', 'right', 1000, '30px', 500);

    // Type text effect for heading
    const headingText = document.querySelector('#typing-heading').textContent;
    setTimeout(() => {
        TBAnimation.typeText('#typing-heading', headingText, 40);
    }, 1000);

    // Add hover effects
    TBAnimation.addHoverEffect('.card', 'scale');
    TBAnimation.addHoverEffect('.feature-card', 'scale');
    TBAnimation.addHoverEffect('.social-icons a', 'rotate');

    // Add bounce effect to CTA buttons
    document.querySelectorAll('.start-btn, .enter-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            TBAnimation.bounce(btn, '5px', 300, 2);
        });
    });

    // Animate elements when scrolling
    const animateItems = ['.feature-card', '.card', '.testimonial', '.price-card'];
    animateItems.forEach((item, index) => {
        const elements = document.querySelectorAll(item);
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            // Add scroll observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 150); // Staggered animation
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(el);
        });
    });

    const loginModal = document.getElementById("loginModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.getElementById("closeModal");

    // Abrir o modal
    openModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.classList.remove("hidden");
    });

    // Fechar o modal
    closeModalBtn.addEventListener("click", () => {
        loginModal.classList.add("hidden");
    });

    // Fechar o modal ao clicar fora dele
    loginModal.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add("hidden");
        }
    });
});