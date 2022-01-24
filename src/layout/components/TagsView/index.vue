<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        <span class="tags-view-title">{{ generateTitle(tag.title) }}</span>
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        <svg width="7" height="7" class="tabs-background-before">
          <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
        </svg>
        <svg width="7" height="7" class="tabs-background-after">
          <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
        </svg>
        <div class="tabs-divider" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <div style="display: flex">
          <i class="ri-refresh-line" style="flex:2;" />
          <span style="flex: 8;">{{ $t('tagsView.refresh') }}</span>
        </div>
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <div style="display: flex">
          <i class="ri-close-circle-line" style="flex:2;" />
          <span style="flex: 8;">{{ $t('tagsView.close') }}</span>
        </div>
      </li>
      <li @click="closeOthersTags">
        <div style="display: flex">
          <span style="flex: 2;" />
          <span style="flex: 8;">{{ $t('tagsView.closeOthers') }}</span>
        </div>
      </li>
      <li @click="closeAllTags(selectedTag)">
        <div style="display: flex">
          <span style="flex: 2;" />
          <span style="flex: 8;">{{ $t('tagsView.closeAll') }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import { generateTitle } from '@/utils/i18n'
import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      // noinspection JSUnresolvedVariable
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 40px;
  width: 100%;
  background: #f0f2f5;
  padding-top: 6px;
  //padding-left: 10px;
  //border-bottom: 1px solid #DCDFE6;
  //box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      z-index: 1;
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 34px;
      width: 120px;
      line-height: 34px;
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      //border: 1px solid #d8dce5;
      border: none;
      //border-bottom: solid 1px #DCDFE6;
      color: #999;
      background: #f0f2f5;
      //padding: 0 8px;
      padding: 0 16px;
      font-size: 14px;
      margin: 0 0;
      //margin-left: 5px;
      //margin-top: 4px;
      /*&:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }*/
      .tabs-background-before,
      .tabs-background-after {
        bottom: 0;
        position: absolute;
        fill: #f0f2f5;
        //transition: background @speed;
      }
      .tabs-background-before {
        left: -7px;
      }
      .tabs-background-after {
        right: -7px;
      }
      /* divider */
      .tabs-divider {
        left: 0;
        top: 50%;
        width: 1px;
        height: 14px;
        background-color: #a9adb0;
        position: absolute;
        transform: translateY(-50%);
      }
      &:first-child {
        margin-left: 10px;
        .tabs-divider {
          background-color: transparent;
        }
      }
      &.active {
        z-index: 3;
        background-color: #ffffff;
        color: rgba(0, 0, 0, 0.85);
        .tabs-background-before,
        .tabs-background-after {
          fill: #ffffff;
          //transition: background @speed;
        }
        .tabs-divider {
          background-color: #ffffff;
        }
        & + .tags-view-item {
          .tabs-divider {
            background-color: transparent;
          }
        }
        //border-color: #1890ff;
        //padding-bottom: 3px;
        //border-bottom: solid 1px #DCDFE6;
        /*&::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }*/
      }
      &:hover:not(.active) {
        z-index: 2;
        background-color: rgba(0,0,0,.06);
        .tabs-background-before,
        .tabs-background-after {
          fill: rgba(0,0,0,.06);
          //transition: background @speed;
        }
        .tabs-divider {
          background-color: transparent;
        }
        & + .tags-view-item {
          .tabs-divider {
            background-color: transparent;
          }
        }
      }
    }
  }
  .contextmenu {
    width: 120px;
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    li {
      font-size: 14px;
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .el-scrollbar__wrap {
    overflow: hidden;
    margin-bottom: 0!important;
  }

  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 11px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.9);
        display: inline-block;
        //vertical-align: -4px;
        font-size: 16px;
      }
      &:hover {
        background-color: #e8eaed;
        color: #999;
      }
    }
    .tags-view-title {
      width: 74px;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 4px;
      display: inline-block;
      mask-image: linear-gradient(90deg,#000 0%,#000 calc(100% - 24px),transparent);
    }
  }
}
</style>
