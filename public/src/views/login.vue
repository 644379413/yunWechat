<template>
  <div>
    <div>
      <div class="login_box">
        <div class="login_img">
          <img src="../assets/login/LOGO-psd_03@26x.png">
        </div>
        <div class="login_from">
          <div class="yun_input">
            <div class="yun_input_hd">
              <img class="cell_hd_img" src="../assets/login/UserIcon@26x.png">
            </div>
            <div class="yun_cell_bd">
              <input class="weui_input" type="number" pattern="[0-9]*" placeholder="手机号码">
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
              <img class="shwo_img" v-show="!isShow" @click="showPassword"
                   src="../assets/login/ShowPasswordIcon@26x.png">
              <img class="shwo_img" v-show="isShow" @click="showPassword" src="../assets/login/closePassword.png">
            </div>
          </div>
        </div>
        <div style="clear: left"></div>
        <div class="forget"><label>忘记密码?</label></div>
        <div class="login_buttons">
          <button class="weui_btn  yun_button yun_button_orange">登陆</button>
          <button v-link="{name:'register'}" class="weui_btn  yun_button yun_button_orange_powder">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'login',
    data: function () {
      return {
        isShow: true,
        type: 'password'
      };
    }, ready: function () {
      document.title = '登陆';
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
      }
    },
    components: {}
  };
</script>
<style>

  .login_box {
    width: 100vw;
    height: 100vh;
    background: #F9F9F9;
  }

  .login_box .login_img {
    position: relative;
    padding-top: 2.6rem;
    margin-left: 5.5rem;
    margin-right: 5.5rem;
    margin-bottom: 4rem;
    width: 9.9rem;
    height: 4rem;

  }

  .login_img img {
    width: 9.9rem;
    height: 4rem;
  }

  .login_box .login_from {
    margin-left: 2.1rem;
    margin-right: 2.1rem;
    height: 6.6rem;
  }

  .cell_hd_img {
    width: 1rem;
    height: 0.9rem;
  }

  .yun_input {
    height: 3.3rem;
    border-bottom: 0.1rem solid #E4E7F0;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;

  }

  .yun_input .yun_input_hd {
    margin-right: 0.7rem;
    padding-top: 0.2rem;
  }

  .yun_input .yun_cell_bd {
  }

  .shwo_img_fd {
    float: left;
    margin-left: 3.6rem;
  }

  .shwo_img {
    width: 1rem;
    height: 0.7rem;
  }

  .login_box .forget {
    font-size: 0.8rem;
    color: #A3A8BC;
    margin-left: 2.1rem;
    margin-top: 0.9rem;
    margin-bottom: 2.2rem;
  }

  .login_box .login_buttons {
    margin-right: 3.8rem;
    margin-left: 3.8rem;
  }

  .yun_button {
    width: 13.3rem;
    height: 2.5rem;
    border-radius: 1.3rem;
  }

  .yun_button:after {
    border: none !important;

  }

  .yun_button:active {
    color: hsla(0, 0%, 100%, .6);
    opacity: 0.8;
  }

  .yun_button_orange {
    background-color: #FB8557;
    font-size: 1rem;
    color: #ffffff;
    border: #FB8557;
  }

  .yun_button_orange_powder {
    background-color: #FBDACD;
    font-size: 1rem;
    color: #FB8557;
    border: #FBDACD;
  }
</style>

