(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
      });
    });
  }

  // "Produk" dropdown menu
  var dropdowns = document.querySelectorAll('.has-dropdown');
  function closeDropdowns(except) {
    dropdowns.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      var btn = item.querySelector('.nav-dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
  dropdowns.forEach(function (item) {
    var dropToggle = item.querySelector('.nav-dropdown-toggle');
    if (!dropToggle) return;
    dropToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.toggle('is-open');
      dropToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      closeDropdowns(item);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) closeDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdowns();
  });

  // FAQ accordion
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      faqItems.forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Article table of contents, auto-generated from h2/h3 in the article body
  var articleContent = document.getElementById('articleContent');
  var tocList = document.getElementById('articleTocList');
  if (articleContent && tocList) {
    var headings = articleContent.querySelectorAll('h2, h3');
    var currentH2Item = null;

    headings.forEach(function (heading, index) {
      if (!heading.id) heading.id = 'section-' + index;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      li.appendChild(a);

      if (heading.tagName === 'H3' && currentH2Item) {
        var sub = currentH2Item.querySelector('.article-toc-sub');
        if (!sub) {
          sub = document.createElement('ol');
          sub.className = 'article-toc-sub';
          currentH2Item.appendChild(sub);
        }
        sub.appendChild(li);
      } else {
        tocList.appendChild(li);
        if (heading.tagName === 'H2') currentH2Item = li;
      }
    });

    var tocLinks = tocList.querySelectorAll('a');
    if ('IntersectionObserver' in window) {
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = tocList.querySelector('a[href="#' + entry.target.id + '"]');
          if (!link) return;
          tocLinks.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        });
      }, { rootMargin: '-110px 0px -70% 0px' });
      headings.forEach(function (h) { tocObserver.observe(h); });
    }
  }

  // Scroll reveal animation (fade-up), one-time per element
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
