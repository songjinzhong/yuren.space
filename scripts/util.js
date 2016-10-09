/*
 * 注册一个ds_key函数用来生成多说的key
 */
hexo.extend.helper.register('ds_key', function(key){
  return key.match(/\/([^\/]+)\/$/)[1];
});