// 包含一些工具函数的模块
import Vue from 'vue'


// 保存指定商家的购物车中，商品的购物数量。 防止退出该商家，选中的商品被清零了
export function saveCartFoods(shopId,cartFoods){
    const cartCounts = cartFoods.reduce((pre,food) => {
        /*
          将count是我们点击添加商品时新增到food中的属性，这里将购物车中的对应商品的数量保存到pre中，以对象形式存储：food.id为key，count为值
        */
        pre[food.id] = food.count
        return pre
    },{})
    sessionStorage.setItem(shopId + '_key', JSON.stringify(cartCounts))
}

// 通过之前保存的购物数量，找到商品，并在我们返回该商家时，显示在商家页面上
export function getCartFoods(shop){
  const cartFoods = []

  // 从sessionStorage中取出之前存的以购买商品的id
  const cartCounts = JSON.parse(sessionStorage.getItem(shop.id + '_key')) || {}
  shop.goods.forEach(good => {
    good.foods.forEach((food) => {
        // 遍历shop中的goods中的foods中的每一个food，通过food的id值，看能不能找到对应的商品的购买数量，有的话就保存到count中
      const count = cartCounts[food.id]
      if(count>0){
        // 如果真找到了，就像之前一样，将count设置为food的响应式属性
        Vue.set(food,'count',count)
        // 将找到的所有之前购物车中的商品，显示在页面上
        cartFoods.push(food)
      }
    })
  })
  return cartFoods
}

/*
  数组的reduce方法：
  arr.reduce(function(prev,cur,index,arr){
  ...
  }, init);
  arr 表示原数组；
  prev 表示上一次调用回调时的返回值，或者初始值 init;
  cur 表示当前正在处理的数组元素；
  index 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
  init 表示初始值。
  看上去是不是感觉很复杂？没关系，只是看起来而已，其实常用的参数只有两个：prev 和 cur

  https://www.cnblogs.com/amujoe/p/11376940.html
*/