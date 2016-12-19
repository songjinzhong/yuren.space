/*
 * 注册一个ds_key函数用来生成多说的key
 */
hexo.extend.helper.register('ds_key', function(key){
  return key.match(/\/([^\/]+)\/$/)[1];
});
hexo.extend.helper.register('sortCategories', function(catMuch){
  var arr = [];
  for(var a in catMuch){
    arr.push(a);
  }
  arr = arr.sort(function(a, b){
    return catMuch[b] - catMuch[a] || b.length - a.length;
  })
  return arr;
});