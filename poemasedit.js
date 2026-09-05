// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCEggZoP5vk1JENjO8701pAFdBIBPB8gPQ",
    authDomain: "somos-mulheres-em-movimento.firebaseapp.com",
    projectId: "somos-mulheres-em-movimento",
    storageBucket: "somos-mulheres-em-movimento.firebasestorage.app",
    messagingSenderId: "427525655209",
    appId: "1:427525655209:web:cc00a592936dbd3df9f7b8"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Menu Mobile
const mobileMenuBtn = document.getElementById('mobile-menu');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        document.getElementById('nav-list').classList.toggle('active');
    });
}

// Renderiza a lista de poemas no painel
function escutarPoemas() {
    db.collection("poemas").orderBy("criadoEm", "desc").onSnapshot((snapshot) => {
        const container = document.getElementById('poemasContainer');
        if (!container) return;
        
        container.innerHTML = '';
        if (snapshot.empty) {
            container.innerHTML = '<p style="color: #777;">Nenhum poema encontrado no banco de dados.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const poema = doc.data();
            const autor = poema.assinatura ? poema.assinatura : 'Mariana Jamilly';
            const card = document.createElement('div');
            card.className = 'card-gerenciar';
            
            card.innerHTML = `
                <div>
                    <h3>${poema.titulo || 'Sem título'}</h3>
                    <p>${(poema.texto || '').replace(/\n/g, '<br>')}</p>
                    <small style="color: #7B141E; font-style: italic;">— ${autor}</small>
                </div>
                <div class="card-acoes" style="margin-top: 15px;">
                    <button class="btn-acao btn-editar">Editar</button>
                    <button class="btn-acao btn-excluir">Excluir</button>
                </div>
            `;

            // Ação de editar
            card.querySelector('.btn-editar').addEventListener('click', () => {
                prepararEdicao(doc.id, poema.titulo || '', poema.texto || '', autor);
            });

            // Ação de excluir
            card.querySelector('.btn-excluir').addEventListener('click', () => {
                excluirPoema(doc.id);
            });

            container.appendChild(card);
        });
    }, (erro) => {
        console.error("Erro ao carregar poemas:", erro);
    });
}

// Salvar ou Atualizar Poema no Firebase
const poemaForm = document.getElementById('poemaForm');
if (poemaForm) {
    poemaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('poemaId').value;
        const titulo = document.getElementById('tituloPoema').value;
        const texto = document.getElementById('conteudoPoema').value;
        const assinatura = document.getElementById('assinaturaPoema').value || 'Mariana Jamilly';
        const btnSalvar = document.getElementById('btnSalvar');

        btnSalvar.disabled = true;
        btnSalvar.innerText = "Salvando...";

        try {
            if (id) {
                await db.collection("poemas").doc(id).update({
                    titulo: titulo,
                    texto: texto,
                    assinatura: assinatura
                });
            } else {
                await db.collection("poemas").add({
                    titulo: titulo,
                    texto: texto,
                    assinatura: assinatura,
                    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            limparFormulario();
        } catch (erro) {
            alert("Erro ao salvar poema: " + erro.message);
        } finally {
            btnSalvar.disabled = false;
        }
    });
}

function prepararEdicao(id, titulo, texto, assinatura) {
    document.getElementById('poemaId').value = id;
    document.getElementById('tituloPoema').value = titulo;
    document.getElementById('conteudoPoema').value = texto;
    document.getElementById('assinaturaPoema').value = assinatura || 'Mariana Jamilly';
    document.getElementById('form-titulo').innerText = "Editar Poema";
    document.getElementById('btnSalvar').innerText = "Salvar Alterações";
    document.getElementById('btnCancelar').style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function excluirPoema(id) {
    if (confirm("Tem certeza que deseja excluir este poema?")) {
        try {
            await db.collection("poemas").doc(id).delete();
        } catch (erro) {
            alert("Erro ao excluir poema: " + erro.message);
        }
    }
}

function limparFormulario() {
    document.getElementById('poemaId').value = '';
    document.getElementById('tituloPoema').value = '';
    document.getElementById('conteudoPoema').value = '';
    document.getElementById('assinaturaPoema').value = 'Mariana Jamilly';
    document.getElementById('form-titulo').innerText = "Escrever Novo Poema";
    document.getElementById('btnSalvar').innerText = "Publicar Poema";
    document.getElementById('btnCancelar').style.display = "none";
}

const btnCancelar = document.getElementById('btnCancelar');
if (btnCancelar) {
    btnCancelar.addEventListener('click', limparFormulario);
}

document.addEventListener('DOMContentLoaded', escutarPoemas);