"use strict"

var breakM = 768
var navHeight = 65
var nav, navContainer, navButton

function scrollToElement (e) {
  nav.style.height = ''
  navContainer.classList.remove('nav-container_show')

  var element = document.querySelector('.' + e.currentTarget.getAttribute('data-section'))
  var top = window.pageYOffset + element.getBoundingClientRect().top
  if (window.matchMedia('only screen and (min-width: ' + breakM + 'px)').matches)
    top -= navHeight

  window.scrollTo({
    top: top,
    behavior: 'smooth'
  })

  if (window.pageYOffset === 0)
    window.scrollTo(0, top)
}

function main () {
  navContainer = document.querySelector('.nav-container')
  navButton = document.querySelector('.nav-button')
  nav = document.querySelector('.nav')

  var navHeightSmall = window.getComputedStyle(nav).height
  nav.classList.remove('nav_init')

  window.addEventListener('scroll', function () {
    if (window.pageYOffset == 0)
      navContainer.classList.add('nav-container_top')
    else
      navContainer.classList.remove('nav-container_top')
  })

  navButton.addEventListener('click', function () {
    if (navContainer.classList.contains('nav-container_show')) {
      nav.style.height = ''
      navContainer.classList.remove('nav-container_show')
    } else  {
      nav.style.height = navHeightSmall
      navContainer.classList.add('nav-container_show')
    }
  })

  var navLinks = document.querySelectorAll('.nav__link')
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', scrollToElement)
  }

  window.addEventListener('resize', function () {
    if (window.matchMedia('only screen and (min-width: ' + breakM + 'px)').matches) {
      nav.style.height = ''
      navContainer.classList.remove('nav-container_show')
    }
  })

  window.addEventListener('hashchange', function () {
    var className = location.hash.slice(1)
    var element = document.querySelector('.' + className)
    if (element) {
      scrollToElement(element)
    }
  })
}

document.addEventListener('DOMContentLoaded', main)