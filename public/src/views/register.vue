<template>
  <div>
    <div class="register_from">
      <div class="yun_input">
        <div class="yun_input_hd">
          <img class="cell_hd_img" src="../assets/login/UserIcon@26x.png">
        </div>
        <div class="yun_cell_bd">
          <input class="weui_input" type="text" placeholder="姓名">
        </div>
      </div>
      <div class="yun_input">
        <div class="yun_input_hd">
          <img class="cell_hd_img" src="../assets/register/Group3@36x.png">
        </div>
        <div class="yun_cell_bd">
          <input class="weui_input" type="number" pattern="[0-9]*" placeholder="输入手机号">
        </div>
        <div class="code_fd">
          <button v-if='!isSendCode' @click="sendCode" class="code weui_btn weui_btn_plain_primary">获取验证码</button>
          <button v-if='isSendCode' class="coded weui_btn weui_btn_plain_primary">重新发送({{sendTime}})s</button>
        </div>
        <div style="clear: left"></div>
      </div>
      <div class="yun_input">
        <div class="yun_input_hd">
          <img class="cell_hd_img" src="../assets/register/Group4@36x.png">
        </div>
        <div class="yun_cell_bd">
          <input class="weui_input" type="text" placeholder="输入手机验证码">
        </div>
      </div>
      <div class="yun_input">
        <div class="yun_input_hd">
          <img class="cell_hd_img" src="../assets/login/PasswordIcon@26x.png">
        </div>
        <div class="yun_cell_bd">
          <input class="weui_input" type="{{type}}" placeholder="密码">
        </div>
        <div class="shwo_img_fd">
          <img class="shwo_img" v-show="!isShow" @click="showPassword" src="../assets/login/ShowPasswordIcon@26x.png">
          <img class="shwo_img" v-show="isShow" @click="showPassword" src="../assets/login/closePassword.png">
        </div>
        <div style="clear: left"></div>
      </div>
    </div>
    <div class="register_button">
      <button class="weui_btn  yun_button yun_button_orange">注册</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'login',
    data: function () {
      return {
        isShow: true,
        type: 'password',
        isSendCode: false,
        sendTime: 60
      };
    },
    ready: function () {
      document.title = '注册';
    },
    methods: {
      showPassword: function () {
        if (this.isShow) {
          this.isShow = false;
          this.type = 'text';
        } else {
          this.isShow = true;
          this.type = 'password';
        }
      }, sendCode: function () {
        this.isSendCode = this.isSendCode || true;
        console.info(this.isSendCode);
        let sendTimer = setInterval(() => {
          if (this.sendTime < 0) {
            clearInterval(sendTimer);
            this.isSendCode = false;
            this.isSendCode = 60;
          } else {
            this.sendTime--;
          }
        }, 1000);
      }
    },
    components: {}
  };
</script>
<style>
  .register_from {
    padding-top: 1.3rem;
    margin-left: 2.1rem;
    margin-right: 2.1rem;
  }

  .register_button {
    margin-top: 6.4rem;
    margin-right: 3.8rem;
    margin-left: 3.8rem;
  }

  .register_from .code_fd {
    right: 0;
  }

  .register_from .code {
    width: 4.6rem;
    height: 1.6rem;
    border-radius: 1rem;
    border: 1px solid #FB8557;
    font-size: 0.7rem;
    color: #FB8557;
    padding: 0;
  }

  .register_from .coded {
    width: 5.2rem;
    height: 1.6rem;
    border-radius: 1rem;
    border: 1px solid #E4E7F0;
    font-size: 0.7rem;
    color: #A1A6BB;
    padding: 0;
  }

  .title {
    width: 100vw;
    height: 3.6rem;
    text-align: center;
    position: relative;
    font-size: 1.1rem;
    margin-left: auto;
    margin-right: auto;
    text-decoration: none;
    line-height: 3.33333333;
  }

  .title .title_bg {
    width: 100vw;
    height: 3.6rem;
    background-color: #FB8557;
    opacity: 0.18;
    position: absolute;
  }

  .title .title_back {
    height: 1.3rem;
    width: 1.3rem;
    padding-top: 1.1rem;
    padding-left: 0.8rem;
    background-image: url("../assets/register/Bitmap@36x.png");
    background-repeat: no-repeat;
    background-position: 0.8rem 1.1rem;
    background-size: 1.3rem 1.3rem;
    position: absolute;
  }

  .title label {
    color: #FB8557;
    opacity: 1;
    font-size: 1.1rem;
  }
</style>

