function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const barreira = new Barreira(true)
// barreira.setAltura(190)
// document.querySelector('[wm-flappy]').appendChild(barreira.elemento)

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura-abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.sortearAbertura()

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.setX(x)
}

// const parB = new ParDeBarreiras(550, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(parB.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco*2),
        new ParDeBarreiras(altura, abertura, largura + espaco*3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando a barreira sair da area do jogo:
            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = './imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -4)
        const alturaMaxima = alturaJogo - this.elemento.clientHeigth

        if(novoY <= 0){
            this.setY(0)
        } else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        } else{
            this.setY(novoY)
        }        
    }

    this.setY(alturaJogo/2)
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

// const barreiras = new Barreiras(650, 1200, 200, 400)
// const passaro = new Passaro(650)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// setInterval(() => {
//         barreiras.animar()
//         passaro.animar()
//     }, 20)

function FlappyBird() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(650, 1200, 200, 400, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(650)

    areaDoJogo.appendChild(passaro.elemento)
    areaDoJogo.appendChild(progresso.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        //game loop
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
        }, 20)
    }
}

new FlappyBird().start()