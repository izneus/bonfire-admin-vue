/**
 * 常用正则表达式
 */

/**
 * 用户名必须为5-20位，包含字母和数字
 */
export const REG_USERNAME = /^[a-zA-Z0-9]{5,20}$/

/**
 * 密码必须包含大小写字母和数字，长度为8～16
 */
export const REG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/

/**
 * 手机号码
 */
export const REG_MOBILE = /^1\d{10}$/

