<template>
  <div v-if="showFlag" id="comment-container"></div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, nextTick } from 'vue'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { useData, useRouter } from 'vitepress'
import md5 from 'blueimp-md5'

const { page } = useData()
const { route } = useRouter()

const gitDefault = {
  clientID: '013e5673e91fe10c293f',
  clientSecret: 'bb3a3512d7ec932e47f082b955658861d3b45f87',
  repo: 'vitepress-blog-gitalk',
  owner: 'llwodexue',
  admin: ['llwodexue'],
  id: md5(page.value.relativePath),
  language: 'zh-CN',
  distractionFreeMode: false,
  // 默认: https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token
  proxy: 'https://vercel.charles7c.top/github_access_token'
}

const showFlag = ref(true)
// 渲染评论组件
onMounted(() => {
  watch(
    () => route.path,
    () => {
      showFlag.value = false
      nextTick(() => {
        showFlag.value = true
        setTimeout(() => {
          // 初始化评论组件配置
          const gitalk = new Gitalk({ ...gitDefault, id: md5(page.value.relativePath) })

          gitalk.render('comment-container')
          // 点赞前检查登录状态
          const commentContainer: HTMLElement | null =
            document.getElementById('comment-container')

          commentContainer?.addEventListener('click', (event: Event) => {
            if (!window.localStorage.getItem('GT_ACCESS_TOKEN')) {
              alert('点赞前，请先登录')
              event.preventDefault()
            }
          })

          // 提交评论后重置输入框高度
          commentContainer?.addEventListener('click', (event: Event) => {
            const gtTextarea: HTMLElement | null =
              document.querySelector('.gt-header-textarea')
            if (gtTextarea) {
              ;(gtTextarea as HTMLInputElement).style.height = '72px'
            }
          })

          // 点击预览时切换评论按钮可见性
          commentContainer?.addEventListener('click', (event: Event) => {
            const commentButton: HTMLElement | null = document.querySelector(
              '.gt-header-controls .gt-btn-public'
            )
            if (commentButton) {
              commentButton.classList.toggle('hide')
            }
          })
        }, 0)
      })
    },
    { immediate: true }
  )
})
</script>
