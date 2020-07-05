<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import Jex from './jex'

  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    mounted () {
      // const user = Jex.User()
      // user.login('12', '12341234')
      //   .then(res => {
      //     console.log(res)
      //   }).catch(err => {
      //   console.log(err)
      // })
      // user.current()
      // user.login('12', '12341234')
      // user.register({ username: '122', password: '12341234' })

      const query = Jex.Query('ArticleScore')
      // const article = Jex.Query('Article')
      // // query.statTo('sum', 'score')
      // query.set('score', 11)
      // query.set('title', 'xxxxx')
      // query.set('author', 'cc')
      // query.set('money', 30)
      // query.save().then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // query.remove({score: 88}).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // query.set('score', 11)
      // query.select('score', '_id')
      // query.unSelect('remark')
      // query.select('_id')
      // query.skip(1)
      // query.limit(5)
      // const q1 = query.equalTo('score', '>=', 30)
      // const q2 = query.equalTo('score', '<', 500)
      // query.and(q1, q2)
      // query.or(q1, q2)
      // query.order('score', 'asc')
      // query.increment('5f01786fa699e1fe27b2aff5', { score: -10 }).then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })
      // const q1 = query.equalTo('_score', '>', 30)
      // query.statTo('sum', ['score', 'money'])
      // query.statTo('sum', 'score')
      // query.statTo("having", q1);
      // query.statTo('groupby', '')
      // query.statTo("groupcount", true);
      // query.statTo('order', { _sum_score: 'desc', _sum_money: 'desc' })
      // query.statTo('avg', 'score')
      // query.statTo('max', 'score')
      // query.statTo('min', 'score')
      // query.order('_sum_score', 'desc')
      // TODO: 批量删除
      query.reference('User')
      query.get().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
