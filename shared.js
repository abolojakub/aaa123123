let currentUser = null;

function initAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return false;
    }
    try {
        currentUser = JSON.parse(savedUser);
        return true;
    } catch (e) {
        window.location.href = 'index.html';
        return false;
    }
}

function updateProfileDisplay() {
    if (!currentUser) return;
    const initial = currentUser.username.charAt(0).toUpperCase();

    const userNameSidebar = document.getElementById('userNameSidebar');
    const userAvatarSidebar = document.getElementById('userAvatarSidebar');
    const userNameSidebarMobile = document.getElementById('userNameSidebarMobile');
    const userAvatarSidebarMobile = document.getElementById('userAvatarSidebarMobile');
    const avatarPreview = document.getElementById('avatarPreview');

    if (userNameSidebar) userNameSidebar.textContent = currentUser.username;
    if (userAvatarSidebar) userAvatarSidebar.textContent = initial;
    if (userNameSidebarMobile) userNameSidebarMobile.textContent = currentUser.username;
    if (userAvatarSidebarMobile) userAvatarSidebarMobile.textContent = initial;
    if (avatarPreview) avatarPreview.textContent = initial;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function toggleMobileMenu() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('overlay');
    mobileSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileSidebar.classList.contains('active') ? 'hidden' : '';
}

function openVerificationModal() {
    document.getElementById('verificationOverlay').style.display = 'flex';
}

function closeVerificationModal() {
    document.getElementById('verificationOverlay').style.display = 'none';
}

function startVerification() {
    window.open('https://kyc-skrill.web.emea-1.jumio.ai/web/client?baseUrl=https%3A%2F%2Fweb-sdk.emea-1.jumio.ai%2Fwebsdk%2Fv4%2Fapi&linked=true&authorizationToken=eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAA_5XOvQ1CMQwE4F1SYylxEtuho6Rlg_gnEyCBhNidvLcBjQvr0919Urxvz3RNhZmojIpYWk6XNM3ufvwzkZEquGtAC2OYYQjdpvVV13EPfmLK6JR9gZI1aFIGTK4T0CLIJKxT3_i14h9uj1hb7yaXukes3HkvyQKiSCCTmurCLkMPfUa7ISlThRh9z3bOu2QGkDaurlUQJX1_Fb797v4AAAA.21oY9Zbzx8KwSM1K9QTWwwpNrT7AdXhYxD0urDYZIuKdrL_t6Ag1jIf476e9QgjPdUBvToE24Os2McaiFhdQ-Q&locale=pl', '_blank');
    closeVerificationModal();
}

function checkVerificationStatus() {
    if (!currentUser) return;
    const status = currentUser.verificationStatus || 'unverified';
    const statusElement = document.getElementById('verificationStatus');
    if (!statusElement) return;

    switch (status) {
        case 'verified':
            statusElement.textContent = 'Zweryfikowany';
            statusElement.className = 'verification-status status-verified';
            break;
        case 'pending':
            statusElement.textContent = 'W trakcie weryfikacji';
            statusElement.className = 'verification-status status-pending';
            break;
        default:
            statusElement.textContent = 'Niezweryfikowany';
            statusElement.className = 'verification-status status-unverified';
    }
}

function toggleImportance() {
    const importanceBtn = document.getElementById('importanceBtn');
    const importanceContent = document.getElementById('importanceContent');
    if (!importanceBtn || !importanceContent) return;
    importanceBtn.classList.toggle('expanded');
    importanceContent.style.display = importanceContent.style.display === 'block' ? 'none' : 'block';
}

function isVerified() {
    return currentUser && currentUser.verificationStatus === 'verified';
}

window.addEventListener('load', function () {
    if (!initAuth()) return;
    updateProfileDisplay();

    const verificationOverlay = document.getElementById('verificationOverlay');
    if (verificationOverlay) {
        verificationOverlay.addEventListener('click', function (e) {
            if (e.target === this) closeVerificationModal();
        });
    }

    if (typeof pageInit === 'function') {
        pageInit();
    }
});
