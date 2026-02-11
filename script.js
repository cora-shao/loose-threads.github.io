// Tab management system
const tabs = {
    home_page: {
        name: 'home_page',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2v12h12V2H2zm1.5 1.5h9v9h-9v-9z"/></svg>',
        type: 'code'
    },
    course_documentation: {
        name: 'course_documentation',
        icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12v12H2V2zm1.5 1.5v9h9v-9h-9z"/></svg>',
        type: 'notion'
    }
};

let openTabs = ['home_page'];
let activeTab = 'home_page';

    // Initialize
document.addEventListener('DOMContentLoaded', () => {
    // File click handlers
    document.querySelectorAll('.file-item[data-file]').forEach(item => {
        item.addEventListener('click', (e) => {
            const fileId = item.getAttribute('data-file');
            openTab(fileId);
        });
    });

    // Tab click handlers
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab');
        if (tab) {
            const tabId = tab.getAttribute('data-tab');
            if (e.target.classList.contains('tab-close')) {
                closeTab(tabId);
            } else {
                switchTab(tabId);
            }
        }
    });

    // Activity Bar view switching (Explorer, Portfolio, etc.)
    const activityIcons = document.querySelectorAll('.activity-icon[data-view]');
    const explorerSidebar = document.getElementById('explorer-sidebar');
    const portfolioSidebar = document.getElementById('portfolio-sidebar');
    
    activityIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const view = icon.getAttribute('data-view');
            switchView(view, icon);
        });
    });
    
    function switchView(view, icon) {
        // Update activity icons
        document.querySelectorAll('.activity-icon').forEach(i => {
            i.classList.remove('active');
        });
        icon.classList.add('active');
        
        // Switch sidebars
        if (view === 'portfolio') {
            portfolioSidebar.style.display = 'flex';
            explorerSidebar.style.display = 'none';
        } else if (view === 'explorer') {
            explorerSidebar.style.display = 'flex';
            portfolioSidebar.style.display = 'none';
        }
    }

    // Portfolio section toggles (HW and Systems)
    document.querySelectorAll('.portfolio-section-header').forEach(header => {
        const toggleId = header.getAttribute('data-toggle');
        const content = document.getElementById(`${toggleId}-content`);
        const toggle = header.querySelector('.portfolio-toggle');
        
        // Initialize: sections are expanded by default (▼ means expanded)
        if (content) {
            content.style.display = 'block';
        }
        
        header.addEventListener('click', () => {
            if (!content) return;
            
            const isExpanded = content.style.display !== 'none';
            
            if (isExpanded) {
                content.style.display = 'none';
                toggle.textContent = '▶';
            } else {
                content.style.display = 'block';
                toggle.textContent = '▼';
            }
        });
    });
});

function openTab(tabId) {
    if (!tabs[tabId]) return;
    
    // If tab is already open, just switch to it
    if (openTabs.includes(tabId)) {
        switchTab(tabId);
        return;
    }
    
    // Add to open tabs
    openTabs.push(tabId);
    
    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.setAttribute('data-tab', tabId);
    tabElement.innerHTML = `
        <span class="tab-icon">${tabs[tabId].icon}</span>
        <span class="tab-name">${tabs[tabId].name}</span>
        <span class="tab-close">×</span>
    `;
    
    // Insert before the last tab (or append if no other tabs)
    const tabsContainer = document.getElementById('editor-tabs');
    tabsContainer.appendChild(tabElement);
    
    // Show content
    const content = document.querySelector(`[data-content="${tabId}"]`);
    if (content) {
        content.classList.add('active');
    }
    
    // Switch to the new tab
    switchTab(tabId);
}

function closeTab(tabId) {
    // Don't close if it's the only tab
    if (openTabs.length <= 1) return;
    
    // Remove from open tabs
    openTabs = openTabs.filter(id => id !== tabId);
    
    // Remove tab element
    const tabElement = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabElement) {
        tabElement.remove();
    }
    
    // Hide content
    const content = document.querySelector(`[data-content="${tabId}"]`);
    if (content) {
        content.classList.remove('active');
    }
    
    // If closed tab was active, switch to another tab
    if (activeTab === tabId) {
        const newActiveTab = openTabs[openTabs.length - 1];
        switchTab(newActiveTab);
    }
}

function switchTab(tabId) {
    if (!openTabs.includes(tabId)) return;
    
    activeTab = tabId;
    
    // Update tab active states
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update content active states
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.getAttribute('data-content') === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update file item active states in Explorer
    document.querySelectorAll('.file-item[data-file]').forEach(item => {
        if (item.getAttribute('data-file') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
