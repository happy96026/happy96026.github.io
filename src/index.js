import './styles.scss'

import 'scroll-behavior-polyfill'
import 'classlist-polyfill'
import 'object-fit-polyfill'
import './element-remove'

import ResizeObserver from 'resize-observer-polyfill'

import imgPath from './my-image.jpg'


const navHeight = 65

function main () {
  // Detect Flex
  const dummy = document.createElement('p')
  if (dummy.style.flex === undefined && dummy.style.msFlex === undefined)
    document.documentElement.classList.add('no-flex')

  const navContainer = document.querySelector('.nav-container')
  const navButton = document.querySelector('.nav-button')
  const nav = document.querySelector('.nav')
  const main = document.querySelector('.main')
  const sectionContainers = document.querySelectorAll('.section-container')
  const sections = document.querySelectorAll('.section')

  // Get height of nav bar when screen is small
  nav.style.width = '600px'
  nav.style.height = 'initial'
  const navHeightSmall = window.getComputedStyle(nav).height
  nav.style.width = ''
  nav.style.height = ''

  // Nav show/hide
  const showNav = () => {
    let htmlWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width
    htmlWidth = `calc(100% - ${htmlWidth}px)`
    document.documentElement.style.width = htmlWidth
    document.documentElement.setAttribute('data-offset', window.pageYOffset)
    navContainer.style.width = htmlWidth
    nav.style.height = navHeightSmall

    navContainer.classList.add('nav-container_show')
    nav.classList.add('nav_height-animate')
    document.body.classList.add('overflow-hide')
  }
  const hideNav = () => {
    navContainer.style.width = ''
    nav.style.height = ''
    navContainer.classList.remove('nav-container_show')
    document.body.classList.remove('overflow-hide')
    document.documentElement.style.width = ''

    const dataOffset = document.documentElement.getAttribute('data-offset')
    if (dataOffset) {
      window.scrollTo(0, parseInt(document.documentElement.getAttribute('data-offset')))
      document.documentElement.setAttribute('data-offset', '')
    }
  }
  nav.addEventListener('transitionend', e => {
    if (e.type === 'transitionend' && !navContainer.classList.contains('nav-container_show'))
      nav.classList.remove('nav_height-animate')
  })

  // Nav trigger button for mobile
  navButton.addEventListener('click', () => {
    if (navContainer.classList.contains('nav-container_show'))
      hideNav()
    else
      showNav()
  })

  // Hide nav when main is clicked
  main.addEventListener('click', () => {
    if (navContainer.classList.contains('nav-container_show'))
      hideNav()
  })

  // nav link click listeners
  const scrollToElement = e => {
    hideNav()

    const element = document.querySelector('.' + e.currentTarget.getAttribute('data-nav'))
    let top = window.pageYOffset + element.getBoundingClientRect().top
    if (document.documentElement.classList.contains('m'))
      top -= navHeight

    const scrollOptions = { top }
    if ('now' in window.performance) 
      scrollOptions['behavior'] = 'smooth'

    window.scrollTo(scrollOptions)
  }

  const navLinks = document.querySelectorAll('.nav__link')
  for (const link of navLinks) {
    link.addEventListener('click', scrollToElement)
  }

  // resize observer
  const breakPoints = {
    'sm': 600,
    'm': 768,
    'l': 992,
    'xl': 1200
  }
  const resizeObserver = new ResizeObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.contentRect.width >= breakPoints['m'])
        hideNav()

      Object.keys(breakPoints).forEach(function (point) {
        if (entry.contentRect.width >= breakPoints[point]) {
          entry.target.classList.add(point)
        } else {
          entry.target.classList.remove(point)
        }
      })
    })
  })
  resizeObserver.observe(document.documentElement)

  // Set Navigation Link Color according to scroll position
  const setCurrentLink = container => {
    const newLink = document.querySelector(`[data-nav='${container.getAttribute('data-section')}']`)
    const currentLink = document.querySelector('.nav__link_current')

    if (currentLink !== newLink) {
      if (currentLink) currentLink.classList.remove('nav__link_current')
      if (newLink) newLink.classList.add('nav__link_current')
    }
  }

  const setNavLink = () => {
    const offset = document.documentElement.classList.contains('m') ? navHeight : 0
    const lastSectionContainer = sectionContainers[sectionContainers.length - 1]

    if (parseInt(lastSectionContainer.getBoundingClientRect().bottom) === window.innerHeight) {
      setCurrentLink(lastSectionContainer)
      return
    }
    
    for (const container of sectionContainers) {
      if (container.getBoundingClientRect().bottom > offset) {
        setCurrentLink(container)
        break
      }
    }
  }

  window.addEventListener('scroll', setNavLink)
  setNavLink()

  // Detect scroll top
  const detectScrollTop = () => {
    if (window.pageYOffset === 0) 
      navContainer.classList.add('nav-container_top')
    else
      navContainer.classList.remove('nav-container_top')
  }

  window.addEventListener('scroll', detectScrollTop)
  detectScrollTop()

  // Trigger animation on section at intersection
  window.addEventListener('scroll', () => {
    for (const section of sections) {
      if (section.getBoundingClientRect().top < window.innerHeight - 100)
        section.classList.remove('section_before')
      else
        break
    }
  })

  // Remove preloading screen
  const img = new Image()
  img.src = imgPath

  const promiseHandler = resolve => () => resolve()
  const imgLoadedPromise = new Promise(resolve => {
    img.addEventListener('load', promiseHandler(resolve))
    img.addEventListener('error', promiseHandler(resolve))
    if (img.complete) resolve()
  })
  const navTransitionPromise = new Promise(resolve => {
    nav.addEventListener('transitionend', promiseHandler(resolve))
  })

  const promiseArray = [imgLoadedPromise]
  if ('transition' in nav.style)
    promiseArray.push(navTransitionPromise)

  Promise.all(promiseArray).then(() => {
    document.documentElement.classList.remove('preloading')
    img.remove()
    nav.removeEventListener('transitionend', promiseHandler)

    for (const section of sections) {
      if (section.getBoundingClientRect().top >= window.innerHeight - 100)
        section.classList.add('section_before')
    }
  })
}

document.addEventListener('DOMContentLoaded', main)