"use strict"

function main () {
  var navContainer = document.querySelector('.nav-container')
  var navButton = document.querySelector('.nav-button')
  var nav = document.querySelector('.nav')

  var navHeight = window.getComputedStyle(nav).height
  nav.classList.remove('nav_init')

  window.addEventListener('scroll', function () {
    if (window.pageYOffset == 0)
      navContainer.classList.add('nav-container_top')
    else
      navContainer.classList.remove('nav-container_top')
  })

  navButton.addEventListener('click', function () {
    if (nav.classList.contains('nav_show')) {
      nav.style.height = ''
      nav.classList.remove('nav_show')
    } else  {
      nav.style.height = navHeight
      nav.classList.add('nav_show')
    }
  })
}

document.addEventListener('DOMContentLoaded', main)