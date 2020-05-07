"use strict"

var breakM = 768
var navHeight = 65
var nav, navContainer, navButton

function scrollToElement (e) {
  nav.style.height = ''
  navContainer.classList.remove('nav-container_show')

  var element = document.querySelector('.' + e.currentTarget.getAttribute('data-nav'))
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

  if ('IntersectionObserver' in window) {
    var options = {
      rootMargin: '-66px 0px 0px 0px'
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var navItem = document.querySelector(
          '[data-nav="' + entry.target.getAttribute('data-section') + '"]'
        ).parentElement
        
        if (entry.isIntersecting)
          navItem.classList.add('nav__list-item_intersect')
        else
          navItem.classList.remove('nav__list-item_intersect')
      })
    }, options)

    var sectionContainers = document.querySelectorAll('.section-container')
    sectionContainers.forEach(function (container) {
      observer.observe(container)
    })

    var pointObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var pointName = entry.target.getAttribute('data-point-name')
        var className = 'nav-container_' + pointName
        if (entry.isIntersecting)
          navContainer.classList.add(className)
        else
          navContainer.classList.remove(className)
      })
    })

    var points = document.querySelectorAll('.point')
    points.forEach(function (point) {
      pointObserver.observe(point)
    })
  }
}

document.addEventListener('DOMContentLoaded', main)