/*
 CookieConsent v2.8.0
 https://www.github.com/orestbida/cookieconsent
 Author Orest Bida
 Released under the MIT License
*/
;(function () {
  const kb = function (eb) {
    const e = {
      mode: 'opt-in',
      current_lang: 'en',
      auto_language: null,
      autorun: !0,
      cookie_name: 'cc_cookie',
      cookie_expiration: 182,
      cookie_domain: window.location.hostname,
      cookie_path: '/',
      cookie_same_site: 'Lax',
      use_rfc_cookie: !1,
      autoclear_cookies: !0,
      revision: 0,
      script_selector: 'data-cookiecategory',
    }
    const m = {}
    let g
    let t = {}
    let C = null
    let K = !1
    let Q = !1
    let na = !1
    let Ca = !1
    let oa = !1
    let v
    let Y
    let U
    let pa
    let Da
    let Ea
    let Fa = !1
    let Z = !0
    let Sa = ''
    let V = []
    let xa = !1
    let Ga
    let Ha = []
    let Ta = []
    const Ia = []
    let Ua = !1
    let qa
    let Ja
    const Ka = []
    const ja = []
    const R = []
    const I = []
    const ya = []
    const ra = document.documentElement
    let L
    let sa
    let x
    let aa
    let ta
    let W
    let S
    let T
    let ba
    let E
    let M
    let ua
    let ka
    let la
    let y
    let ca
    let da
    let ea
    let fa
    const Va = function (a) {
      function b(n) {
        return (a || document).querySelectorAll('a[data-cc="' + n + '"], button[data-cc="' + n + '"]')
      }
      function c(n, p) {
        n.preventDefault ? n.preventDefault() : (n.returnValue = !1)
        m.accept(p)
        m.hideSettings()
        m.hide()
      }
      for (
        var d = b('c-settings'), f = b('accept-all'), l = b('accept-necessary'), q = b('accept-selection'), h = 0;
        h < d.length;
        h++
      ) {
        d[h].setAttribute('aria-haspopup', 'dialog'),
          z(d[h], 'click', function (n) {
            n.preventDefault ? n.preventDefault() : (n.returnValue = !1)
            m.showSettings(0)
          })
      }
      for (h = 0; h < f.length; h++) {
        z(f[h], 'click', function (n) {
          c(n, 'all')
        })
      }
      for (h = 0; h < q.length; h++) {
        z(q[h], 'click', function (n) {
          c(n)
        })
      }
      for (h = 0; h < l.length; h++) {
        z(l[h], 'click', function (n) {
          c(n, [])
        })
      }
    }
    const za = function (a, b) {
      if (Object.prototype.hasOwnProperty.call(b, a)) {
        return a
      }
      if (va(b).length > 0) {
        return Object.prototype.hasOwnProperty.call(b, e.current_lang) ? e.current_lang : va(b)[0]
      }
    }
    const Wa = function () {
      function a(c, d) {
        let f = !1
        let l = !1
        try {
          for (var q = c.querySelectorAll(b.join(':not([tabindex="-1"]), ')), h, n = q.length, p = 0; p < n; ) {
            ;(h = q[p].getAttribute('data-focus')),
              l || h !== '1'
                ? h === '0' && ((f = q[p]), l || q[p + 1].getAttribute('data-focus') === '0' || (l = q[p + 1]))
                : (l = q[p]),
              p++
          }
        } catch (F) {
          return c.querySelectorAll(b.join(', '))
        }
        d[0] = q[0]
        d[1] = q[q.length - 1]
        d[2] = f
        d[3] = l
      }
      var b = ['[href]', 'button', 'input', 'details', '[tabindex="0"]']
      a(M, ja)
      Q && a(x, Ka)
    }
    const La = function (a) {
      !0 === g.force_consent && J(ra, 'force--consent')
      if (!x) {
        x = k('div')
        var b = k('div')
        var c = k('div')
        x.id = 'cm'
        b.id = 'c-inr-i'
        c.id = 'cm-ov'
        x.setAttribute('role', 'dialog')
        x.setAttribute('aria-modal', 'true')
        x.setAttribute('aria-hidden', 'false')
        x.setAttribute('aria-labelledby', 'c-ttl')
        x.setAttribute('aria-describedby', 'c-txt')
        sa.appendChild(x)
        sa.appendChild(c)
        x.style.visibility = c.style.visibility = 'hidden'
        c.style.opacity = 0
      }
      if ((c = g.languages[a].consent_modal.title)) {
        aa ||
          ((aa = k('div')),
          (aa.id = 'c-ttl'),
          aa.setAttribute('role', 'heading'),
          aa.setAttribute('aria-level', '2'),
          b.appendChild(aa)),
          (aa.innerHTML = c)
      }
      c = g.languages[a].consent_modal.description
      Fa &&
        (c = Z
          ? c.replace('{{revision_message}}', '')
          : c.replace('{{revision_message}}', Sa || g.languages[a].consent_modal.revision_message || ''))
      ta || ((ta = k('div')), (ta.id = 'c-txt'), b.appendChild(ta))
      ta.innerHTML = c
      c = g.languages[a].consent_modal.primary_btn
      const d = g.languages[a].consent_modal.secondary_btn
      if (c) {
        if (!W) {
          W = k('button')
          W.id = 'c-p-bn'
          W.className = 'c-bn'
          let f
          c.role === 'accept_all' && (f = 'all')
          z(W, 'click', function () {
            m.hide()
            m.accept(f)
          })
        }
        W.textContent = g.languages[a].consent_modal.primary_btn.text
      }
      d &&
        (S ||
          ((S = k('button')),
          (S.id = 'c-s-bn'),
          (S.className = 'c-bn c_link'),
          d.role === 'accept_necessary'
            ? z(S, 'click', function () {
                m.hide()
                m.accept([])
              })
            : z(S, 'click', function () {
                m.showSettings(0)
              })),
        (S.textContent = g.languages[a].consent_modal.secondary_btn.text))
      a = g.gui_options
      ba || ((ba = k('div')), (ba.id = 'c-inr'), ba.appendChild(b))
      T ||
        ((T = k('div')),
        (T.id = 'c-bns'),
        a && a.consent_modal && !0 === a.consent_modal.swap_buttons
          ? (d && T.appendChild(S), c && T.appendChild(W), (T.className = 'swap'))
          : (c && T.appendChild(W), d && T.appendChild(S)),
        (c || d) && ba.appendChild(T),
        x.appendChild(ba))
      Q = !0
    }
    const ab = function (a) {
      if (E) {
        ;(y = k('div')), (y.id = 's-bl')
      } else {
        E = k('div')
        var b = k('div')
        var c = k('div')
        var d = k('div')
        M = k('div')
        ua = k('div')
        var f = k('div')
        ka = k('button')
        var l = k('div')
        la = k('div')
        var q = k('div')
        E.id = 's-cnt'
        b.id = 'c-vln'
        d.id = 'c-s-in'
        c.id = 'cs'
        ua.id = 's-ttl'
        M.id = 's-inr'
        f.id = 's-hdr'
        la.id = 's-bl'
        ka.id = 's-c-bn'
        q.id = 'cs-ov'
        l.id = 's-c-bnc'
        ka.className = 'c-bn'
        E.setAttribute('role', 'dialog')
        E.setAttribute('aria-modal', 'true')
        E.setAttribute('aria-hidden', 'true')
        E.setAttribute('aria-labelledby', 's-ttl')
        ua.setAttribute('role', 'heading')
        E.style.visibility = q.style.visibility = 'hidden'
        q.style.opacity = 0
        l.appendChild(ka)
        z(
          b,
          'keydown',
          function (ma) {
            ma = ma || window.event
            ma.keyCode === 27 && m.hideSettings(0)
          },
          !0,
        )
        z(ka, 'click', function () {
          m.hideSettings(0)
        })
      }
      ka.setAttribute('aria-label', g.languages[a].settings_modal.close_btn_label || 'Close')
      U = g.languages[a].settings_modal.blocks
      Y = g.languages[a].settings_modal.cookie_table_headers
      let h = U.length
      ua.innerHTML = g.languages[a].settings_modal.title
      for (let n = 0; n < h; ++n) {
        const p = U[n].title
        const F = U[n].description
        const w = U[n].toggle
        let A = U[n].cookie_table
        let u = !0 === g.remove_cookie_tables
        let r = (F && 'truthy') || (!u && A && 'truthy')
        const B = k('div')
        const X = k('div')
        if (F) {
          var Ma = k('div')
          Ma.className = 'p'
          Ma.insertAdjacentHTML('beforeend', F)
        }
        let D = k('div')
        D.className = 'title'
        B.className = 'c-bl'
        X.className = 'desc'
        if (typeof w !== 'undefined') {
          var N = 'c-ac-' + n
          var ha = r ? k('button') : k('div')
          var G = k('label')
          var O = k('input')
          var P = k('span')
          var ia = k('span')
          const Xa = k('span')
          const Ya = k('span')
          ha.className = r ? 'b-tl exp' : 'b-tl'
          G.className = 'b-tg'
          O.className = 'c-tgl'
          Xa.className = 'on-i'
          Ya.className = 'off-i'
          P.className = 'c-tg'
          ia.className = 't-lb'
          r && (ha.setAttribute('aria-expanded', 'false'), ha.setAttribute('aria-controls', N))
          O.type = 'checkbox'
          P.setAttribute('aria-hidden', 'true')
          const Aa = w.value
          O.value = Aa
          ia.textContent = p
          ha.insertAdjacentHTML('beforeend', p)
          D.appendChild(ha)
          P.appendChild(Xa)
          P.appendChild(Ya)
          K
            ? H(t.level, Aa) > -1
              ? ((O.checked = !0), !y && R.push(!0))
              : !y && R.push(!1)
            : w.enabled
              ? ((O.checked = !0), !y && R.push(!0), w.enabled && !y && Ia.push(Aa))
              : !y && R.push(!1)
          !y && I.push(Aa)
          w.readonly ? ((O.disabled = !0), J(P, 'c-ro'), !y && ya.push(!0)) : !y && ya.push(!1)
          J(X, 'b-acc')
          J(D, 'b-bn')
          J(B, 'b-ex')
          X.id = N
          X.setAttribute('aria-hidden', 'true')
          G.appendChild(O)
          G.appendChild(P)
          G.appendChild(ia)
          D.appendChild(G)
          r &&
            (function (ma, Na, Za) {
              z(
                ha,
                'click',
                function () {
                  $a(Na, 'act')
                    ? (Oa(Na, 'act'), Za.setAttribute('aria-expanded', 'false'), ma.setAttribute('aria-hidden', 'true'))
                    : (J(Na, 'act'), Za.setAttribute('aria-expanded', 'true'), ma.setAttribute('aria-hidden', 'false'))
                },
                !1,
              )
            })(X, B, ha)
        } else {
          p &&
            ((r = k('div')),
            (r.className = 'b-tl'),
            r.setAttribute('role', 'heading'),
            r.setAttribute('aria-level', '3'),
            r.insertAdjacentHTML('beforeend', p),
            D.appendChild(r))
        }
        p && B.appendChild(D)
        F && X.appendChild(Ma)
        if (!u && typeof A !== 'undefined') {
          r = document.createDocumentFragment()
          for (N = 0; N < Y.length; ++N) {
            ;(G = k('th')),
              (u = Y[N]),
              G.setAttribute('scope', 'col'),
              u && ((D = u && va(u)[0]), (G.textContent = Y[N][D]), r.appendChild(G))
          }
          u = k('tr')
          u.appendChild(r)
          D = k('thead')
          D.appendChild(u)
          r = k('table')
          r.appendChild(D)
          N = document.createDocumentFragment()
          for (G = 0; G < A.length; G++) {
            O = k('tr')
            for (P = 0; P < Y.length; ++P) {
              if ((u = Y[P])) {
                ;(D = va(u)[0]),
                  (ia = k('td')),
                  ia.insertAdjacentHTML('beforeend', A[G][D]),
                  ia.setAttribute('data-column', u[D]),
                  O.appendChild(ia)
              }
            }
            N.appendChild(O)
          }
          A = k('tbody')
          A.appendChild(N)
          r.appendChild(A)
          X.appendChild(r)
        }
        if ((w && p) || (!w && (p || F))) {
          B.appendChild(X), y ? y.appendChild(B) : la.appendChild(B)
        }
      }
      ca || ((ca = k('div')), (ca.id = 's-bns'))
      ea ||
        ((ea = k('button')),
        (ea.id = 's-all-bn'),
        (ea.className = 'c-bn'),
        ca.appendChild(ea),
        z(ea, 'click', function () {
          m.hideSettings()
          m.hide()
          m.accept('all')
        }))
      ea.textContent = g.languages[a].settings_modal.accept_all_btn
      if ((h = g.languages[a].settings_modal.reject_all_btn)) {
        fa ||
          ((fa = k('button')),
          (fa.id = 's-rall-bn'),
          (fa.className = 'c-bn'),
          z(fa, 'click', function () {
            m.hideSettings()
            m.hide()
            m.accept([])
          }),
          (M.className = 'bns-t'),
          ca.appendChild(fa)),
          (fa.textContent = h)
      }
      da ||
        ((da = k('button')),
        (da.id = 's-sv-bn'),
        (da.className = 'c-bn'),
        ca.appendChild(da),
        z(da, 'click', function () {
          m.hideSettings()
          m.hide()
          m.accept()
        }))
      da.textContent = g.languages[a].settings_modal.save_settings_btn
      y
        ? (M.replaceChild(y, la), (la = y))
        : (f.appendChild(ua),
          f.appendChild(l),
          M.appendChild(f),
          M.appendChild(la),
          M.appendChild(ca),
          d.appendChild(M),
          c.appendChild(d),
          b.appendChild(c),
          E.appendChild(b),
          sa.appendChild(E),
          sa.appendChild(q))
    }
    const fb = function () {
      L = k('div')
      L.id = 'cc--main'
      L.style.position = 'fixed'
      L.style.zIndex = '1000000'
      L.innerHTML =
        '\x3c!--[if lt IE 9 ]><div id="cc_div" class="cc_div ie"></div><![endif]--\x3e\x3c!--[if (gt IE 8)|!(IE)]>\x3c!--\x3e<div id="cc_div" class="cc_div"></div>\x3c!--<![endif]--\x3e'
      sa = L.children[0]
      const a = e.current_lang
      Q && La(a)
      ab(a)
      ;(eb || document.body).appendChild(L)
    }
    m.updateLanguage = function (a, b) {
      if (typeof a === 'string') {
        return (
          (a = za(a, g.languages)),
          a !== e.current_lang || !0 === b ? ((e.current_lang = a), Q && (La(a), Va(ba)), ab(a), !0) : !1
        )
      }
    }
    const cb = function (a) {
      const b = U.length
      let c = -1
      xa = !1
      const d = wa('', 'all')
      let f = [e.cookie_domain, '.' + e.cookie_domain]
      if (e.cookie_domain.slice(0, 4) === 'www.') {
        var l = e.cookie_domain.substr(4)
        f.push(l)
        f.push('.' + l)
      }
      for (l = 0; l < b; l++) {
        const q = U[l]
        if (Object.prototype.hasOwnProperty.call(q, 'toggle')) {
          let h = H(V, q.toggle.value) > -1
          if (!R[++c] && Object.prototype.hasOwnProperty.call(q, 'cookie_table') && (a || h)) {
            const n = q.cookie_table
            const p = va(Y[0])[0]
            const F = n.length
            q.toggle.reload === 'on_disable' && h && (xa = !0)
            for (h = 0; h < F; h++) {
              let w = n[h]
              const A = []
              let u = w[p]
              let r = w.is_regex || !1
              const B = w.domain || null
              w = w.path || !1
              B && (f = [B, '.' + B])
              if (r) {
                for (r = 0; r < d.length; r++) {
                  d[r].match(u) && A.push(d[r])
                }
              } else {
                ;(u = H(d, u)), u > -1 && A.push(d[u])
              }
              A.length > 0 && (bb(A, w, f), q.toggle.reload === 'on_clear' && (xa = !0))
            }
          }
        }
      }
    }
    const gb = function (a) {
      V = []
      const b = document.querySelectorAll('.c-tgl') || []
      if (b.length > 0) {
        for (let c = 0; c < b.length; c++) {
          H(a, I[c]) !== -1
            ? ((b[c].checked = !0), R[c] || (V.push(I[c]), (R[c] = !0)))
            : ((b[c].checked = !1), R[c] && (V.push(I[c]), (R[c] = !1)))
        }
      }
      K && e.autoclear_cookies && V.length > 0 && cb()
      t = { level: a, revision: e.revision, data: C, rfc_cookie: e.use_rfc_cookie }
      if (!K || V.length > 0 || !Z) {
        ;(Z = !0), (Ga = Pa(Qa())), Ra(e.cookie_name, JSON.stringify(t)), Ba()
      }
      if (
        !K &&
        (e.autoclear_cookies && cb(!0),
        typeof Ea === 'function' && Ea(m.getUserPreferences(), t),
        typeof pa === 'function' && pa(t),
        (K = !0),
        e.mode === 'opt-in')
      ) {
        return
      }
      typeof Da === 'function' && V.length > 0 && Da(t, V)
      xa && window.location.reload()
    }
    const hb = function (a, b) {
      if (typeof a !== 'string' || a === '' || document.getElementById('cc--style')) {
        b()
      } else {
        const c = k('style')
        c.id = 'cc--style'
        const d = new XMLHttpRequest()
        d.onreadystatechange = function () {
          this.readyState === 4 &&
            this.status === 200 &&
            (c.setAttribute('type', 'text/css'),
            c.styleSheet
              ? (c.styleSheet.cssText = this.responseText)
              : c.appendChild(document.createTextNode(this.responseText)),
            document.getElementsByTagName('head')[0].appendChild(c),
            b())
        }
        d.open('GET', a)
        d.send()
      }
    }
    var H = function (a, b) {
      for (let c = a.length, d = 0; d < c; d++) {
        if (a[d] === b) {
          return d
        }
      }
      return -1
    }
    var k = function (a) {
      const b = document.createElement(a)
      a === 'button' && b.setAttribute('type', a)
      return b
    }
    const ib = function (a, b) {
      return e.auto_language === 'browser'
        ? ((b = navigator.language || navigator.browserLanguage),
          b.length > 2 && (b = b[0] + b[1]),
          (b = b.toLowerCase()),
          za(b, a))
        : e.auto_language === 'document'
          ? za(document.documentElement.lang, a)
          : typeof b === 'string'
            ? (e.current_lang = za(b, a))
            : e.current_lang
    }
    const jb = function () {
      let a = !1
      let b = !1
      z(document, 'keydown', function (c) {
        c = c || window.event
        c.key === 'Tab' &&
          (v &&
            (c.shiftKey
              ? document.activeElement === v[0] && (v[1].focus(), c.preventDefault())
              : document.activeElement === v[1] && (v[0].focus(), c.preventDefault()),
            b ||
              oa ||
              ((b = !0),
              !a && c.preventDefault(),
              c.shiftKey
                ? v[3]
                  ? v[2]
                    ? v[2].focus()
                    : v[0].focus()
                  : v[1].focus()
                : v[3]
                  ? v[3].focus()
                  : v[0].focus())),
          !b && (a = !0))
      })
      document.contains &&
        z(
          L,
          'click',
          function (c) {
            c = c || window.event
            Ca
              ? M.contains(c.target)
                ? (oa = !0)
                : (m.hideSettings(0), (oa = !1))
              : na && x.contains(c.target) && (oa = !0)
          },
          !0,
        )
    }
    const db = function (a, b) {
      function c(f, l, q, h, n, p, F) {
        p = (p && p.split(' ')) || []
        if (H(l, n) > -1 && (J(f, n), (n !== 'bar' || p[0] !== 'middle') && H(q, p[0]) > -1)) {
          for (l = 0; l < p.length; l++) {
            J(f, p[l])
          }
        }
        H(h, F) > -1 && J(f, F)
      }
      if (typeof a === 'object') {
        const d = a.consent_modal
        a = a.settings_modal
        Q &&
          d &&
          c(
            x,
            ['box', 'bar', 'cloud'],
            ['top', 'middle', 'bottom'],
            ['zoom', 'slide'],
            d.layout,
            d.position,
            d.transition,
          )
        !b && a && c(E, ['bar'], ['left', 'right'], ['zoom', 'slide'], a.layout, a.position, a.transition)
      }
    }
    m.allowedCategory = function (a) {
      const b = K || e.mode === 'opt-in' ? JSON.parse(wa(e.cookie_name, 'one', !0) || '{}').level || [] : Ia
      return H(b, a) > -1
    }
    m.run = function (a) {
      if (
        !document.getElementById('cc_div') &&
        ((g = a),
        typeof g.cookie_expiration === 'number' && (e.cookie_expiration = g.cookie_expiration),
        typeof g.cookie_necessary_only_expiration === 'number' &&
          (e.cookie_necessary_only_expiration = g.cookie_necessary_only_expiration),
        typeof g.autorun === 'boolean' && (e.autorun = g.autorun),
        typeof g.cookie_domain === 'string' && (e.cookie_domain = g.cookie_domain),
        typeof g.cookie_same_site === 'string' && (e.cookie_same_site = g.cookie_same_site),
        typeof g.cookie_path === 'string' && (e.cookie_path = g.cookie_path),
        typeof g.cookie_name === 'string' && (e.cookie_name = g.cookie_name),
        typeof g.onAccept === 'function' && (pa = g.onAccept),
        typeof g.onFirstAction === 'function' && (Ea = g.onFirstAction),
        typeof g.onChange === 'function' && (Da = g.onChange),
        g.mode === 'opt-out' && (e.mode = 'opt-out'),
        typeof g.revision === 'number' && (g.revision > -1 && (e.revision = g.revision), (Fa = !0)),
        typeof g.autoclear_cookies === 'boolean' && (e.autoclear_cookies = g.autoclear_cookies),
        !0 === g.use_rfc_cookie && (e.use_rfc_cookie = !0),
        !0 === g.hide_from_bots &&
          (Ua =
            navigator &&
            ((navigator.userAgent && /bot|crawl|spider|slurp|teoma/i.test(navigator.userAgent)) ||
              navigator.webdriver)),
        (e.page_scripts = !0 === g.page_scripts),
        (e.page_scripts_order = !1 !== g.page_scripts_order),
        g.auto_language === 'browser' || !0 === g.auto_language
          ? (e.auto_language = 'browser')
          : g.auto_language === 'document' && (e.auto_language = 'document'),
        (e.current_lang = ib(g.languages, g.current_lang)),
        !Ua)
      ) {
        if (
          ((t = JSON.parse(wa(e.cookie_name, 'one', !0) || '{}')),
          (K = void 0 !== t.level),
          (C = void 0 !== t.data ? t.data : null),
          (Z = typeof a.revision === 'number' ? (K ? (a.revision > -1 ? t.revision === e.revision : !0) : !0) : !0),
          (Q = !K || !Z),
          fb(),
          hb(a.theme_css, function () {
            Wa()
            db(a.gui_options)
            Va()
            e.autorun && Q && m.show(a.delay || 0)
            setTimeout(function () {
              J(L, 'c--anim')
            }, 30)
            setTimeout(function () {
              jb()
            }, 100)
          }),
          K && Z)
        ) {
          const b = typeof t.rfc_cookie === 'boolean'
          if (!b || (b && t.rfc_cookie !== e.use_rfc_cookie)) {
            ;(t.rfc_cookie = e.use_rfc_cookie), Ra(e.cookie_name, JSON.stringify(t))
          }
          Ga = Pa(Qa())
          Ba()
          typeof pa === 'function' && pa(t)
        } else {
          e.mode === 'opt-out' && Ba(Ia)
        }
      }
    }
    m.showSettings = function (a) {
      setTimeout(
        function () {
          J(ra, 'show--settings')
          E.setAttribute('aria-hidden', 'false')
          Ca = !0
          setTimeout(function () {
            na ? (Ja = document.activeElement) : (qa = document.activeElement)
            ja.length !== 0 && (ja[3] ? ja[3].focus() : ja[0].focus(), (v = ja))
          }, 200)
        },
        a > 0 ? a : 0,
      )
    }
    var Ba = function (a) {
      if (e.page_scripts) {
        const b = document.querySelectorAll('script[' + e.script_selector + ']')
        const c = e.page_scripts_order
        const d = a || t.level || []
        const f = function (l, q) {
          if (q < l.length) {
            const h = l[q]
            let n = h.getAttribute(e.script_selector)
            if (H(d, n) > -1) {
              h.type = 'text/javascript'
              h.removeAttribute(e.script_selector)
              ;(n = h.getAttribute('data-src')) && h.removeAttribute('data-src')
              const p = k('script')
              p.textContent = h.innerHTML
              ;(function (F, w) {
                for (let A = w.attributes, u = A.length, r = 0; r < u; r++) {
                  const B = A[r].nodeName
                  F.setAttribute(B, w[B] || w.getAttribute(B))
                }
              })(p, h)
              n ? (p.src = n) : (n = h.src)
              n &&
                (c
                  ? p.readyState
                    ? (p.onreadystatechange = function () {
                        if (p.readyState === 'loaded' || p.readyState === 'complete') {
                          ;(p.onreadystatechange = null), f(l, ++q)
                        }
                      })
                    : (p.onload = function () {
                        p.onload = null
                        f(l, ++q)
                      })
                  : (n = !1))
              h.parentNode.replaceChild(p, h)
              if (n) {
                return
              }
            }
            f(l, ++q)
          }
        }
        f(b, 0)
      }
    }
    m.set = function (a, b) {
      switch (a) {
        case 'data':
          a = b.value
          var c = !1
          if (b.mode === 'update') {
            if (((C = m.get('data')), (b = typeof C === typeof a) && typeof C === 'object')) {
              !C && (C = {})
              for (var d in a) {
                C[d] !== a[d] && ((C[d] = a[d]), (c = !0))
              }
            } else {
              ;(!b && C) || C === a || ((C = a), (c = !0))
            }
          } else {
            ;(C = a), (c = !0)
          }
          c && ((t.data = C), Ra(e.cookie_name, JSON.stringify(t)))
          return c
        case 'revision':
          return (
            (d = b.value),
            (a = b.prompt_consent),
            (b = b.message),
            L && typeof d === 'number' && t.revision !== d
              ? ((Fa = !0),
                (Sa = b),
                (Z = !1),
                (e.revision = d),
                !0 === a ? (La(g), db(g.gui_options, !0), Wa(), m.show()) : m.accept(),
                (b = !0))
              : (b = !1),
            b
          )
        default:
          return !1
      }
    }
    m.get = function (a, b) {
      return JSON.parse(wa(b || e.cookie_name, 'one', !0) || '{}')[a]
    }
    m.getConfig = function (a) {
      return e[a] || g[a]
    }
    var Qa = function () {
      Ha = t.level || []
      Ta = I.filter(function (a) {
        return H(Ha, a) === -1
      })
      return { accepted: Ha, rejected: Ta }
    }
    var Pa = function (a) {
      let b = 'custom'
      const c = ya.filter(function (d) {
        return !0 === d
      }).length
      a.accepted.length === I.length ? (b = 'all') : a.accepted.length === c && (b = 'necessary')
      return b
    }
    m.getUserPreferences = function () {
      const a = Qa()
      return { accept_type: Pa(a), accepted_categories: a.accepted, rejected_categories: a.rejected }
    }
    m.loadScript = function (a, b, c) {
      const d = typeof b === 'function'
      if (document.querySelector('script[src="' + a + '"]')) {
        d && b()
      } else {
        const f = k('script')
        if (c && c.length > 0) {
          for (let l = 0; l < c.length; ++l) {
            c[l] && f.setAttribute(c[l].name, c[l].value)
          }
        }
        d &&
          (f.readyState
            ? (f.onreadystatechange = function () {
                if (f.readyState === 'loaded' || f.readyState === 'complete') {
                  ;(f.onreadystatechange = null), b()
                }
              })
            : (f.onload = b))
        f.src = a
        ;(document.head ? document.head : document.getElementsByTagName('head')[0]).appendChild(f)
      }
    }
    m.updateScripts = function () {
      Ba()
    }
    m.show = function (a) {
      Q &&
        setTimeout(
          function () {
            J(ra, 'show--consent')
            x.setAttribute('aria-hidden', 'false')
            na = !0
            setTimeout(function () {
              qa = document.activeElement
              v = Ka
            }, 200)
          },
          a > 0 ? a : 0,
        )
    }
    m.hide = function () {
      Q &&
        (Oa(ra, 'show--consent'),
        x.setAttribute('aria-hidden', 'true'),
        (na = !1),
        setTimeout(function () {
          qa.focus()
          v = null
        }, 200))
    }
    m.hideSettings = function () {
      Oa(ra, 'show--settings')
      Ca = !1
      E.setAttribute('aria-hidden', 'true')
      setTimeout(function () {
        na ? (Ja && Ja.focus(), (v = Ka)) : (qa && qa.focus(), (v = null))
        oa = !1
      }, 200)
    }
    m.accept = function (a, b) {
      a = a || void 0
      const c = b || []
      b = []
      const d = function () {
        for (var l = document.querySelectorAll('.c-tgl') || [], q = [], h = 0; h < l.length; h++) {
          l[h].checked && q.push(l[h].value)
        }
        return q
      }
      if (a) {
        if (typeof a === 'object' && typeof a.length === 'number') {
          for (var f = 0; f < a.length; f++) {
            H(I, a[f]) !== -1 && b.push(a[f])
          }
        } else {
          typeof a === 'string' && (a === 'all' ? (b = I.slice()) : H(I, a) !== -1 && b.push(a))
        }
      } else {
        b = d()
      }
      if (c.length >= 1) {
        for (f = 0; f < c.length; f++) {
          b = b.filter(function (l) {
            return l !== c[f]
          })
        }
      }
      for (f = 0; f < I.length; f++) {
        !0 === ya[f] && H(b, I[f]) === -1 && b.push(I[f])
      }
      gb(b)
    }
    m.eraseCookies = function (a, b, c) {
      const d = []
      c = c ? [c, '.' + c] : [e.cookie_domain, '.' + e.cookie_domain]
      if (typeof a === 'object' && a.length > 0) {
        for (let f = 0; f < a.length; f++) {
          this.validCookie(a[f]) && d.push(a[f])
        }
      } else {
        this.validCookie(a) && d.push(a)
      }
      bb(d, b, c)
    }
    var Ra = function (a, b) {
      let c = e.cookie_expiration
      typeof e.cookie_necessary_only_expiration === 'number' &&
        Ga === 'necessary' &&
        (c = e.cookie_necessary_only_expiration)
      b = e.use_rfc_cookie ? encodeURIComponent(b) : b
      const d = new Date()
      d.setTime(d.getTime() + 864e5 * c)
      c = '; expires=' + d.toUTCString()
      a = a + '=' + (b || '') + c + '; Path=' + e.cookie_path + ';'
      a += ' SameSite=' + e.cookie_same_site + ';'
      window.location.hostname.indexOf('.') > -1 && (a += ' Domain=' + e.cookie_domain + ';')
      window.location.protocol === 'https:' && (a += ' Secure;')
      document.cookie = a
    }
    var wa = function (a, b, c) {
      let d
      if (b === 'one') {
        if (
          (d = (d = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)')) ? (c ? d.pop() : a) : '') &&
          a === e.cookie_name
        ) {
          try {
            d = JSON.parse(d)
          } catch (f) {
            try {
              d = JSON.parse(decodeURIComponent(d))
            } catch (l) {
              d = {}
            }
          }
          d = JSON.stringify(d)
        }
      } else if (b === 'all') {
        for (a = document.cookie.split(/;\s*/), d = [], b = 0; b < a.length; b++) {
          d.push(a[b].split('=')[0])
        }
      }
      return d
    }
    var bb = function (a, b, c) {
      b = b || '/'
      for (let d = 0; d < a.length; d++) {
        for (let f = 0; f < c.length; f++) {
          document.cookie =
            a[d] +
            '=; path=' +
            b +
            (c[f].indexOf('.') > -1 ? '; domain=' + c[f] : '') +
            '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        }
      }
    }
    m.validCookie = function (a) {
      return wa(a, 'one', !0) !== ''
    }
    var z = function (a, b, c, d) {
      a.addEventListener
        ? !0 === d
          ? a.addEventListener(b, c, { passive: !0 })
          : a.addEventListener(b, c, !1)
        : a.attachEvent('on' + b, c)
    }
    var va = function (a) {
      if (typeof a === 'object') {
        const b = []
        let c = 0
        for (b[c++] in a) {
        }
        return b
      }
    }
    var J = function (a, b) {
      a.classList ? a.classList.add(b) : $a(a, b) || (a.className += ' ' + b)
    }
    var Oa = function (a, b) {
      a.classList
        ? a.classList.remove(b)
        : (a.className = a.className.replace(new RegExp('(\\s|^)' + b + '(\\s|$)'), ' '))
    }
    var $a = function (a, b) {
      return a.classList ? a.classList.contains(b) : !!a.className.match(new RegExp('(\\s|^)' + b + '(\\s|$)'))
    }
    return m
  }
  typeof window.initCookieConsent !== 'function' && (window.initCookieConsent = kb)
})()
