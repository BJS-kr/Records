---
marp: true
theme: default
style: |
    img[alt~="center"] {
      display: block;
      margin: 0 auto;
    }
_header: '![w:150](data:image/png;base64,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)'
---

![w:500 center](https://www.devteam.space/wp-content/uploads/2022/05/nodejs.jpg)

---
![bg left: 50%](https://deadline.com/wp-content/uploads/2022/08/Netflix_Symbol_logo.jpg?w=681&h=383&crop=1)
![bg left: 50%](https://ugtechmag.com/wp-content/uploads/2022/10/Linkedin-Logo.png)
![bg left: 50%](https://1000logos.net/wp-content/uploads/2017/09/Uber-logo.jpg)

---
![bg left: 33%](https://yt3.googleusercontent.com/_q52i8bUAEvcb7JR4e-eNTv23y2A_wg5sCz0NC0GrGtcw1CRMWJSOPVHUDh_bngD0q4gMvVeoA=s900-c-k-c0x00ffffff-no-rj)
![bg left: 33%](https://yt3.googleusercontent.com/ytc/AL5GRJUyNSclWVdzjF267_EFUDHth4IXcUlcQCjEfNTvSw=s900-c-k-c0x00ffffff-no-rj)
![bg right: 33%](https://assets-global.website-files.com/614c84345b19bbf21bb9a03e/63495c1035d9db70756c6382_Notion_app_logo.png)

---
![bg left](https://w0.peakpx.com/wallpaper/628/51/HD-wallpaper-laptop-book-aesthetics.jpg)

---
<style scoped>
  {
    font-size: 30px;
    font-family: "Times New Roman",cursive;
  }
</style>
### 긴 여정
![bg right](https://i.pinimg.com/originals/34/49/13/3449138f656d278b1eeaf93e17138d4f.jpg)

---
![bg](https://images.velog.io/images/leejuhwan/post/9be1be47-8776-46e1-923e-043e3e4239e6/hanghae99.jpg)

