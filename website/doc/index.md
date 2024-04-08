---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: PURISTA - The typescript backend framework for IoT, edge, cloud and serverless
description: PURISTA is a typescript based nodejs framework to built typescript backends for iot, edge, server, cloud and serverless.

hero:
  name: "PURISTA"
  text: "THE TYPESCRIPT BACKEND FRAMEWORK"
  tagline: IoT/EDGE - SERVER - CLOUD - SERVERLESS
  image:
      src: /purista_logo.png
      alt: PURISTA
  actions:
    - theme: brand
      text: Get Started
      link: /handbook/cli
    - theme: alt
      text: API Documentation
      link: /api/README

features:
  - title: 100% Typescript
    details: typescript based and with typescript in mind and mostly async-await (no call-back hell)
    link: /handbook/1_quickstart/setup-the-purista-project
    icon: 🛠️

  - title: K.I.S.S
    details: simply just implement your logic without overhead
    link: /handbook/concept
    icon: 💋

  - title: Modular & extendable
    details: adding new functions and services is simple, fast and isolated
    link: /handbook/concept
    icon: 📦

  - title: Scales
    details: runs and scales from small single instance up to cloud clusters and cloud functions.
    link: /handbook/5_deploy_and_scale/monolithic
    icon: 📈

  - title: Compliance & Monitoring
    details: flexible to trace, audit and monitor and to get a clear picture of what's going on
    link: /handbook/4_open_telemetry/
    icon: 🕵️

  - title: Easy to test
    details: "easy to test with ready to go mocks & stubs which increases productivity and reduces costs"
    link: /handbook/2_building_business-logic/command/test-a-command
    icon: ✅
---
