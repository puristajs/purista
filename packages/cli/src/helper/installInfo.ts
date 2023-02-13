/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'

import { isPackageInstalled } from './isPackageInstalled.js'

type ServiceEntry = {
  name: string
  version: number
  path: string
  builderFile: string
}
type InstallInfo = {
  sinonIsPresent: boolean
  jestIsPresent: boolean
  services: ServiceEntry[]
}

export const installInfo: InstallInfo = {
  sinonIsPresent: false,
  jestIsPresent: false,
  services: [],
}

const matchVersionRegex = /^\D*(\d+)$/i

const getServiceVersions = (startFolder: string, serviceName: string) => {
  const files = fs.readdirSync(startFolder)

  const service: ServiceEntry = {
    name: serviceName,
    version: 0,
    path: '',
    builderFile: '',
  }

  files.forEach((file) => {
    const name = path.join(startFolder, file)
    if (fs.statSync(name).isDirectory()) {
      const versionInfo = file.match(matchVersionRegex)
      if (versionInfo && versionInfo.length === 2) {
        service.version = parseInt(versionInfo[1])
        service.path = path.join(serviceName, path.basename(file))
      }
    } else {
      service.builderFile = path.basename(file)
      console.log('file:', path.basename(file))
    }
  })

  installInfo.services.push(service)
}

export const collectServices = (startFolder: string) => {
  const files = fs.readdirSync(startFolder)
  files.forEach((file) => {
    const name = path.join(startFolder, file)
    if (fs.statSync(name).isDirectory()) {
      getServiceVersions(name, path.parse(file).name)
    } else {
      // allFilesList.push(name) // push filename into the array
    }
  })

  installInfo.services.sort((a, b) => {
    if (b.name < a.name) {
      return 1
    }
    if (b.name > a.name) {
      return -1
    }
    if (b.version < a.version) {
      return 1
    }
    if (b.version > a.version) {
      return -1
    }
    return 0
  })
}

export const collectInstallInfo = async () => {
  installInfo.sinonIsPresent = await isPackageInstalled('sinon')
  installInfo.jestIsPresent = await isPackageInstalled('jest')
}
