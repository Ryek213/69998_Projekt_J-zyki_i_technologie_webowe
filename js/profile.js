const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');
const profileSection = document.getElementById('profile-section');
const changeUsernameForm = document.getElementById('change-username-form');
const changePasswordForm = document.getElementById('change-password-form');
const profileMsg = document.getElementById('profile-msg');
const logoutBtn = document.getElementById('logout-button');

function switchToProfile() {
        loginSection.style.display = 'none';
        profileSection.style.display = 'block';
}

function switchToLogin() {
        loginSection.style.display = 'block';
        profileSection.style.display = 'none';
}

loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username-login').value.trim();
        const password = document.getElementById('password-login').value;

        try {
                const response = await fetch(
                        `${supabase.url}/rest/v1/users?username=eq.${username}`,
                        {
                                headers: {
                                        'apikey': supabase.key,
                                        'Authorization': `Bearer ${supabase.key}`
                                }
                        }
                )
                const data = await response.json();

                if (data.length === 0) {
                        loginMsg.textContent = "Użytkownik nie istnieje lub błędne hasło";
                        return;
                }

                const user = data[0];

                if (user.password !== password) {
                        loginMsg.textContent = "Użytkownik nie istnieje lub błędne hasło";
                        return;
                }

                currentUser = user;
                setSavedUser(currentUser);
                switchToProfile();
        } catch (error) {
                console.error(error);
                loginMsg.textContent = "Błąd logowania";
        }
});

changeUsernameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const newUsername = document.getElementById('username').value.trim();

        if (newUsername === currentUser.username) {
                profileMsg.textContent = "Nazwa użytkownika nie może być taka sama!";
                return;
        }

        const updateData = { };
        if (newUsername) updateData.username = newUsername;

        try {
                const response = await fetch(
                        `${supabase.url}/rest/v1/users?id=eq.${currentUser.id}`,
                        {
                                method: 'PATCH',
                                headers: {
                                        'apikey': supabase.key,
                                        'Authorization': `Bearer ${supabase.key}`,
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updateData)
                        }
                );
                if (!response.ok) throw new Error("Nie udało się zaktualizować nazwy użytkownika");

                profileMsg.textContent = 'Nazwa użytkownika została zaktualizowane!';
                currentUser.username = newUsername;
                setSavedUser(currentUser);
        } catch (error) {
                console.error(error);
                profileMsg.textContent = "Błąd aktualizacji nazwy użytkownika"
        }
});

changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const newPassword = document.getElementById('password').value;

        if (newPassword === currentUser.password) {
                profileMsg.textContent = "Hasło nie może być takie same!";
                return;
        }

        const updateData = { };
        if (newPassword) updateData.password = newPassword;

        try {
                const response = await fetch(
                        `${supabase.url}/rest/v1/users?id=eq.${currentUser.id}`,
                        {
                                method: 'PATCH',
                                headers: {
                                        'apikey': supabase.key,
                                        'Authorization': `Bearer ${supabase.key}`,
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updateData)
                        }
                );
                if (!response.ok) throw new Error("Nie udało się zaktualizować hasła");

                profileMsg.textContent = 'Hasło zostało zaktualizowane!';
                currentUser.password = newPassword;
                setSavedUser(currentUser);
        } catch (error) {
                console.error(error);
                profileMsg.textContent = "Błąd aktualizacji hasła"
        }
});

logoutBtn.addEventListener('click', () => {
        document.getElementById('username-login').value = currentUser.username;
        document.getElementById('password-login').value = '';
        loginMsg.textContent = '';
        currentUser = null;
        setSavedUser(currentUser);
        switchToLogin();
})

function init() {
        if (currentUser) {
                switchToProfile();
        }
}

init()