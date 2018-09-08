# 自学vue实现官网例子之todoMVC
## 学习回顾：
1. 定义好需要使用的数据模型：
```javascript
var todo = {
    id: todoStorage.uid++, //每个todo都要有个id，便于控制
    title: '',//用户输入的内容
    completed: false//当前todo的完成状态
}
```
2. 增、删、改：
```javascript
addTodo: function() {
    var item =  this.newTodo && this.newTodo.trim();
    if(!item) {
        return;
    }
    this.todos.push({
        id: todoStorage.uid++,
        title: item,
        completed: false
    });
    this.newTodo = '';
}
editTodo: function(todo) {
    this.beforeEditCache = todo.title;
    this.editedTodo = todo;
}
removeTodo: function(todo) {
    this.todos.splice(this.todos.indexOf(todo),1);
}
```
回车输入，双击修改，点击删除。后期添加：修改成功后保存，取消修改后恢复，等事件。

3. 几个计算属性：
```javascript
allDone: { //所有todo完成的状态
    get: function() {
        return this.remaining === 0;
    },
    set: function(value) {
        this.todos.forEach(function(todo) {
            todo.completed = value;
        })
    }
},
filteredTodos: function() { //按需求(完成，未完成，全部)过滤后的todos
    return filters[this.visibility](this.todos);
},
remaining: function() {//当前还有多少的未完成
    return filters.active(this.todos).length;
}
```
4. 状态筛选：为了方便将不同状态下todo筛选出来，自定义一个filters函数
```javascript
var filters = {
    all : function(todos) {
        return todos;
    },
    active: function(todos) {
        return todos.filter(function(todo) {
            return !todo.completed;
        })
    },
    completed: function(todos) {
        return todos.filter(function(todo) {
            return todo.completed;
        })
    }
}
```
5. 使用localStorage存储当前的todo，刷新页面或关闭浏览器都有较好的体验
```javascript
var STORAGE_KEY = 'todos';
var todoStorage = {
    fetch:function() {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        todos.forEach(function(todo,index){
            todo.id = index;
        });
        todoStorage.uid = todos.length;
        return todos;
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY,JSON.stringify(todos));
    }
}
```