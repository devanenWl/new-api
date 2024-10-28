# Midjourney Proxy API文档

**简介**:Midjourney Proxy API文档

## 接口列表
支持的接口如下：
+ [x] /mj/submit/imagine
+ [x] /mj/submit/change
+ [x] /mj/submit/blend
+ [x] /mj/submit/describe
+ [x] /mj/image/{id} （通过此接口获取图片，**请必须在System settings中填写Server Address！！**）
+ [x] /mj/task/{id}/fetch （此接口返回的Image URL为经过One API转发的地址）
+ [x] /task/list-by-condition
+ [x] /mj/submit/action （仅midjourney-proxy-plus支持，下同）
+ [x] /mj/submit/modal
+ [x] /mj/submit/shorten
+ [x] /mj/task/{id}/image-seed
+ [x] /mj/insight-face/swap （InsightFace）

## Model列表

### midjourney-proxy支持

- mj_imagine (绘图)
- mj_variation (变换)
- mj_reroll (重绘)
- mj_blend (混合)
- mj_upscale (放大)
- mj_describe (图生文)

### 仅midjourney-proxy-plus支持

- mj_zoom (比例变焦)
- mj_shorten (Prompt词缩短)
- mj_modal (窗口Submit，局部重绘和Custom比例变焦必须和mj_modal一同添加)
- mj_inpaint (局部重绘Submit，必须和mj_modal一同添加)
- mj_custom_zoom (Custom比例变焦，必须和mj_modal一同添加)
- mj_high_variation (强变换)
- mj_low_variation (弱变换)
- mj_pan (平移)
- swap_face (换脸)

## Model价格Settings（在Settings-Operations settings-Model固定价格Settings中Settings）
```json
{
  "mj_imagine": 0.1,
  "mj_variation": 0.1,
  "mj_reroll": 0.1,
  "mj_blend": 0.1,
  "mj_modal": 0.1,
  "mj_zoom": 0.1,
  "mj_shorten": 0.1,
  "mj_high_variation": 0.1,
  "mj_low_variation": 0.1,
  "mj_pan": 0.1,
  "mj_inpaint": 0,
  "mj_custom_zoom": 0,
  "mj_describe": 0.05,
  "mj_upscale": 0.05,
  "swap_face": 0.05
}
```
其中mj_inpaint和mj_custom_zoom的价格Settings为0，是因为这两个Model需要搭配mj_modal使用，所以价格由mj_modal决定。

## ChannelSettings

### 对接 midjourney-proxy(plus)

1.

部署Midjourney-Proxy，并配置好midjourney账号等（强烈建议SettingsKey），[项目地址](https://github.com/novicezk/midjourney-proxy)

2. 在ChannelManagement中添加Channel，ChannelType选择**Midjourney Proxy**，如果是plusVersion选择**Midjourney Proxy Plus**
   ，Model请参考上方Model列表
3. **Proxy**填写midjourney-proxy部署的地址，For example：http://localhost:8080
4. Key填写midjourney-proxy的Key，如果没有SettingsKey，可以随便填

### 对接上游new api

1. 在ChannelManagement中添加Channel，ChannelType选择**Midjourney Proxy Plus**，Model请参考上方Model列表
2. **Proxy**填写上游new api的地址，For example：http://localhost:3000
3. Key填写上游new api的Key