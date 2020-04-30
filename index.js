"use strict"

function main () {
  const nav = document.querySelector('.nav')

  window.addEventListener('scroll', e => {
    if (window.scrollY == 0)
      nav.classList.add('nav_top')
    else
      nav.classList.remove('nav_top')
  })
}

document.addEventListener('DOMContentLoaded', main)