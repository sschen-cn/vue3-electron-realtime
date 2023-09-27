// 生产环境

import type { Plugin } from 'vite'
import fs from 'node:fs'
import * as electronBuilder from 'electron-builder'
import path from 'path'

const buildBackground = () => {
  require('esbuild').buildSync({
    entryPoints: ['src/background.ts'],
    bundle: true,
    outfile: 'dist/background.js',
    external: ['electron']
  })
}
// 打包要先等vite打完包就有index.html 再执行electron-builder 打包
export const ElectrongBuildPlugin = (): Plugin => {
  return {
    name: 'electron-build',
    //
    closeBundle() {
      buildBackground()
      // electron-builder 指定pakage.json main
      const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
      json.main = 'background.js'
      fs.writeFile('dist/package.json', JSON.stringify(json, null, 4), () => {})
      // bug electron-builder 下载垃圾文件
      fs.mkdirSync('dist/node_modules')
      electronBuilder.build({
        targets: new Map([
          ...electronBuilder.Platform.MAC.createTarget(),
          ...electronBuilder.Platform.WINDOWS.createTarget()
        ]),
        config: {
          directories: {
            output: path.resolve(process.cwd(), 'release'),
            app: path.resolve(process.cwd(), 'dist')
          },
          asar: false,
          appId: 'com.electron-realtime.app',
          productName: 'electron-realtime',
          compression: 'store',
          nsis: {
            oneClick: false, // 取消一键安装
            allowToChangeInstallationDirectory: true // 允许用户选择安装目录
          }
        }
      })
    }
  }
}
