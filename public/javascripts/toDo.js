YUI().use('event-focus', 'json', 'model', 'model-list', 'view', function (Y) {
    var TodoAppView, TodoList, TodoModel, TodoView;

    TodoModel = Y.TodoModel = Y.Base.create('todoModel', Y.Model, [], {
        
        sync: LocalStorageSync('todo'),

        toggleDone: function () {
            this.set('done', !this.get('done')).save();
        }
    }, {
        ATTRS: {
         
            done: {
                value: false
            },

            text: {
                value: ''
            }
        }
    });

    TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
       
        model: TodoModel,

        sync: LocalStorageSync('todo'),

        done: function () {
            return this.filter(function (model) {
                return model.get('done');
            });
        },

        remaining: function () {
            return this.filter(function (model) {
                return !model.get('done');
            });
        }
    });

    TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
        
        events: {
           
            '#new-todo': {
                keypress: 'createTodo'
            },

            '.todo-clear': {
                click: 'clearDone'
            },

            '.todo-item': {
                mouseover: 'hoverOn',
                mouseout: 'hoverOff'
            }
        },

        template: Y.one('#todo-stats-template').getHTML(),

        initializer: function () {
           
            var list = this.todoList = new TodoList();

            list.after('add', this.add, this);
            list.after('reset', this.reset, this);

            list.after(['add', 'reset', 'remove', 'todoModel:doneChange'],
                this.render, this);

            list.load();
        },

        render: function () {
            var todoList = this.todoList,
                stats = this.get('container').one('#todo-stats'),
                numRemaining, numDone;

            if (todoList.isEmpty()) {
                stats.empty();
                return this;
            }

            numDone = todoList.done().length;
            numRemaining = todoList.remaining().length;

            stats.setHTML(Y.Lang.sub(this.template, {
                numDone: numDone,
                numRemaining: numRemaining,
                doneLabel: numDone === 1 ? 'task' : 'tasks',
                remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
            }));

            if (!numDone) {
                stats.one('.todo-clear').remove();
            }

            return this;
        },

        add: function (e) {
            var view = new TodoView({
                model: e.model
            });

            this.get('container').one('#todo-list').append(
                view.render().get('container')
            );
        },

        clearDone: function (e) {
            var done = this.todoList.done();

            e.preventDefault();

            this.todoList.remove(done, {
                silent: true
            });

            Y.Array.each(done, function (todo) {
                
                todo.destroy({
                    remove: true
                });
            });

            this.render();
        },

        createTodo: function (e) {
            var inputNode, value;

            if (e.keyCode === 13) { // enter key
                inputNode = this.get('inputNode');
                value = Y.Lang.trim(inputNode.get('value'));

                if (!value) {
                    return;
                }

                this.todoList.create({
                    text: value
                });

                inputNode.set('value', '');
            }
        },

        hoverOff: function (e) {
            e.currentTarget.removeClass('todo-hover');
        },

        hoverOn: function (e) {
            e.currentTarget.addClass('todo-hover');
        },

        reset: function (e) {
            var fragment = Y.one(Y.config.doc.createDocumentFragment());

            Y.Array.each(e.models, function (model) {
                var view = new TodoView({
                    model: model
                });
                fragment.append(view.render().get('container'));
            });

            this.get('container').one('#todo-list').setHTML(fragment);
        }
    }, {
        ATTRS: {
    
            container: {
                valueFn: function () {
                    return '#todo-app';
                }
            },

            inputNode: {
                valueFn: function () {
                    return Y.one('#new-todo');
                }
            }
        }
    });

    TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
        
        containerTemplate: '<li class="todo-item"/>',

        events: {
           
            '.todo-checkbox': {
                click: 'toggleDone'
            },

            '.todo-content': {
                click: 'edit',
                focus: 'edit'
            },

            '.todo-input': {
                blur: 'save',
                keypress: 'enter'
            },

            '.todo-remove': {
                click: 'remove'
            }
        },

        template: Y.one('#todo-item-template').getHTML(),

        initializer: function () {
            
            var model = this.get('model');

            model.after('change', this.render, this);

            model.after('destroy', function () {
                this.destroy({
                    remove: true
                });
            }, this);
        },

        render: function () {
            var container = this.get('container'),
                model = this.get('model'),
                done = model.get('done');

            container.setHTML(Y.Lang.sub(this.template, {
                checked: done ? 'checked' : '',
                text: model.getAsHTML('text')
            }));

            container[done ? 'addClass' : 'removeClass']('todo-done');
            this.set('inputNode', container.one('.todo-input'));

            return this;
        },

        edit: function () {
            this.get('container').addClass('editing');
            this.get('inputNode').focus();
        },

        enter: function (e) {
            if (e.keyCode === 13) { // enter key
                Y.one('#new-todo').focus();
            }
        },

        remove: function (e) {
            e.preventDefault();

            this.constructor.superclass.remove.call(this);
            this.get('model').destroy({
                'delete': true
            });
        },

        save: function () {
            this.get('container').removeClass('editing');
            this.get('model').set('text', this.get('inputNode').get('value')).save();
        },

        toggleDone: function () {
            this.get('model').toggleDone();
        }
    });

    TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
        
        containerTemplate: '<li class="todo-item"/>',

        
        events: {
            
            '.todo-checkbox': {
                click: 'toggleDone'
            },

            '.todo-content': {
                click: 'edit',
                focus: 'edit'
            },

            '.todo-input': {
                blur: 'save',
                keypress: 'enter'
            },

            '.todo-remove': {
                click: 'remove'
            }
        },

        template: Y.one('#todo-item-template').getHTML(),

        initializer: function () {
            
            var model = this.get('model');

            model.after('change', this.render, this);

            model.after('destroy', function () {
                this.destroy({
                    remove: true
                });
            }, this);
        },

        render: function () {
            var container = this.get('container'),
                model = this.get('model'),
                done = model.get('done');

            container.setHTML(Y.Lang.sub(this.template, {
                checked: done ? 'checked' : '',
                text: model.getAsHTML('text')
            }));

            container[done ? 'addClass' : 'removeClass']('todo-done');
            this.set('inputNode', container.one('.todo-input'));

            return this;
        },

        edit: function () {
            this.get('container').addClass('editing');
            this.get('inputNode').focus();
        },

        enter: function (e) {
            if (e.keyCode === 13) { // enter key
                Y.one('#new-todo').focus();
            }
        },

        remove: function (e) {
            e.preventDefault();

            this.constructor.superclass.remove.call(this);
            this.get('model').destroy({
                'delete': true
            });
        },

        save: function () {
            this.get('container').removeClass('editing');
            this.get('model').set('text', this.get('inputNode').get('value')).save();
        },

        
        toggleDone: function () {
            this.get('model').toggleDone();
        }
    });

    function LocalStorageSync(key) {
        var localStorage;

        if (!key) {
            Y.error('No storage key specified.');
        }

        if (Y.config.win.localStorage) {
            localStorage = Y.config.win.localStorage;
        }

        
        var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

        
        function destroy(id) {
            var modelHash;

            if ((modelHash = data[id])) {
                delete data[id];
                save();
            }

            return modelHash;
        }

        
        function generateId() {
            var id = '',
                i = 4;

            while (i--) {
                id += (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16).substring(1);
            }

            return id;
        }

        function get(id) {
            return id ? data[id] : Y.Object.values(data);
        }

        function save() {
            localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
        }

        function set(model) {
            var hash = model.toJSON(),
                idAttribute = model.idAttribute;

            if (!Y.Lang.isValue(hash[idAttribute])) {
                hash[idAttribute] = generateId();
            }

            data[hash[idAttribute]] = hash;
            save();

            return hash;
        }

        return function (action, options, callback) {
            
            var isModel = Y.Model && this instanceof Y.Model;

            switch (action) {
            case 'create': // intentional fallthru
            case 'update':
                callback(null, set(this));
                return;

            case 'read':
                callback(null, get(isModel && this.get('id')));
                return;

            case 'delete':
                callback(null, destroy(isModel && this.get('id')));
                return;
            }
        };
    }

    new TodoAppView();

});