
        const db = firebase.firestore();

        // Menu Mobile
        document.getElementById('mobile-menu').addEventListener('click', () => {
            document.getElementById('nav-list').classList.toggle('active');
        });

        // Buscar poemas em tempo real
        function escutarPoemas() {
            db.collection("poemas").orderBy("criadoEm", "desc").onSnapshot((snapshot) => {
                const container = document.getElementById('poemasContainer');
                container.innerHTML = '';

                if (snapshot.empty) {
                    container.innerHTML = '<p style="color: #777;">Nenhum poema encontrado no banco de dados.</p>';
                    return;
                }

                snapshot.forEach((doc) => {
                    const poema = doc.data();
                    const card = document.createElement('div');
                    card.className = 'card-gerenciar';
                    card.innerHTML = `
                        <div>
                            <h3>${poema.titulo}</h3>
                            <p>${poema.texto.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="card-acoes">
                            <button class="btn-acao btn-editar" onclick="prepararEdicao('${doc.id}', \`${poema.titulo.replace(/'/g, "\\'")}\`, \`${poema.texto.replace(/`/g, "\\`")}\`)">Editar</button>
                            <button class="btn-acao btn-excluir" onclick="excluirPoema('${doc.id}')">Excluir</button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }, (erro) => {
                console.error("Erro ao buscar poemas:", erro);
            });
        }

        // Criar ou Atualizar Poema
        document.getElementById('poemaForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('poemaId').value;
            const titulo = document.getElementById('tituloPoema').value;
            const texto = document.getElementById('conteudoPoema').value;
            const btnSalvar = document.getElementById('btnSalvar');

            btnSalvar.disabled = true;
            btnSalvar.innerText = "Salvando...";

            try {
                if (id) {
                    // Atualizar poema existente
                    await db.collection("poemas").doc(id).update({
                        titulo: titulo,
                        texto: texto
                    });
                } else {
                    // Criar novo poema
                    await db.collection("poemas").add({
                        titulo: titulo,
                        texto: texto,
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

        function prepararEdicao(id, titulo, texto) {
            document.getElementById('poemaId').value = id;
            document.getElementById('tituloPoema').value = titulo;
            document.getElementById('conteudoPoema').value = texto;

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
            document.getElementById('form-titulo').innerText = "Escrever Novo Poema";
            document.getElementById('btnSalvar').innerText = "Publicar Poema";
            document.getElementById('btnCancelar').style.display = "none";
        }

        document.getElementById('btnCancelar').addEventListener('click', limparFormulario);

        // Inicializar leitura
        escutarPoemas();
    