const canvas = document.getElementById('canvas')
const byline = document.getElementById('byline')

// Stars Background
const starCount = [window.innerWidth / 2, window.innerWidth / 4, window.innerWidth / 8]
const stars = []

const infoHeight = document.querySelector('.intro').clientHeight;

window.addEventListener('resize', resizeCanvas, false)
resizeCanvas(canvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = infoHeight
    drawStars(canvas)
}

function drawStars(canvasObj) {
    const context = canvasObj.getContext('2d')

    canvasObj.width = window.innerWidth
    canvasObj.height = infoHeight
    for (let i = 0, j = starCount.length; i < j; i++) {
        for (let k = 0, l = starCount[i]; k < l; k++) {
            const x = Math.random() * canvasObj.width
            const y = Math.random() * canvasObj.height
            context.beginPath()
            stars.push({ posX: x, posY: y, radius: (i + 1) / 2.5 })
            context.arc(x, y, (i + 1.5) / 2.5, 0, 360)
            context.fillStyle = 'rgba(255, 255, 255, 0.7)'
            context.fill()
        }
    }
}
drawStars(canvas)

// Intro Animation
bylineText = byline.innerHTML
bylineArray = bylineText.split('')
byline.innerHTML = ''
let span
let letter

for (let i = 0, endI = bylineArray.length; i < endI; i++) {
    span = document.createElement('span')
    letter = document.createTextNode(bylineArray[i])

    if (bylineArray[i] === ' ') {
        byline.appendChild(letter)
    } else {
        span.appendChild(letter)
        byline.appendChild(span)
    }
}

//hamburger menu on smaller screens
const burger = document.querySelector('.burger')
const ul = document.querySelector('ul')
const lines = document.querySelectorAll('.burger div')

burger.addEventListener('click', () => {
    ul.classList.toggle('toggle')
    lines.forEach(line => {
        line.classList.toggle('toggle')
    })
})


//card flip 
const cards = document.querySelectorAll('.card')
const clone = document.querySelector('.card-clone')
const cloneContainer = document.querySelector('.clone-container')

let cardFlipped = false
let lastClickedCard
let lastClickedCardProps = {
    'top': 0,
    'left': 0,
    'width': 0,
    'height': 0
}


cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (!cardFlipped) {
            lastClickedCard = card
        }

        lastClickedCardProps.top = card.getBoundingClientRect().top
        lastClickedCardProps.left = card.getBoundingClientRect().left
        lastClickedCardProps.width = card.clientWidth
        lastClickedCardProps.height = card.clientHeight

        clone.style.display = 'block'
        clone.style.top = `${lastClickedCardProps.top}px`
        clone.style.left = `${lastClickedCardProps.left}px`
        clone.style.height = `${lastClickedCardProps.height}px`
        clone.style.width = `${lastClickedCardProps.width}px`

        card.style.opacity = 0

        document.querySelector('body').style.overflow = 'hidden'

        const starsBG = canvas.cloneNode(true)
        drawStars(starsBG)
        cloneContainer.appendChild(starsBG)

        setTimeout(() => {
            clone.style.top = '0'
            clone.style.left = '0'
            clone.style.height = '100vh'
            clone.style.width = '100%'
            clone.style.overflow = 'auto'
        }, 100)
    })

    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-10px)'
    })
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)'

    })
})


clone.addEventListener('transitionend', e => {
    onTransitionEnd(e)
})
clone.addEventListener('webkitTransitionEnd', e => {
    onTransitionEnd(e)
})
clone.addEventListener('onTransitionEnd', e => {
    onTransitionEnd(e)
})

let slides
let currentSlide

const onTransitionEnd = e => {
    if (e.target === e.currentTarget) {
        if (e.propertyName == 'top') {
            cardFlipped = !cardFlipped;

            if (!cardFlipped) {
                lastClickedCard.style.opacity = 1
                clone.style.display = 'none'
                document.querySelector('body').style.overflow = 'unset'
                document.querySelector('body').style.overflowX = 'hidden'
            } else {
                cloneContainer.style.opacity = 1
                let cardClone = lastClickedCard.cloneNode(true)
                const cardChildren = cardClone.querySelector('.card-back').children
                const childrenArray = [...cardChildren]
                childrenArray.forEach(child => {
                    cloneContainer.appendChild(child)
                })

                //get slides that are copied to clone
                slides = cloneContainer.querySelectorAll('.slide')
                //listeners for the prev and next buttons of sliders
                cloneContainer.querySelector('.button-right').addEventListener('click', nextSlide)
                cloneContainer.querySelector('.button-left').addEventListener('click', prevSlide)
                currentSlide = 0
            }
        }
    }
}

//Carousel 
const nextSlide = () => {
    slides[currentSlide].className = 'slide'
    currentSlide = (currentSlide + 1) % slides.length
    slides[currentSlide].className = 'slide showing'
}

const prevSlide = () => {
    slides[currentSlide].className = 'slide'
    currentSlide = (currentSlide - 1) % slides.length
    if (currentSlide == -1) {
        currentSlide = slides.length - 1
    }
    slides[currentSlide].className = 'slide showing'
}


//close card modal 
const x = document.querySelector('.close-icon')
x.addEventListener('click', () => {
    cloneContainer.style.opacity = 0
    clone.style.top = `${lastClickedCardProps.top}px`
    clone.style.left = `${lastClickedCardProps.left}px`
    clone.style.height = `${lastClickedCardProps.height}px`
    clone.style.width = `${lastClickedCardProps.width}px`

    const closeIcon = cloneContainer.children[0]
    cloneContainer.innerHTML = ''
    cloneContainer.appendChild(closeIcon)
})

//send email
const form = document.getElementById('form')
const fullName = document.getElementById('name')
const email = document.getElementById('email')
const message = document.getElementById('message')

form.addEventListener('submit', e => {
    e.preventDefault()

    const XHR = new XMLHttpRequest()
    XHR.open('POST', 'https://my-portfolio-email-server.herokuapp.com/', true)
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    XHR.send(`name=${fullName.value}&email=${email.value}&message=${message.value}`)

    fullName.value = ''
    email.value = ''
    message.value = ''

    alert('Your message was sent. Thank you so much!')
})

//Scroll animation 
gsap.registerPlugin(ScrollTrigger)

gsap.from('.about-transition', {
    scrollTrigger: {
        trigger: '.about-transition',
        start: 'top 90%',
    },
    y: 100,
    opacity: 0,
    stagger: 0.6,
    ease: "power1.inOut"
})

gsap.from('.projects-transition', {
    scrollTrigger: {
        trigger: '.projects-transition',
        start: 'top 90%',
    },
    y: 100,
    opacity: 0,
    stagger: 0.3,
    ease: "power1.inOut"
})

gsap.from('.skills-transition', {
    scrollTrigger: {
        trigger: '.skills-transition',
        start: 'top 90%',
    },
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: "power1.inOut"
})

gsap.from('.experiences-transition', {
    scrollTrigger: {
        trigger: '.experiences-transition',
        start: 'top 90%',
    },
    y: 100,
    opacity: 0,
    stagger: 0.3,
    ease: "power1.inOut"
})
