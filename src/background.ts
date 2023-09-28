// electron 主进程文件
import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true, //可以在渲染进程中使用node的api，为了安全为false
      contextIsolation: false, //关闭渲染进程的沙箱
      webSecurity: false // 关闭浏览器跨域检测
    }
  })

  // win.webContents.openDevTools() //打开devTools

  if (process.argv[2]) {
    win.loadURL(process.argv[2])
  } else {
    win.loadFile('index.html')
  }
})
