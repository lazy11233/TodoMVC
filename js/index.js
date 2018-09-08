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

var app = new Vue({
    el: '#app',
    data: {
        todos: todoStorage.fetch(),
        newTodo: '',
        editedTodo: null,
        visibility: 'all',
        
    },
    methods: {
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
        },
        editTodo: function(todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },
        removeTodo: function(todo) {
            this.todos.splice(this.todos.indexOf(todo),1);
        },
        doneEdit: function(todo) {
            if(!this.editTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if(!todo.title) {
                this.removeTodo(todo);
            }
        },
        cancleEdit: function(todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        },
        removeCompleted: function() {
            this.todos = filters.active(this.todos);
        }
    },
    computed: {
        allDone: {
            get: function() {
                return this.remaining === 0;
            },
            set: function(value) {
                this.todos.forEach(function(todo) {
                    todo.completed = value;
                })
            }
        },
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        },
        remaining: function() {
            return filters.active(this.todos).length;
        }
    },
    directives: {
        'todo-focus': function(el, binding) {
            if(binding.value) {
                el.focus();
            }
        }
    },
    filters: {
        pluralize: function(n) {
            return n === 1 ? 'item left' : 'items left';
        }
    },
    watch: {
        todos: function(todos) {
            todoStorage.save(todos);
        },
        deep: true
    }
})

function onHashChange() {
    var visibility = window.location.hash.replace(/#\/?/,'');
    if(filters[visibility]){
        app.visibility = visibility;
    }else{
        window.location.hash = ''
        app.visibility = 'all'
    }
}

window.addEventListener('hashchange', onHashChange);
onHashChange();