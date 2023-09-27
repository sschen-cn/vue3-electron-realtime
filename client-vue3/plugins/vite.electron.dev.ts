// 开发环境
import type { AddressInfo } from 'net'
import type { Plugin } from 'vite'
import { spawn, exec } from 'child_process'
import fs from 'node:fs'
//vite插件要求返回一个带name属性的对象
// 钩子函数
const buildBackground = () => {
  require('esbuild').buildSync({
    entryPoints: ['src/background.ts'],
    bundle: true,
    outfile: 'dist/background.js',
    external: ['electron']
  })
}
export const EletronDevPlugin = (): Plugin => {
  return {
    name: 'electron-dev',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        buildBackground()
        // 读取vite服务信息
        const addressInfo = server.httpServer?.address() as AddressInfo
        // 拼接ip地址 给electron启动服务用
        const IP = `http://localhost:${addressInfo.port}`
        // 第一个参数是electron的入口文件
        // require('electron')返回路径
        // electron 不认ts文件 编译成js文件

        let ElectronProcess = spawn('electron', ['dist/background.js', IP])
        fs.watchFile('src/background.ts', () => {
          ElectronProcess.kill()
          buildBackground()
          ElectronProcess = spawn('electron', ['dist/background.js', IP])
        })
        ElectronProcess.stderr.on('data', (data) => {
          console.log('日志', data.toString())
        })
      })
    }
  }
}
