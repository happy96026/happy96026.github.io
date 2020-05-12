import './styles.scss'

import 'scroll-behavior-polyfill'
import 'classlist-polyfill'
import 'object-fit-polyfill'

import ResizeObserver from 'resize-observer-polyfill'


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
    document.body.classList.add('overflow-hide')
  }
  const hideNav = () => {
    document.documentElement.style.width = ''
    navContainer.style.width = ''
    nav.style.height = ''
    navContainer.classList.remove('nav-container_show')
    document.body.classList.remove('overflow-hide')

    if (!document.documentElement.classList.contains('m'))
      window.scrollTo(0, parseInt(document.documentElement.getAttribute('data-offset')))
  }

  // Nav trigger button for mobile
  navButton.addEventListener('click', () => {
    if (navContainer.classList.contains('nav-container_show'))
      hideNav()
    else
      showNav()
  })

  // Hide nav when main is clicked
  main.addEventListener('click', () => {
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
    const sectionContainers = document.querySelectorAll('.section-container')
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

  // nav.addEventListener('transitionend', e => {
  //   if (e.propertyName === 'height')
  // })
  document.documentElement.classList.remove('preloading')

}

document.addEventListener('DOMContentLoaded', main)