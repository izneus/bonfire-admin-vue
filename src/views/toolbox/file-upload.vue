<template>
  <div>
    <uploader
      :options="options"
      :auto-start="false"
      :file-status-text="setStatusText"
      class="uploader-example"
      @file-added="onFileAdded"
      @file-complete="fileComplete"
    >
      <uploader-unsupport />
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>选择文件</uploader-btn>
        <uploader-btn :attrs="attrs">选择图片</uploader-btn>
        <uploader-btn :directory="true">选择文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list />
    </uploader>

    <el-upload
      ref="upload"
      action="/aaa"
      :auto-upload="false"
      :http-request="uploadToOss"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
import { getUploadUrl, mergeChunks } from '@/api/file'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import SparkMD5 from 'spark-md5'

export default {
  name: 'FileUpload',
  data() {
    return {
      statusText: null,
      options: {
        target: process.env.VUE_APP_BASE_API + '/v1/file/uploadChunk',
        testChunks: true,
        chunkSize: 5 * 1024 * 1024,
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        checkChunkUploadedByResponse: function(chunk, message) {
          const objMessage = JSON.parse(message)
          return (objMessage.uploadChunks || []).indexOf(chunk.offset + 1) >= 0
        }
      },
      attrs: {
        accept: 'image/*'
      },
      fileList: []
    }
  },
  methods: {
    setStatusText(status, response) {
      const statusTextMap = {
        success: '成功',
        error: '错误',
        uploading: '上传中',
        paused: '暂停',
        waiting: '等待中'
      }
      if (status === 'paused' && this.statusText === '计算md5') {
        return this.statusText
      } else {
        return statusTextMap[status]
      }
    },
    generateMd5(file) {
      this.statusText = '计算md5'
      return new Promise(function(resolve, reject) {
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
        const chunkSize = 5 * 1024 * 1024 // Read in chunks of 2MB
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        // 暂停文件上传
        file.pause()
        fileReader.onload = function(e) {
          console.log('read chunk nr', currentChunk + 1, 'of', chunks)
          spark.append(e.target.result) // Append array buffer
          currentChunk++

          if (currentChunk < chunks) {
            loadNext()
          } else {
            const md5 = spark.end()
            console.log('finished loading')
            console.info('computed hash', md5) // Compute hash
            resolve({ md5, file })
          }
        }

        fileReader.onerror = function() {
          console.warn('oops, something went wrong.')
          file.cancel()
          reject()
        }

        function loadNext() {
          const start = currentChunk * chunkSize
          const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

          fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
        }

        loadNext()
      })
    },
    startUpload({ md5, file }) {
      file.uniqueIdentifier = md5
      file.resume()
      this.statusText = null
      // this.statusRemove(file.id)
    },
    onFileAdded(file) {
      // 计算MD5，完成后开始上传操作
      this.generateMd5(file).then((result) => this.startUpload(result))
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete(rootFile) {
      // console.log('file complete', rootFile)
      mergeChunks({
        filename: rootFile.file.name,
        identifier: rootFile.uniqueIdentifier,
        totalSize: rootFile.file.size,
        type: rootFile.file.type
      }).then(res => {
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadToOss(param) {
      getUploadUrl().then(res => {
        // console.log(res.data)
        const url = res.data
        axios.put(url, param.file).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>

<style scoped>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
