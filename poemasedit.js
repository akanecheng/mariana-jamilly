// Garante a inicialização do Firebase com as credenciais
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

// Buscar poemas em tempo real do Firestore
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
            
            // Tratamento de aspas para não quebrar o HTML interno
            const tituloLimpo = (poema.titulo || '').replace(/"/g, '&quot;');
            const textoLimpo = (poema.texto || '').replace(/"/g, '&quot;');
            const autorLimpo = autor.replace(/"/g, '&quot;');

            card.innerHTML = `
                <div>
                    <h3>${poema.titulo || ''}</h3>
                    <p>${(poema.texto || '').replace(/\n/g, '<br>')}</p>
                    <small style="color: #7B141E; font-style: italic;">— ${autor}</small>
                </div>
                <div class="card-acoes" style="margin-top: 15px;">
                    <button class="btn-acao btn-editar" data-id="${doc.id}">Editar</button>
                    <button class="btn-acao btn-excluir" data-id="${doc.id}">Excluir</button>
                </div>
            `;

            // Adiciona evento ao botão Editar
            card.querySelector('.btn-editar').addEventListener('click', () => {
                prepararEdicao(doc.id, poema.titulo || '', poema.texto || '', autor);
            });

            // Adiciona evento ao botão Excluir
            card.querySelector('.btn-excluir').addEventListener('click', () => {
                excluirPoema(doc.id);
            });

            container.appendChild(card);
        });
    }, (erro) => {
        console.error("Erro ao buscar poemas:", erro);
    });
}

// Salvar ou Atualizar Poema
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

// Iniciar a busca ao carregar a página
document.addEventListener('DOMContentLoaded', escutarPoemas);