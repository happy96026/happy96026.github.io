import './styles.scss'

import 'intersection-observer'
import 'scroll-behavior-polyfill'
import 'classlist-polyfill'

import ResizeObserver from 'resize-observer-polyfill'


const navHeight = 65
let nav, navContainer, navButton

function scrollToElement (e) {
  nav.style.height = ''
  navContainer.classList.remove('nav-container_show')

  const element = document.querySelector('.' + e.currentTarget.getAttribute('data-nav'))
  let top = window.pageYOffset + element.getBoundingClientRect().top
  if (document.documentElement.classList.contains('m'))
    top -= navHeight

  const scrollOptions = { top }
  if ('now' in window.performance) 
    scrollOptions['behavior'] = 'smooth'

  window.scrollTo(scrollOptions)
}

function main () {
  // Detect Flex
  const dummy = document.createElement('p')
  if (dummy.style.flex === undefined && dummy.style.msFlex === undefined)
    document.documentElement.classList.add('no-flex')

  navContainer = document.querySelector('.nav-container')
  navButton = document.querySelector('.nav-button')
  nav = document.querySelector('.nav')

  // Get height of nav bar when screen is small
  const navHeightSmall = window.getComputedStyle(nav).height
  nav.classList.remove('nav_init')

  navButton.addEventListener('click', () => {
    if (navContainer.classList.contains('nav-container_show')) {
      nav.style.height = ''
      navContainer.classList.remove('nav-container_show')
    } else  {
      nav.style.height = navHeightSmall
      navContainer.classList.add('nav-container_show')
    }
  })

  // nav link click listeners
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
      if (entry.contentRect.width >= breakPoints['m']) {
        nav.style.height = ''
        navContainer.classList.remove('nav-container_show')
      }

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

  const options = {
    rootMargin: '-66px 0px 0px 0px'
  }

  // intersection observer
  const iObserver = new IntersectionObserver(entries => {
    entries.forEach(function (entry) {
      const navItem = document.querySelector(
        '[data-nav="' + entry.target.getAttribute('data-section') + '"]'
      ).parentElement
      
      if (entry.isIntersecting)
        navItem.classList.add('nav__list-item_intersect')
      else
        navItem.classList.remove('nav__list-item_intersect')
    })
  }, options)

  const sectionContainers = document.querySelectorAll('.section-container')
  for (const container of sectionContainers) {
    iObserver.observe(container)
  }

  const pointObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const pointName = entry.target.getAttribute('data-point-name')
      const className = 'nav-container_' + pointName
      if (entry.isIntersecting)
        navContainer.classList.add(className)
      else
        navContainer.classList.remove(className)
    })
  })

  const points = document.querySelectorAll('.point')
  points.forEach(point => {
    pointObserver.observe(point)
  })
}

document.addEventListener('DOMContentLoaded', main)