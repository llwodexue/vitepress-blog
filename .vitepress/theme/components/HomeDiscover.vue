<script setup lang="ts">
import { withBase } from 'vitepress'

interface LearningRoute {
  icon: string
  title: string
  description: string
  link: string
}

const learningRoutes: LearningRoute[] = [
  {
    icon: '⚙️',
    title: '从语言到工程化',
    description: '先建立 JavaScript 与 TypeScript 基础，再理解模块、构建和性能优化。',
    link: '/1-js/01-函数式编程范式'
  },
  {
    icon: '🧠',
    title: '补齐计算机基础',
    description: '从网络、操作系统、数据结构和算法理解前端运行的底层环境。',
    link: '/3-base/01-基本概念'
  },
  {
    icon: '🖥️',
    title: '走向全栈与部署',
    description: '通过 Node.js、服务器、容器和发布流程，把项目交付到真实环境。',
    link: '/6-node/01-Node基础'
  }
]

const featuredNotes: LearningRoute[] = [
  {
    icon: '🌿',
    title: '家庭与教育',
    description: '从听书与生活笔记中整理可复盘的沟通、成长和关系方法。',
    link: '/8-notes/生活绿洲/家庭与教育/10到25岁：激励年轻人的科学——引领下一代的突破性方法，并让你的生活更加轻松'
  },
  {
    icon: '🧩',
    title: '跨端与实用专题',
    description: '聚合小程序、性能优化、数学与调研等不属于单一技术栈的实践主题。',
    link: '/10-other/01-邂逅小程序开发'
  }
]
</script>

<template>
  <section class="home-discover">
    <div class="home-discover__heading">
      <p class="home-discover__eyebrow">建议路径</p>
      <h2 class="home-discover__title">从知识点走向完整能力</h2>
      <p class="home-discover__description">
        每条路线都从一个可直接开始的主题进入，再逐步延展到对应的 sidebar。
      </p>
    </div>
    <div class="home-discover__grid">
      <a
        v-for="route in learningRoutes"
        :key="route.title"
        class="home-discover__card"
        :href="withBase(route.link)"
      >
        <span class="home-discover__icon" aria-hidden="true">{{ route.icon }}</span>
        <h3 class="home-discover__card-title">{{ route.title }}</h3>
        <p class="home-discover__card-description">{{ route.description }}</p>
        <span class="home-discover__link">开始学习 →</span>
      </a>
    </div>

    <div class="home-discover__heading home-discover__heading--secondary">
      <p class="home-discover__eyebrow">持续探索</p>
      <h2 class="home-discover__title">技术之外，也记录生活</h2>
    </div>
    <div class="home-discover__grid home-discover__grid--notes">
      <a
        v-for="note in featuredNotes"
        :key="note.title"
        class="home-discover__card"
        :href="withBase(note.link)"
      >
        <span class="home-discover__icon" aria-hidden="true">{{ note.icon }}</span>
        <h3 class="home-discover__card-title">{{ note.title }}</h3>
        <p class="home-discover__card-description">{{ note.description }}</p>
        <span class="home-discover__link">进入专题 →</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.home-discover {
  width: min(1152px, calc(100% - 48px));
  margin: 72px auto 96px;
}

.home-discover__heading {
  max-width: 640px;
  margin-bottom: 24px;
}

.home-discover__heading--secondary {
  margin-top: 64px;
}

.home-discover__eyebrow {
  margin: 0 0 8px;
  color: var(--vp-c-brand);
  font-size: 14px;
  font-weight: 600;
}

.home-discover__title {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 28px;
  line-height: 1.25;
}

.home-discover__description {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.home-discover__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.home-discover__grid--notes {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.home-discover__card {
  display: block;
  min-height: 184px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.home-discover__card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: var(--vp-shadow-2);
  transform: translateY(-3px);
}

.home-discover__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  font-size: 20px;
}

.home-discover__card-title {
  margin: 16px 0 8px;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.home-discover__card-description {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.home-discover__link {
  display: inline-block;
  margin-top: 16px;
  color: var(--vp-c-brand);
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .home-discover {
    width: min(100% - 32px, 640px);
    margin-top: 48px;
    margin-bottom: 64px;
  }

  .home-discover__grid,
  .home-discover__grid--notes {
    grid-template-columns: 1fr;
  }

  .home-discover__heading--secondary {
    margin-top: 48px;
  }
}
</style>
