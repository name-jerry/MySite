<template>
  <view class="login-container" :class='{active:isRegister}'>
    <view class="main-wrap">
      <slot></slot>
      <view class="mask" v-if="main.isLogin">
        <text>已登录,是否退出</text>
        <view class="btn hover-shadow-btn" @tap="main.isLogin=false">退出</view>
      </view>
      <view class="main-box">
        <view class="item-login">
          <input class="show input hover-shadow-input" autocomplete='off' type="text" placeholder="账号"
            v-model="form.acc" />
          <PasswordInput class="show input hover-shadow-input" placeholder='输入密码' v-model="form.pwd1" />
          <view class="show btn hover-shadow-btn" @tap="loginBtn">登录</view>
        </view>
        <view class="item-register">
          <input class="show input hover-shadow-input" type="text" placeholder="账号" v-model="form.acc" />
          <PasswordInput class="show input hover-shadow-input" placeholder='输入密码' v-model="form.pwd1" />
          <PasswordInput class="show input hover-shadow-input" placeholder='再次输入密码' v-model="form.pwd2" />
          <view class="show btn hover-shadow-btn" @tap="registerBtn">注册</view>
        </view>
      </view>
    </view>
    <view class="blank-wrap">
      <view class="item-login blank-item"><text class="text hover-shadow-btn"
          @tap="[isRegister=false,clearForm()]">登录</text></view>
      <view class="item-register blank-item"><text class="text hover-shadow-btn"
          @tap="[isRegister=true,clearForm()]">注册</text></view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { SHA1 } from 'crypto-js';
  import { ref, reactive, onMounted, nextTick } from "vue";
  import cf from '@/utils/cf';
  import checkPwd from '@/utils/checkPwd';
  import useMainStore from "@/stores/useMainStore"
  let main = useMainStore();
  let isRegister = ref<boolean>(false)
  let s = (msg : string) : void => { uni.showToast({ title: msg, icon: 'error' }); }
  type Form = {
    acc : string,
    pwd1 : string,
    pwd2 ?: string
  }
  let form = reactive<Form>({
    acc: '',
    pwd1: '',
    pwd2: '',
  })
  async function loginBtn() {
    if (!form.acc || !form.pwd1) return s(' 请输入信息');
    let pwd = SHA1(form.pwd1).toString();
    let res = await cf({ type: 'login', acc: form.acc, pwd })
    if (res.success) {
      uni.showToast({
        title: '登录成功',
      })
      main.online = res.isOnline
      main.isLogin = true;
    }
  }
  async function registerBtn() {
    if (!form.acc || !form.pwd1) return s('请输入信息');
    if (form.pwd1 !== form.pwd2) return s('密码不一致');
    if (!checkPwd(form.pwd1)) return s('8-16位,字母、数字和符号任意两种的组合');
    let pwd = SHA1(form.pwd1).toString();
    let { success } = await cf({ type: 'register', acc: form.acc, pwd });
    if (!success) return;
    uni.showToast({ title: '注册成功,请登录' });
    isRegister.value = false;
  }

  function clearForm() {
    form.acc = '';
    form.pwd1 = '';
    form.pwd2 = '';
  }

  onMounted(() => {
  })
</script>

<style scoped lang="scss">
  .login-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    --color-white-1: hsl(207, 45%, 87%);
    --color-white-2: hsl(207, 45%, 90%);
    --color-shadow-1: hsl(207, 40%, 68%);
    --color-shadow-2: hsl(207, 30%, 70%);
  }


  .main-wrap,
  .main-box {
    transition: var(--transition-default);
  }

  .mask {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: var(--color-bg-quote);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 16px;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;

    .btn {
      border-radius: 6px;
    }
  }

  .main-wrap {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    box-shadow: -4px -4px 8px var(--color-white-1),
      inset 1px 1px 1px var(--color-white-2),
      2px 2px 4px var(--color-shadow-1),
      inset -1px -1px 1px var(--color-shadow-2);
    z-index: 2;
  }

  .main-box {
    width: 200%;
    max-height: 100%;
    min-height: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;

  }


  .item-login,
  .item-register {
    background-color: var(--color-bg-quote);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    gap: 10px;

    .input {
      width: 100%;
      height: 40px;
      background-color: white;
      text-indent: .5em;
    }

    .btn {
      width: 100%;
      border-radius: 6px;
    }

  }



  .blank-wrap {
    --w: 150px;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 70%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    box-shadow: -1px -1px 2px var(--color-white-1),
      inset 1px 1px 1px var(--color-white-2),
      6px 6px 12px -2px var(--color-shadow-1),
      inset -1px -1px 1px var(--color-shadow-2);

    &::before {
      content: '';
      position: absolute;
      width: var(--w);
      padding-top: var(--w);
      border-radius: 50%;
      top: -75px;
      left: 100%;
      transform: translateX(-60%);
      box-shadow: -1px -1px 0px var(--color-shadow-1),
        inset 4px 4px 8px var(--color-shadow-2),
        1px 1px 0px var(--color-white-2),
        inset -3px -3px 6px var(--color-white-1);
      z-index: 1;
      transition: var(--transition-default);
    }

    &::after {
      content: '';
      position: absolute;
      width: var(--w);
      padding-top: var(--w);
      border-radius: 50%;
      bottom: -75px;
      left: 50%;
      transform: translateX(-40%);
      box-shadow: -1px -1px 0px var(--color-shadow-1),
        inset 4px 4px 8px var(--color-shadow-2),
        1px 1px 0px var(--color-white-2),
        inset -3px -3px 6px var(--color-white-1);
      transition: var(--transition-default);
    }
  }

  .blank-item {
    position: relative;
    display: flex;
    justify-content: center;
    text-align: center;

    .text {
      border-radius: 6px
    }
  }

  // 动画
  .show {
    transform-origin: right top;
    transform: scale(0);
  }

  .item-login .show {
    animation: show .5s ease forwards;
  }

  .item-register .show {
    animation: none;
  }

  @keyframes show {
    to {
      transform: scale(1);
    }

  }

  .active {
    .main-wrap {
      transform: translateX(100%);
      box-shadow: -1px -1px 2px var(--color-white-1),
        inset 1px 1px 1px var(--color-white-2),
        6px 6px 12px -2px var(--color-shadow-1),
        inset -1px -1px 1px var(--color-shadow-2);

      .main-box {
        transform: translateX(-50%);

        .item-login .show {
          animation: none;
        }

        .item-register .show {
          animation: show .5s ease forwards;
        }
      }
    }

    .blank-wrap {
      box-shadow: -4px -4px 8px var(--color-white-1),
        inset 1px 1px 1px var(--color-white-2),
        2px 2px 4px var(--color-shadow-1),
        inset -1px -1px 1px var(--color-shadow-2);

      &::before {
        left: 50%
      }

      &::after {
        left: 0%
      }
    }
  }

  @media (max-width: 1200px) {
    .main-wrap {}
  }

  @media (max-width: 992px) {}

  @media (max-width: 768px) {}

  @media (max-width: 575px) {}
</style>