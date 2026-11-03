// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDOOPrODo46x_VqXNUdvwq38WYK1TCkJXA",
    authDomain: "mariana-jamilly.firebaseapp.com",
    projectId: "mariana-jamilly",
    storageBucket: "mariana-jamilly.firebasestorage.app",
    messagingSenderId: "983935199953",
    appId: "1:983935199953:web:7b83c279b809056218b3f0"
};

// ==========================================
// ADMINISTRATORS
// ==========================================

const EMAILS_ADM = [
    "polyanadesn02@gmail.com",
    "polyanadesouzaneves2@gmail.com",
    "polyanadesouza02@gmail.com",
    "marianajamillynevesdeoliveira@gmail.com",
    "mahmajamilly@gmail.com"
].map(e => e.toLowerCase().trim());

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Configura persistência local para manter o login ao navegar entre páginas
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
    console.error("Erro na persistência:", error);
});

// ==========================================
// LOAD FIRESTORE CONTENT
// ==========================================

function carregarEAtualizarIndex() {
    const colecoes = ['hero', 'perfilSecundario', 'bio', 'livro', 'devocional'];

    colecoes.forEach(col => {
        db.collection(col).onSnapshot(snapshot => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                atualizarDOM(col, data);
            }
        }, err => {
            console.error(`Erro ao carregar ${col}:`, err);
        });
    });
}

// ==========================================
// UPDATE INDEX CONTENT
// ==========================================

function atualizarDOM(secao, data) {
    if (secao === 'hero') {
        const titulo = document.getElementById('viewHeroTitulo');
        const autora = document.getElementById('viewHeroAutora');
        const imagem = document.getElementById('viewHeroImg');

        if (data.titulo && titulo) titulo.innerText = data.titulo;
        if (data.autora && autora) autora.innerText = data.autora;
        if (data.imagem && imagem) imagem.src = data.imagem;
    }

    if (secao === 'perfilSecundario') {
        const titulo = document.getElementById('viewPerfilSecundarioTitulo');
        const imagem = document.getElementById('viewPerfilSecundarioImg');
        const container = document.getElementById('viewPerfilSecundarioParagrafos');

        if (data.titulo && titulo) titulo.innerText = data.titulo;
        if (data.imagem && imagem) imagem.src = data.imagem;

        if (Array.isArray(data.paragrafos) && container) {
            container.innerHTML = data.paragrafos.map(p => `<p>${p}</p>`).join('');
        }
    }

    if (secao === 'bio') {
        const titulo = document.getElementById('viewBioTitulo');
        const container = document.getElementById('viewBioParagrafos');

        if (data.titulo && titulo) titulo.innerText = data.titulo;

        if (Array.isArray(data.paragrafos) && container) {
            container.innerHTML = data.paragrafos.map(p => `<p>${p}</p>`).join('');
        }
    }

    if (secao === 'livro') {
        const titulo = document.getElementById('viewLivroTitulo');
        const descricao = document.getElementById('viewLivroDescricao');
        const botao = document.getElementById('viewLivroBtn');
        const imagem = document.getElementById('viewLivroImg');

        if (data.titulo && titulo) titulo.innerText = data.titulo;
        if (data.descricao && descricao) descricao.innerText = data.descricao;
        if (data.link && botao) botao.href = data.link;
        if (data.imagem && imagem) imagem.src = data.imagem;
    }

    if (secao === 'devocional') {
        const titulo = document.getElementById('viewDevocionalTitulo');
        const botao = document.getElementById('viewDevocionalBtn');
        const container = document.getElementById('viewDevocionalParagrafos');

        if (data.titulo && titulo) titulo.innerText = data.titulo;
        if (data.link && botao) botao.href = data.link;

        if (Array.isArray(data.paragrafos) && container) {
            container.innerHTML = data.paragrafos.map(p => `<p>${p}</p>`).join('');
        }
    }
}

// ==========================================
// MOBILE MENU
// ==========================================

function configurarMenuMobile() {
    const btnMobile = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    const menuIcon = document.getElementById('menu-icon');

    if (!btnMobile || !navList) return;

    btnMobile.addEventListener('click', () => {
        navList.classList.toggle('hidden');
        if (menuIcon) {
            if (navList.classList.contains('hidden')) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars-staggered');
            } else {
                menuIcon.classList.remove('fa-bars-staggered');
                menuIcon.classList.add('fa-xmark');
            }
        }
    });

    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!navList.classList.contains('hidden')) {
                navList.classList.add('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars-staggered');
                }
            }
        });
    });
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

function configurarAdministrador() {
    auth.onAuthStateChanged(usuario => {
        const linkAdmin = document.getElementById('link-admin');
        const linkAdminMobile = document.getElementById('link-admin-mobile');

        if (usuario) {
            const email = usuario.email ? usuario.email.toLowerCase().trim() : '';
            const ehAdmin = EMAILS_ADM.includes(email);

            console.log('>>> E-mail logado com sucesso:', email);
            console.log('>>> É administrador?', ehAdmin);

            if (linkAdmin) linkAdmin.style.display = ehAdmin ? 'block' : 'none';
            if (linkAdminMobile) linkAdminMobile.style.display = ehAdmin ? 'block' : 'none';
        } else {
            console.log('>>> Nenhum usuário logado no momento.');
            if (linkAdmin) linkAdmin.style.display = 'none';
            if (linkAdminMobile) linkAdminMobile.style.display = 'none';
        }
    });
}

// ==========================================
// INITIALIZE PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    carregarEAtualizarIndex();
    configurarMenuMobile();
    configurarAdministrador();
});