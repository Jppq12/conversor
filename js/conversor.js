
const moeda1 = document.getElementById('m1')
const moeda2 = document.getElementById('m2')
const valor = document.getElementById('valor')
const botao = document.getElementById('converter')
const tela = document.getElementById('tela')

botao.addEventListener('click', converter)

console.log('Evento vinculado!')

async function converter() {
    

    // Capturando os valores
    const origem = moeda1.value
    const destino = moeda2.value
    const quantia = Number(valor.value)


    // Verificando os campos
    if (!origem || !destino || valor.value === '') {
        tela.textContent = 'Preencha todos os campos!'
        return
    }

    if (quantia <= 0 || !Number.isFinite(quantia)) {
        tela.textContent = 'Digite um valor válido!'
        return
    }

    // Verificando se as moedas são iguais
    if (origem === destino) {
        mostrarResultado(quantia, origem, destino, 1)
        return
    }

    tela.textContent = 'Consultando cotação...'

    try {

        // Consultando a API
        const url = `https://api.frankfurter.dev/v2/rate/${origem}/${destino}`

        const resposta = await fetch(url)
        

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar a cotação.')
        }

        const dados = await resposta.json()

        // Calculando a conversão
        const taxa = dados.rate

        mostrarResultado(quantia, origem, destino, taxa, dados.date)

    } catch (erro) {

        tela.textContent = 'Erro ao consultar a cotação. Tente novamente.'

        console.error(erro)
    }
}

function mostrarResultado(valor, origem, destino, taxa, data) {

    const nomesMoedas = {
    BRL: 'Real brasileiro',
    USD: 'Dólar americano',
    EUR: 'Euro',
    GBP: 'Libra esterlina',
    ARS: 'Peso argentino',
    PYG: 'Guarani paraguaio',
    JPY: 'Iene japonês',
    CNY: 'Yuan chinês',
    CAD: 'Dólar canadense',
    AUD: 'Dólar australiano',
    CHF: 'Franco suíço',
    MXN: 'Peso mexicano',
    INR: 'Rúpia indiana',
    KRW: 'Won sul-coreano'
}

    const convertido = valor * taxa

    const formatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: destino
    }).format(convertido)

    const dataFormatada = data
    ? new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')
    : ''

    tela.innerHTML = `
    <div class="resultado">

        <h3>Resultado da conversão</h3>

        <div class="valores">
            <div>
                <small>Você enviou</small>
                <h2>${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: origem
                }).format(valor)}</h2>
                <small>${nomesMoedas[origem]}</small>
            </div>

            <span>→</span>

            <div>
                <small>Você recebeu</small>
                <h2 class="convertido">${formatado}</h2>
                <small>${nomesMoedas[destino]}</small>
            </div>
        </div>

        <div class="informacoes">
            <p>Taxa: 1 ${origem} = ${taxa} ${destino}</p>

            ${data ? `
                <small>Cotação de ${dataFormatada}</small><br>
                <small>
                    Fonte: <a href="https://www.frankfurter.dev/"
                    target="_blank" rel="noopener noreferrer">
                    Frankfurter API</a>
                </small>
            ` : ''}
        </div>

    </div>
`
}

function limpar(){
    moeda1.value = ''
    moeda2.value = ''
    valor.value = ''
    tela.innerHTML = ''
}
