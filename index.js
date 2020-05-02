"use strict"

function main () {
  const navContainer = document.querySelector('.nav-container')

  window.addEventListener('scroll', e => {
    if (window.scrollY == 0)
      navContainer.classList.add('nav-container_top')
    else
      navContainer.classList.remove('nav-container_top')
  })
}

document.addEventListener('DOMContentLoaded', main)