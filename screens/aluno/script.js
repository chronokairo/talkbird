// TalkBird Animation Library
const TBAnimation = {
    getElements: (selector) => typeof selector === 'string' ? Array.from(document.querySelectorAll(selector)) : [selector],

    fadeIn: (selector, duration = 500, delay = 0, callback) => {
        TBAnimation.getElements(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transition = `opacity ${duration}ms ease`;
            el.style.display = 'block';
            setTimeout(() => {
                el.style.opacity = '1';
                if (callback) setTimeout(callback, duration);
            }, delay);
        });
    },

    fadeOut: (selector, duration = 500, delay = 0, callback) => {
        TBAnimation.getElements(selector).forEach(el => {
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

    slideIn: (selector, direction = 'left', duration = 500, distance = '50px', delay = 0) => {
        const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
        const sign = direction === 'left' || direction === 'top' ? '' : '-';
        TBAnimation.getElements(selector).forEach(el => {
            el.style.transform = `translate${axis}(${sign}${distance})`;
            el.style.opacity = '0';
            el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
            setTimeout(() => {
                el.style.transform = 'translate(0, 0)';
                el.style.opacity = '1';
            }, delay);
        });
    },

    bounce: (selector, intensity = '20px', duration = 500, times = 3) => {
        TBAnimation.getElements(selector).forEach(el => {
            const keyframes = Array.from({ length: times + 1 }, (_, i) => {
                const percentage = Math.round((i / times) * 100);
                const direction = i % 2 === 0 ? intensity : '0px';
                return `${percentage}% { transform: translateY(${direction}); }`;
            }).join('');
            const animationName = `bounce-${Math.random().toString(36).substr(2, 9)}`;
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `@keyframes ${animationName} { ${keyframes} }`;
            document.head.appendChild(styleSheet);
            el.style.animation = `${animationName} ${duration}ms ease`;
            el.addEventListener('animationend', () => {
                el.style.animation = '';
                document.head.removeChild(styleSheet);
            }, { once: true });
        });
    },

    initParallax: (selector = '.parallax', factor = 0.5) => {
        const elements = TBAnimation.getElements(selector);
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            elements.forEach(el => el.style.transform = `translateY(${scrollTop * factor}px)`);
        });
    },

    typeText: (selector, text, speed = 50) => {
        const element = document.querySelector(selector);
        if (!element) return;
        element.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i++);
            } else {
                clearInterval(typing);
            }
        }, speed);
    },

    addHoverEffect: (selector, effect = 'scale') => {
        TBAnimation.getElements(selector).forEach(el => {
            el.style.transition = 'transform 0.3s ease';
            const effects = {
                scale: () => {
                    el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.1)');
                    el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');
                },
                rotate: () => {
                    el.addEventListener('mouseenter', () => el.style.transform = 'rotate(5deg)');
                    el.addEventListener('mouseleave', () => el.style.transform = 'rotate(0)');
                },
                shake: () => el.addEventListener('mouseenter', () => TBAnimation.bounce(el, '5px', 300, 2))
            };
            effects[effect]?.();
        });
    },

    animateOnScroll: () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const checkIfInView = () => {
            const windowHeight = window.innerHeight;
            const windowTop = window.pageYOffset;
            const windowBottom = windowTop + windowHeight;
            elements.forEach(el => {
                const elTop = el.offsetTop;
                const elBottom = elTop + el.offsetHeight;
                if (elBottom >= windowTop && elTop <= windowBottom) {
                    el.classList.add('animated');
                }
            });
        };
        ['scroll', 'resize'].forEach(event => window.addEventListener(event, checkIfInView));
        checkIfInView();
    }
};

// Initialize animations when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    TBAnimation.fadeIn('.logo', 800);
    TBAnimation.slideIn('.hero-text', 'left', 1000, '30px', 300);
    TBAnimation.slideIn('.hero-image', 'right', 1000, '30px', 500);

    const headingText = document.querySelector('#typing-heading')?.textContent;
    if (headingText) setTimeout(() => TBAnimation.typeText('#typing-heading', headingText, 40), 1000);

    ['.card', '.feature-card', '.social-icons a'].forEach(selector => TBAnimation.addHoverEffect(selector, 'scale'));
    document.querySelectorAll('.start-btn, .enter-btn').forEach(btn => btn.addEventListener('mouseenter', () => TBAnimation.bounce(btn, '5px', 300, 2)));

    const animateItems = ['.feature-card', '.card', '.testimonial', '.price-card'];
    animateItems.forEach((item, index) => {
        document.querySelectorAll(item).forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(el);
        });
    });

    const setupModal = (modalId, openBtnId, closeBtnId, onOpen = () => {}, onClose = () => {}) => {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);
        if (openBtn) openBtn.addEventListener('click', e => { e.preventDefault(); modal.classList.remove('hidden'); onOpen(); });
        if (closeBtn) closeBtn.addEventListener('click', () => { modal.classList.add('hidden'); onClose(); });
    };
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);

    // Initial check
    checkIfInView();
});

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

    // Modal de Login
    const loginModal = document.getElementById("loginModal");
    const openLoginModalBtn = document.getElementById("openModal");
    const closeLoginModalBtn = document.getElementById("closeModal");

    if (openLoginModalBtn) {
        openLoginModalBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.classList.remove("hidden");
        });
    } else {
        console.error("Botão de abrir modal de login não encontrado!");
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener("click", () => {
            loginModal.classList.add("hidden");
        });
    } else {
        console.error("Botão de fechar modal de login não encontrado!");
    }

    // Fechar o modal de login ao clicar fora do conteúdo
    loginModal.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add("hidden");
        }
    });

    // Mostrar/esconder senha
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('senha');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);

            // Mudar ícone
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Modal de Escolha de Plano
    const planModal = document.getElementById("planModal");
    const closePlanModalBtn = document.getElementById("closePlanModal");
    const planTitle = document.getElementById("planTitle");
    const planDescription = document.getElementById("planDescription");

    const plans = {
        Básico: "Plano Básico: Ideal para quem está começando. Inclui 2 aulas por semana e suporte por email.",
        Premium: "Plano Premium: Nosso plano mais popular! Inclui 5 aulas por semana, aulas em grupo e suporte 24/7.",
        Business: "Plano Business: Perfeito para empresas. Aulas ilimitadas, conteúdo personalizado e suporte VIP."
    };

    document.querySelectorAll(".price-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const planName = event.target.closest(".price-card").querySelector("h3").textContent;
            planTitle.textContent = planName;
            planDescription.textContent = plans[planName] || "Descrição não disponível.";
            planModal.classList.remove("hidden");
        });
    });

    if (closePlanModalBtn) {
        closePlanModalBtn.addEventListener("click", () => {
            planModal.classList.add("hidden");
        });
    } else {
        console.error("Botão de fechar modal de plano não encontrado!");
    }

    // Fechar o modal de plano ao clicar fora do conteúdo
    planModal.addEventListener("click", (e) => {
        if (e.target === planModal) {
            planModal.classList.add("hidden");
        }
    });

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' à aba clicada
            button.classList.add('active');

            // Alterna o conteúdo das abas
            const tabContent = document.querySelectorAll('.tab-pane');
            tabContent.forEach(content => content.classList.remove('active'));
            const targetTab = document.getElementById(button.dataset.tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetPane = document.getElementById(btn.dataset.tab);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Chat Functionality
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.btn-send');
    const messagesContainer = document.querySelector('.messages');

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
            chatInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic here
    });

    // Initialize animations
    TBAnimation.fadeIn('.logo', 800);
    TBAnimation.slideIn('.tab-content', 'top', 1000, '30px', 300);
});