// Global variables
let currentPage = 'home';
let isNavigating = false;
let demoTimeout = null;
let currentDemoStep = 0;
let isYearlyPricing = false;
let isDemoPlaying = false;

// Voice demo conversation data
const demoConversation = [
    {
        speaker: "ai",
        text: "Thank you for calling Miller & Associates Law Firm. This is Sarah, your virtual assistant. I understand you may have some questions about a legal matter. How can I help you today?",
        delay: 0
    },
    {
        speaker: "caller", 
        text: "Hi, I was in a car accident last week and I'm not sure if I need a lawyer.",
        delay: 8000
    },
    {
        speaker: "ai",
        text: "I'm so sorry to hear about your accident, John. That must have been very stressful for you. I'd be happy to help you understand your options. Can you tell me a bit about what happened?",
        delay: 6000
    },
    {
        speaker: "caller",
        text: "Well, I was hit by another driver who ran a red light. I went to the hospital and have some medical bills piling up.",
        delay: 10000
    },
    {
        speaker: "ai", 
        text: "That sounds like a difficult situation, and I want to make sure you get the help you need. Based on what you've shared, this could be a case where legal representation would be beneficial. I'd like to connect you with Attorney Miller for a free consultation. Would you be available for a 30-minute call tomorrow at 2 PM?",
        delay: 8000
    },
    {
        speaker: "caller",
        text: "Yes, that would be great. Thank you so much for your help.",
        delay: 7000
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Bindle application...');
    initializeApp();
});

function initializeApp() {
    addRequiredStyles();
    initPageNavigation();
    initButtonHandlers();
    initSmoothScrolling();
    initMobileMenu();
    initNavbarScroll();
    initScrollAnimations();
    initVoiceDemo();
    initBrowserNavigation();
    initModalFunctionality();
    
    // Set initial page state
    const initialHash = window.location.hash.substring(1) || 'home';
    navigateToPage(initialHash, false);
    
    console.log('Bindle application initialized successfully!');
}

// Core Navigation System
function initPageNavigation() {
    console.log('Initializing page navigation...');
    
    const navLinks = document.querySelectorAll('[data-page], .nav-brand');
    console.log('Found navigation elements:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isNavigating) return;
            
            if (this.classList.contains('nav-brand')) {
                console.log('Logo clicked - navigating to home');
                navigateToPage('home', true);
                return;
            }
            
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                console.log('Navigation clicked:', targetPage);
                navigateToPage(targetPage, true);
            }
        });
    });
}

function navigateToPage(pageName, updateHash = true) {
    if (isNavigating) return;
    isNavigating = true;
    
    console.log('Navigating to page:', pageName);
    
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        if (updateHash) {
            window.location.hash = pageName;
        }
        
        updateNavActiveStates(pageName);
        window.scrollTo(0, 0);
        
        setTimeout(() => {
            initPageSpecificFunctionality(pageName);
            isNavigating = false;
        }, 100);
        
        console.log('Successfully navigated to:', pageName);
    } else {
        console.error('Page not found:', pageName + '-page');
        isNavigating = false;
    }
}

function updateNavActiveStates(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initPageSpecificFunctionality(pageName) {
    console.log('Initializing functionality for page:', pageName);
    
    switch(pageName) {
        case 'home':
            initHomePage();
            break;
        case 'dashboard':
            initDashboard();
            break;
        case 'how-it-works':
            initHowItWorks();
            break;
        case 'features':
            initFeaturesPage();
            break;
        case 'pricing':
            initPricingPage();
            break;
        case 'contact':
            initContactPage();
            break;
    }
}

// Home Page Functions
function initHomePage() {
    console.log('Initializing home page...');
    initHomeCounterAnimations();
    initVoiceDemo();
}

function initHomeCounterAnimations() {
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                const numberMatch = text.match(/(\d+)/);
                if (numberMatch) {
                    const number = parseInt(numberMatch[1]);
                    element.textContent = '0';
                    animateCounter(element, 0, number, 2000);
                    counterObserver.unobserve(element);
                }
            }
        });
    }, { threshold: 0.5 });

    const homePage = document.getElementById('home-page');
    if (homePage && homePage.classList.contains('active')) {
        const statNumbers = homePage.querySelectorAll('.stat-number, .result-number');
        statNumbers.forEach(stat => {
            if (/^\d/.test(stat.textContent.trim())) {
                counterObserver.observe(stat);
            }
        });
    }
}

// Voice Demo Functions
function initVoiceDemo() {
    console.log('Initializing voice demo...');
    
    const playBtn = document.getElementById('demo-play-btn');
    const progressBar = document.getElementById('demo-progress-bar');
    const conversation = document.querySelector('.demo-conversation');
    
    if (!playBtn || !progressBar || !conversation) {
        console.log('Voice demo elements not found');
        return;
    }
    
    console.log('Voice demo elements found, setting up...');
    
    let currentStep = 0;
    let totalDuration = 45000; // 45 seconds total demo
    
    isDemoPlaying = false;
    progressBar.style.width = '0%';
    
    const newPlayBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newPlayBtn, playBtn);
    
    newPlayBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Demo play button clicked, current state:', isDemoPlaying);
        
        if (isDemoPlaying) {
            stopDemo();
        } else {
            startDemo();
        }
    });
    
    function startDemo() {
        console.log('Starting voice demo...');
        isDemoPlaying = true;
        newPlayBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Pause Demo
        `;
        newPlayBtn.classList.add('playing');
        currentStep = 0;
        
        conversation.innerHTML = '<div class="conversation-bubble ai-bubble show" id="demo-bubble-0"><div class="speaker-label">Sarah (AI)</div><p>Thank you for calling Miller & Associates Law Firm. I understand you may have some questions about a legal matter. How can I help you today?</p></div>';
        
        progressBar.style.transition = `width ${totalDuration}ms linear`;
        progressBar.style.width = '100%';
        
        scheduleNextBubble();
        
        demoTimeout = setTimeout(() => {
            completeDemo();
        }, totalDuration);
        
        showNotification('Voice demo started! Listen to the AI conversation.', 'info');
    }
    
    function scheduleNextBubble() {
        if (currentStep >= demoConversation.length - 1 || !isDemoPlaying) return;
        
        currentStep++;
        const nextBubble = demoConversation[currentStep];
        
        setTimeout(() => {
            if (!isDemoPlaying) return;
            
            const bubbleClass = nextBubble.speaker === 'ai' ? 'ai-bubble' : 'caller-bubble';
            const speakerLabel = nextBubble.speaker === 'ai' ? 'Sarah (AI)' : 'John Smith';
            
            const bubbleElement = document.createElement('div');
            bubbleElement.className = `conversation-bubble ${bubbleClass}`;
            bubbleElement.innerHTML = `
                <div class="speaker-label">${speakerLabel}</div>
                <p>${nextBubble.text}</p>
            `;
            
            conversation.appendChild(bubbleElement);
            
            setTimeout(() => {
                bubbleElement.classList.add('show');
            }, 100);
            
            bubbleElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            scheduleNextBubble();
        }, nextBubble.delay);
    }
    
    function stopDemo() {
        console.log('Stopping voice demo...');
        isDemoPlaying = false;
        newPlayBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Play Demo
        `;
        newPlayBtn.classList.remove('playing');
        
        if (demoTimeout) {
            clearTimeout(demoTimeout);
            demoTimeout = null;
        }
        
        const currentWidth = progressBar.getBoundingClientRect().width / progressBar.parentElement.getBoundingClientRect().width * 100;
        progressBar.style.transition = 'none';
        progressBar.style.width = currentWidth + '%';
        
        showNotification('Voice demo paused', 'info');
    }
    
    function completeDemo() {
        console.log('Demo completed');
        stopDemo();
        progressBar.style.width = '100%';
        showNotification('🎉 Demo completed! Ready to start your free trial?', 'success');
    }
}

// Features Page Functions
function initFeaturesPage() {
    console.log('Initializing features page...');
    initFeatureAnimations();
    initExpandableFeatures();
}

function initFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

function initExpandableFeatures() {
    const expandableFeatures = document.querySelectorAll('.expandable-feature');
    
    expandableFeatures.forEach(feature => {
        const toggleBtn = feature.querySelector('.feature-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const isExpanded = feature.classList.contains('expanded');
                
                // Close all other expanded features first
                expandableFeatures.forEach(f => f.classList.remove('expanded'));
                
                if (!isExpanded) {
                    feature.classList.add('expanded');
                    this.textContent = 'Show Less ↑';
                    showNotification('Feature details expanded', 'info');
                } else {
                    feature.classList.remove('expanded');
                    this.innerHTML = 'Learn More <span class="toggle-arrow">↓</span>';
                }
            });
        }
    });
}

// Contact Page Functions
function initContactPage() {
    console.log('Initializing contact page...');
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    const contactPopupBtn = document.querySelector('.contact-popup-btn');
    if (contactPopupBtn) {
        contactPopupBtn.addEventListener('click', function() {
            openContactModal();
        });
    }
    
    // Add click-to-call functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            showNotification('Initiating call...', 'info');
        });
    });
}

function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Contact form submission:', data);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending message...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('🎉 Thank you! We\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Pricing Page Functions
function initPricingPage() {
    console.log('Initializing pricing page...');
    initPricingToggle();
    initPricingAnimations();
}

function initPricingToggle() {
    const pricingToggle = document.getElementById('pricing-toggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (!pricingToggle) return;
    
    pricingToggle.addEventListener('change', function() {
        isYearlyPricing = this.checked;
        updatePricingDisplay();
    });
    
    function updatePricingDisplay() {
        pricingCards.forEach(card => {
            const amountEl = card.querySelector('.amount');
            const periodEl = card.querySelector('.period');
            const savingsEl = card.querySelector('.yearly-savings');
            
            if (amountEl && periodEl && savingsEl) {
                const monthlyPrice = amountEl.getAttribute('data-monthly');
                const yearlyPrice = amountEl.getAttribute('data-yearly');
                
                if (isYearlyPricing) {
                    const monthlyEquivalent = Math.floor(parseInt(yearlyPrice) / 12);
                    amountEl.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        amountEl.textContent = monthlyEquivalent;
                        amountEl.style.transform = 'scale(1)';
                        periodEl.textContent = '/month (billed yearly)';
                        savingsEl.classList.add('show');
                    }, 150);
                } else {
                    amountEl.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        amountEl.textContent = monthlyPrice;
                        amountEl.style.transform = 'scale(1)';
                        periodEl.textContent = '/month';
                        savingsEl.classList.remove('show');
                    }, 150);
                }
            }
        });
        
        showNotification(`Switched to ${isYearlyPricing ? 'yearly' : 'monthly'} pricing`, 'info');
    }
}

function initPricingAnimations() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'scale(1.05) translateY(0)';
            }
        });
    });
}

// Dashboard Functions
function initDashboard() {
    console.log('Initializing dashboard...');
    
    setTimeout(() => {
        animateKPICounters();
        initDashboardSidebar();
        initActionButtons();
        initDashboardAnimations();
        initAnalyticsCharts();
        initSettings();
    }, 200);
}

function animateKPICounters() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(kpi => {
        const text = kpi.textContent;
        const numberMatch = text.match(/[\d,]+/);
        if (numberMatch) {
            const number = parseInt(numberMatch[0].replace(/,/g, ''));
            const hasComma = text.includes(',');
            const hasPercent = text.includes('%');
            const hasDollar = text.includes('$');
            
            let prefix = hasDollar ? '$' : '';
            let suffix = hasPercent ? '%' : '';
            
            animateCounter(kpi, 0, number, 2000, prefix, suffix, hasComma);
        }
    });
}

function initDashboardSidebar() {
    const sidebarLinks = document.querySelectorAll('.nav-item-link[data-section]');
    const dashboardSections = document.querySelectorAll('.dashboard-section[data-section]');
    
    console.log('Found sidebar links:', sidebarLinks.length);
    console.log('Found dashboard sections:', dashboardSections.length);
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            console.log('Switching to dashboard section:', targetSection);
            
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            dashboardSections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSectionEl = document.querySelector(`.dashboard-section[data-section="${targetSection}"]`);
            if (targetSectionEl) {
                targetSectionEl.classList.add('active');
                console.log('Successfully switched to section:', targetSection);
                
                if (targetSection === 'agents') {
                    initAgentPerformance();
                } else if (targetSection === 'analytics') {
                    setTimeout(initAnalyticsCharts, 100);
                } else if (targetSection === 'settings') {
                    setTimeout(initSettings, 100);
                }
                
                showNotification(`Switched to ${targetSection} section`, 'success');
            } else {
                console.error('Section not found:', targetSection);
                showNotification(`${targetSection} section coming soon!`, 'info');
            }
        });
    });
    
    const placeholderLinks = document.querySelectorAll('.nav-item-link:not([data-section])');
    placeholderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent.trim();
            showNotification(`${linkText} section coming soon!`, 'info');
        });
    });
}

function initAnalyticsCharts() {
    console.log('Initializing analytics charts...');
    
    // Performance Chart
    const performanceCtx = document.getElementById('performance-chart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Calls Made',
                    data: [45, 52, 38, 67, 73, 41, 28],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Successful Conversions',
                    data: [12, 15, 9, 19, 23, 11, 8],
                    borderColor: '#4FB946',
                    backgroundColor: 'rgba(79, 185, 70, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Conversion Chart
    const conversionCtx = document.getElementById('conversion-chart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Personal Injury', 'Family Law', 'Business Law', 'Criminal Defense', 'Estate Planning'],
                datasets: [{
                    data: [35, 25, 18, 12, 10],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#4FB946'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

function initSettings() {
    console.log('Initializing settings functionality...');
    
    // Settings tabs
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.getAttribute('data-tab');
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            settingsPanels.forEach(panel => panel.classList.remove('active'));
            
            const targetPanelEl = document.querySelector(`.settings-panel[data-panel="${targetPanel}"]`);
            if (targetPanelEl) {
                targetPanelEl.classList.add('active');
                showNotification(`Switched to ${targetPanel} settings`, 'info');
            }
        });
    });
    
    // Settings form handlers
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    });
    
    // Integration buttons
    const integrationBtns = document.querySelectorAll('.integration-actions .btn');
    integrationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.toLowerCase();
            if (btnText.includes('connect')) {
                showNotification('Connecting integration...', 'info');
                setTimeout(() => {
                    showNotification('Integration connected successfully!', 'success');
                }, 2000);
            } else if (btnText.includes('configure')) {
                showNotification('Opening integration settings...', 'info');
            }
        });
    });
    
    // Notification toggles
    const notificationToggles = document.querySelectorAll('.notification-toggle input');
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.closest('.notification-item').querySelector('h5').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${label} notifications ${status}`, 'success');
        });
    });
    
    // Team management
    const teamBtns = document.querySelectorAll('.team-actions .btn, .member-actions .btn');
    teamBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.toLowerCase();
            if (btnText.includes('invite')) {
                showNotification('Opening team invitation form...', 'info');
            } else if (btnText.includes('edit')) {
                showNotification('Opening team member editor...', 'info');
            }
        });
    });
    
    // Billing actions
    const billingBtns = document.querySelectorAll('.billing-actions .btn');
    billingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.toLowerCase();
            if (btnText.includes('upgrade')) {
                navigateToPage('pricing', true);
            } else if (btnText.includes('payment')) {
                showNotification('Opening payment method settings...', 'info');
            }
        });
    });
}

function initAgentPerformance() {
    const agentCards = document.querySelectorAll('.agent-card');
    agentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('svg');
            if (icon) {
                if (icon.innerHTML.includes('22 16.92')) {
                    showNotification('Initiating call...', 'info');
                } else if (icon.innerHTML.includes('4 4h16c1.1')) {
                    showNotification('Opening email composer...', 'info');
                }
            }
        });
    });

    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showNotification('Data refreshed for ' + this.textContent.toLowerCase() + ' view', 'success');
        });
    });
}

function initDashboardAnimations() {
    const dashboardCards = document.querySelectorAll('.kpi-card, .leads-card, .agent-card');
    dashboardCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// How It Works Functions
function initHowItWorks() {
    console.log('Initializing How It Works page...');
    
    setTimeout(() => {
        initWorkflowNavigation();
        initProgressSteps();
        initWorkflowAnimations();
    }, 300);
}

function initWorkflowNavigation() {
    console.log('Setting up workflow navigation...');
    
    const prevBtn = document.querySelector('.workflow-nav-btn.prev');
    const nextBtn = document.querySelector('.workflow-nav-btn.next');
    
    if (!prevBtn || !nextBtn) {
        console.error('Workflow navigation buttons not found');
        return;
    }
    
    let currentStep = 1;
    const totalSteps = 4;

    function updateWorkflowStep(step) {
        console.log('Updating workflow step to:', step);
        
        document.querySelectorAll('.workflow-detail').forEach(detail => {
            detail.classList.remove('active');
        });

        const currentDetail = document.querySelector(`.workflow-detail[data-step="${step}"]`);
        if (currentDetail) {
            currentDetail.classList.add('active');
        }

        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            const stepNumber = index + 1;
            progressStep.classList.remove('active', 'completed');
            
            if (stepNumber === step) {
                progressStep.classList.add('active');
            } else if (stepNumber < step) {
                progressStep.classList.add('completed');
            }
        });

        prevBtn.disabled = step === 1;
        nextBtn.disabled = step === totalSteps;
        
        nextBtn.textContent = step === totalSteps ? 'Finished' : 'Next Step';
        currentStep = step;
    }

    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newPrevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            updateWorkflowStep(currentStep - 1);
        }
    });

    newNextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            updateWorkflowStep(currentStep + 1);
        } else {
            showNotification('Workflow complete! Ready to start your free trial?', 'success');
        }
    });

    updateWorkflowStep(1);
}

function initProgressSteps() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        const newStep = step.cloneNode(true);
        step.parentNode.replaceChild(newStep, step);
        
        newStep.addEventListener('click', () => {
            const stepNumber = index + 1;
            
            document.querySelectorAll('.workflow-detail').forEach(detail => {
                detail.classList.remove('active');
            });

            const targetDetail = document.querySelector(`.workflow-detail[data-step="${stepNumber}"]`);
            if (targetDetail) {
                targetDetail.classList.add('active');
            }

            document.querySelectorAll('.progress-step').forEach((progressStep, i) => {
                const currentStepNumber = i + 1;
                progressStep.classList.remove('active', 'completed');
                
                if (currentStepNumber === stepNumber) {
                    progressStep.classList.add('active');
                } else if (currentStepNumber < stepNumber) {
                    progressStep.classList.add('completed');
                }
            });

            const prevBtn = document.querySelector('.workflow-nav-btn.prev');
            const nextBtn = document.querySelector('.workflow-nav-btn.next');
            
            if (prevBtn) prevBtn.disabled = stepNumber === 1;
            if (nextBtn) {
                nextBtn.disabled = stepNumber === 4;
                nextBtn.textContent = stepNumber === 4 ? 'Finished' : 'Next Step';
            }
        });
    });
}

function initWorkflowAnimations() {
    const workflowVisuals = document.querySelectorAll('.workflow-detail-visual');
    const visualObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visual');
            }
        });
    }, { threshold: 0.3 });

    workflowVisuals.forEach(visual => {
        visualObserver.observe(visual);
    });
}

// Modal Functionality
function initModalFunctionality() {
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalCloses.forEach(close => {
        close.addEventListener('click', () => closeModal());
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Handle form submissions
    const freeTrialForm = document.getElementById('free-trial-form');
    if (freeTrialForm) {
        freeTrialForm.addEventListener('submit', handleFreeTrialSubmission);
    }
    
    const contactModalForm = document.getElementById('contact-modal-form');
    if (contactModalForm) {
        contactModalForm.addEventListener('submit', handleContactModalSubmission);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal();
            }
        }
    });
}

function openFreeTrialModal(selectedPlan = null) {
    const modal = document.getElementById('free-trial-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (selectedPlan) {
            console.log('Pre-selecting plan:', selectedPlan);
            showNotification(`Starting free trial for ${selectedPlan} plan`, 'info');
        }
    }
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function handleFreeTrialSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Free trial submission:', data);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Setting up your trial...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showNotification('🎉 Welcome to Bindle! Your free trial is now active. Check your email for setup instructions.', 'success');
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleContactModalSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Contact modal submission:', data);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Scheduling call...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showNotification('🎉 Call scheduled! We\'ll contact you within 24 hours to confirm your appointment.', 'success');
        
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Button Handlers
function initButtonHandlers() {
    console.log('Initializing button handlers...');
    
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button, .btn');
        if (!button) return;
        
        if (button.hasAttribute('data-page')) {
            return;
        }

        const action = button.getAttribute('data-action');
        const buttonText = button.textContent.trim();
        
        console.log('Button clicked:', buttonText, 'Action:', action);
        
        if (action === 'start-free-trial' || buttonText.includes('Start Free Trial') || buttonText.includes('Start Your Free Trial') || buttonText.includes('Start Free Pilot')) {
            e.preventDefault();
            const selectedPlan = button.getAttribute('data-plan');
            openFreeTrialModal(selectedPlan);
        } else if (action === 'listen-demo' || buttonText.includes('Watch Demo') || buttonText.includes('Schedule Demo') || buttonText.includes('Listen to Demo Call')) {
            e.preventDefault();
            handleListenDemo();
        } else if (buttonText.includes('View All')) {
            e.preventDefault();
            showNotification('Opening full leads list...', 'info');
        } else if (buttonText.includes('See Detailed Process')) {
            e.preventDefault();
            console.log('See Detailed Process clicked - navigating to how-it-works');
            navigateToPage('how-it-works', true);
        } else if (buttonText.includes('View Dashboard')) {
            e.preventDefault();
            console.log('View Dashboard clicked - navigating to dashboard');
            navigateToPage('dashboard', true);
        }
    });
}

function handleListenDemo() {
    console.log('Handling listen demo...');
    
    if (currentPage !== 'home') {
        navigateToPage('home', true);
        setTimeout(() => {
            const demoPlayer = document.querySelector('.demo-player');
            if (demoPlayer) {
                demoPlayer.scrollIntoView({ behavior: 'smooth' });
                showNotification('🎧 Voice demo is ready! Click play to listen.', 'info');
            }
        }, 500);
    } else {
        const demoPlayer = document.querySelector('.demo-player');
        if (demoPlayer) {
            demoPlayer.scrollIntoView({ behavior: 'smooth' });
            showNotification('🎧 Voice demo is ready! Click play to listen.', 'info');
        } else {
            showNotification('Demo player not available', 'error');
        }
    }
}

// Utility Functions
function animateCounter(element, start, end, duration, prefix = '', suffix = '', useCommas = false) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        let displayValue = useCommas ? current.toLocaleString() : current.toString();
        element.textContent = prefix + displayValue + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4FB946' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-size: 14px;
        line-height: 1.4;
    `;

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([data-page])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#signup' && href !== '#demo') {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '&#9776;';
    mobileMenuToggle.className = 'mobile-menu-toggle';

    const navContainer = document.querySelector('.navbar .container');
    if (navContainer) {
        navContainer.appendChild(mobileMenuToggle);
    }

    mobileMenuToggle.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        const navLinks = document.querySelector('.nav-links');
        const isNavLink = e.target.closest('.nav-links');
        const isToggle = e.target.closest('.mobile-menu-toggle');
        
        if (!isNavLink && !isToggle && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
        
        if (isNavLink && (e.target.classList.contains('nav-link') || e.target.classList.contains('btn'))) {
            if (navLinks) navLinks.classList.remove('active');
        }
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.workflow-step, .feature-card, .result-item, .stat-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Handle browser back/forward buttons
function initBrowserNavigation() {
    window.addEventListener('popstate', function(e) {
        const currentHash = window.location.hash.substring(1) || 'home';
        navigateToPage(currentHash, false);
    });
}

// Add required CSS for animations and mobile menu
function addRequiredStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .workflow-step,
        .feature-card,
        .result-item,
        .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .workflow-detail-visual {
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .workflow-detail-visual.animate-visual {
            opacity: 1;
            transform: scale(1);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255,255,255,0.2);
        }
        
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--color-text);
            padding: 8px;
        }
        
        .caller-bubble {
            background: #e1e5e9;
            color: var(--color-text);
            align-self: flex-end;
            margin-left: 20%;
        }
        
        .caller-bubble .speaker-label {
            color: var(--color-text-secondary);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            .nav-links {
                display: none !important;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column !important;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-top: 1px solid #e9ecef;
            }
            .nav-links.active {
                display: flex !important;
            }
            .nav-links .btn {
                margin-top: 16px;
            }
            .nav-links a {
                padding: 12px 16px;
                border-radius: 6px;
                margin: 4px 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-links.active');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        const modal = document.querySelector('.modal.active');
        if (modal) {
            closeModal();
        }
    }
    
    const howItWorksPage = document.querySelector('#how-it-works-page.active');
    if (howItWorksPage) {
        if (e.key === 'ArrowLeft') {
            const prevBtn = document.querySelector('.workflow-nav-btn.prev');
            if (prevBtn && !prevBtn.disabled) {
                prevBtn.click();
            }
        } else if (e.key === 'ArrowRight') {
            const nextBtn = document.querySelector('.workflow-nav-btn.next');
            if (nextBtn && !nextBtn.disabled) {
                nextBtn.click();
            }
        }
    }
});

// Export functions for external use
window.BindleApp = {
    navigateTo: navigateToPage,
    showNotification: showNotification,
    getCurrentPage: () => currentPage,
    openFreeTrialModal: openFreeTrialModal,
    openContactModal: openContactModal
};

// Performance optimization
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('Bindle application fully loaded');
});

// Handle connection status
window.addEventListener('online', () => console.log('Connection restored'));
window.addEventListener('offline', () => console.log('Connection lost'));