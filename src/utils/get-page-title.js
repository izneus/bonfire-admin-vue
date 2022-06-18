import defaultSettings from '@/settings'
import i18n from '@/lang'

const title = defaultSettings.title || 'Vue Element Admin'

export default function getPageTitle(key) {
  console.log(key)
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  } else {
    // 无i18n支持就走下面
    return `${key} - ${title}`
  }
  // return `${title}`
}
