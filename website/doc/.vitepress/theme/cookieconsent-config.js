


 export default {
    guiOptions: {
      consentModal: {
        layout: 'box wide',
        position: 'middle center',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        position: 'right',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    categories: {
      necessary: {
        readOnly: true,
      },
      analytics: {},
    },
    language: {
      default: 'en',
      autoDetect: 'browser',
      translations: {
        en: {
          consentModal: {
            title: 'Privacy settings',
            description:
              `Our website uses essential cookies and external services to ensure its proper operation and tracking cookies to understand how you interact with it.
              The latter will be set only after consent.
              We also use embedded content like videos and presentations which are hosted on third-party-providers.`,
            closeIconLabel: '',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
            footer: '<a href="/privacy.html">Privacy Policy</a>\n',
          },
          preferencesModal: {
            title: 'Consent Preferences Center',
            closeIconLabel: 'Close modal',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                description:
                  'We also use cookies to remember you privacy and settings. These cookies do only contain technical, but no personal information.',
                linkedCategory: 'necessary',
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    domain: 'Domain',
                    desc: 'Description',
                  },
                  body: [
                    {
                      name: 'cc_cookie',
                      domain: 'purista.dev',
                      desc: 'Remembers your privacy decessions',
                    },
                  ],
                },
              },
              {
                title: 'Analytics Cookies',
                description:
                  'We would like to know how successful our website is. Therefore, we use Google Analytics to find out, for example, the number of monthly visitors to our website.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Cookie',
                    domain: 'Domain',
                    desc: 'Description',
                  },
                  body: [
                    {
                      name: '_ga',
                      domain: 'purista.dev',
                      desc: 'The main cookie used by Google Analytics, enables the service to distinguish one visitor from another and lasts for 2 years',
                    },
                    {
                      name: '_gid',
                      domain: 'purista.dev',
                      desc: 'A unique ID that is used to generate statistical data on how the visitor uses the website. This cookie expires after 1 day. collect: is used to send data to Google Analytics about the visitors device and behavior.',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    onConsent: function (e) {
      if (e.cookie.categories.includes('necessary')) {
        loadNecessary()
      }

      if (e.cookie.categories.includes('analytics')) {
        loadGoogleAnalytics()
      }
    },
  }


function loadGoogleAnalytics() {
  const g = document.createElement('script')
  g.onload = function () {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())

    gtag('config', 'G-02L3K7YXXK')
  }
  g.src = 'https://www.googletagmanager.com/gtag/js?id=G-02L3K7YXXK'

  document.head.appendChild(g)
}

function loadNecessary() {}
