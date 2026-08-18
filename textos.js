 const firebaseConfig = {
            apiKey: "AIzaSyDOOPrODo46x_VqXNUdvwq38wYK1TCkJXA",
            authDomain: "mariana-jamilly.firebaseapp.com",
            projectId: "mariana-jamilly",
            storageBucket: "mariana-jamilly.firebasestorage.app",
            messagingSenderId: "983935199953",
            appId: "1:983935199953:web:7b83c279b809056218b3f0",
            databaseURL: "https://mariana-jamilly-default-rtdb.firebaseio.com" // Ajuste a URL do RTDB se for diferente
        };

        // Inicialização
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.database();

        // Parágrafos Padrão
        const padraoPerfil = [
            'Eu sei como é a sensação de estar cercada de pessoas, mas ainda assim sentir que ninguém realmente entende o que se passa no silêncio da sua alma. Sei o que é tentar dar conta de tudo das expectativas, da rotina, dos papéis que lhe impõem e, ao final do dia, sentir um vazio que nenhuma conquista parece preencher..',
            'Muitas vezes, nós nos perdemos tentando nos encontrar no mundo e acabamos esquecendo da mulher que Deus planejou. Você talvez sinta que está apenas sobrevivendo, "secando" por dentro, enquanto tenta se encontrar.',
            'Mas quero te dizer algo que mudou a minha vida: a sua identidade está em Cristo Jesus. Você não foi feita para correr atrás das coisas deste mundo; você foi feita para desfrutar do amor de Deus.',
            'Talvez o cansaço e o vazio que você sente sejam, na verdade, a sua alma clamando pela presença de Deus. Se você já tentou de tudo, está cansada de viver assim e deseja desfrutar do que Deus já preparou para você, eu te convido a caminhar comigo nesta jornada de autoconhecimento, evolução espiritual, reencontro e realização.'
        ];

        const padraoBio = [
            'Olá, eu sou Mariana Jamilly. Sou escritora, mas, acima de tudo, uma mulher que decidiu viver a plenitude prometida por Jesus.',
            'Minha jornada não foi apenas sobre mudar hábitos, mas sobre me encontrar em Cristo. Vivi a angústia de um vazio profundo e a tristeza de não me sentir amada, até que voltei meus olhos para o Criador. O que começou como uma cura interior logo transformou tudo ao meu redor: meus relacionamentos, minha identidade e meu propósito.',
            'Hoje, entendo que minhas dores e vitórias não foram em vão, elas serviram para que eu pudesse guiar a sua transformação. Não quero apenas observar sua trajetória, quero caminhar ao seu lado.',
            'Tudo o que eu vivi, as dores, os processos e as vitórias, não foi para ficar guardado em mim. Foi para que eu pudesse ser um mapa para a sua própria transformação. Eu não quero apenas te ver de longe, eu te convido a caminhar ao meu lado.',
            'Vamos descobrir o que Deus tem preparado para você nessa jornada?'
        ];

        const padraoDevocional = [
            'Sabemos que a rotina pode ser agitada, e às vezes tudo o que precisamos é de um fôlego, de uma palavra que nos lembre de quem somos em Deus.',
            'O Jardim das Virtuosas nasceu para ser esse respiro no seu celular. Não é apenas mais um grupo de mensagens, é uma comunidade de mulheres reais, que caminham juntas, partilham a fé e florescem no seu próprio tempo.',
            'Ao entrar, você encontrará:\n\n🌷Carinho diário: Devocionais e reflexões para acalmar o coração e dar direção.\n\n🌷Caminhada junta: Um espaço para fortalecer sua identidade e propósito.\n\n🌷 Proximidade: encontros presenciais'
        ];

        // Função para criar elemento visual de input de parágrafo
        function adicionarParagrafo(containerId, valor = '') {
            const container = document.getElementById(containerId);
            if (!container) return;
            const newItem = document.createElement('div');
            newItem.className = 'dynamic-item';
            newItem.innerHTML = `
                <textarea class="form-control" placeholder="Escreva o parágrafo...">${valor}</textarea>
                <button type="button" class="btn-remove" onclick="removerItem(this)">×</button>
            `;
            container.appendChild(newItem);
        }

        function removerItem(button) {
            button.parentElement.remove();
        }

        function extrairParagrafos(containerId) {
            const list = [];
            const textareas = document.querySelectorAll(`#${containerId} textarea`);
            textareas.forEach(ta => {
                if(ta.value.trim() !== '') list.push(ta.value.trim());
            });
            return list;
        }

        // Carregar do Firebase para preencher o formulário
        db.ref('siteData').once('value').then(snapshot => {
            const data = snapshot.val();

            if (!data) {
                padraoPerfil.forEach(txt => adicionarParagrafo('containerPerfilSecundario', txt));
                padraoBio.forEach(txt => adicionarParagrafo('containerBio', txt));
                padraoDevocional.forEach(txt => adicionarParagrafo('containerDevocional', txt));
                return;
            }

            if (data.hero) {
                document.getElementById('heroSubtitulo').value = data.hero.subtitulo || '';
                document.getElementById('heroTitulo').value = data.hero.titulo || '';
                document.getElementById('heroAutora').value = data.hero.autora || '';
                document.getElementById('heroImagem').value = data.hero.imagem || '';
            }

            if (data.perfilSecundario) {
                document.getElementById('perfilSecundarioTitulo').value = data.perfilSecundario.titulo || '';
                document.getElementById('perfilSecundarioImagem').value = data.perfilSecundario.imagem || '';
                if (data.perfilSecundario.paragrafos) {
                    data.perfilSecundario.paragrafos.forEach(txt => adicionarParagrafo('containerPerfilSecundario', txt));
                }
            }

            if (data.bio) {
                document.getElementById('bioTitulo').value = data.bio.titulo || '';
                if (data.bio.paragrafos) {
                    data.bio.paragrafos.forEach(txt => adicionarParagrafo('containerBio', txt));
                }
            }

            if (data.livro) {
                document.getElementById('livroTitulo').value = data.livro.titulo || '';
                document.getElementById('livroDescricao').value = data.livro.descricao || '';
                document.getElementById('livroLink').value = data.livro.link || '';
                document.getElementById('livroImagem').value = data.livro.imagem || '';
            }

            if (data.devocional) {
                document.getElementById('devocionalTitulo').value = data.devocional.titulo || '';
                document.getElementById('devocionalLink').value = data.devocional.link || '';
                if (data.devocional.paragrafos) {
                    data.devocional.paragrafos.forEach(txt => adicionarParagrafo('containerDevocional', txt));
                }
            }
        }).catch(err => {
            console.error("Erro ao carregar dados:", err);
        });

        // Função para Salvar os Dados no Firebase
        function salvarFirebase() {
            const statusMsg = document.getElementById('statusMsg');
            statusMsg.innerText = "Salvando alterações...";

            const payload = {
                hero: {
                    subtitulo: document.getElementById('heroSubtitulo').value,
                    titulo: document.getElementById('heroTitulo').value,
                    autora: document.getElementById('heroAutora').value,
                    imagem: document.getElementById('heroImagem').value
                },
                perfilSecundario: {
                    titulo: document.getElementById('perfilSecundarioTitulo').value,
                    imagem: document.getElementById('perfilSecundarioImagem').value,
                    paragrafos: extrairParagrafos('containerPerfilSecundario')
                },
                bio: {
                    titulo: document.getElementById('bioTitulo').value,
                    paragrafos: extrairParagrafos('containerBio')
                },
                livro: {
                    titulo: document.getElementById('livroTitulo').value,
                    descricao: document.getElementById('livroDescricao').value,
                    link: document.getElementById('livroLink').value,
                    imagem: document.getElementById('livroImagem').value
                },
                devocional: {
                    titulo: document.getElementById('devocionalTitulo').value,
                    link: document.getElementById('devocionalLink').value,
                    paragrafos: extrairParagrafos('containerDevocional')
                }
            };

            db.ref('siteData').set(payload)
                .then(() => {
                    statusMsg.innerText = "Salvo com sucesso!";
                    setTimeout(() => statusMsg.innerText = "Pronto para atualizar", 3000);
                })
                .catch(error => {
                    console.error(error);
                    statusMsg.innerText = "Erro ao salvar!";
                });
        }
