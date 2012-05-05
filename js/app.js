(function( window ) {
    'use strict';

    var Todo = new Class({

        Implements: [Options, Events],

        options: {
            ENTER_KEY: 13,
            todos: [],
            todoApp: $('todoapp'),
            newTodo: $('new-todo'),
            toggleAll: $('toggle-all'),
            main: $('main'),
            todoList: $('todo-list'),
            footer: $('footer'),
            count: $('todo-count'),
            clear: $('clear-completed')
        },

        initialize: function( options ) {
            this.setOptions( options );
            this.loadTodos();
            this.bindEvents();
            this.render();
        },

        uuid: function( a,b ) {
            // https://gist.github.com/1308368
            for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
            return b
        },

        pluralize: function( count, word ) {
            return count === 1 ? word : word + 's';
        },

        loadTodos: function() {
            if ( !localStorage.getItem( 'todos-mootools' ) ) {
                localStorage.setItem( 'todos-mootools', JSON.stringify( this.options.todos ) );
            }
            this.options.todos = JSON.parse( localStorage.getItem( 'todos-mootools' ) );
        },

        saveTodos: function( data ) {
            localStorage.setItem( 'todos-mootools', JSON.stringify( data ) );
        },

        bindEvents: function() {
            this.options.newTodo.addEvent( 'keyup', this.create.bind( this ) );
            this.options.toggleAll.addEvent( 'change', this.toggleAll.bind( this ) );
            this.options.clear.addEvent( 'click', this.clear.bind( this ) );
        },

        create: function( event ) {
            var val = event.target.value.trim();
            if ( event.code !== this.options.ENTER_KEY || !val ) return;
            this.options.todos.push({
                id: this.uuid(),
                title: val,
                completed: false
            });
            event.target.value = "";
            this.render();
        },

        editTodo: function( event ) {
            var todoId = this.get( 'data-todo-id' );
            $( 'li_' + todoId ).addClass( 'editing' );
            $( 'input_' + todoId ).select();
        },

        updateTodo: function( event ) {
            var val = event.target.value.trim();
            if ( !val ) {
                this.deleteTodo( event );
            } else {
                var id = $( event.target ).get( 'data-todo-id' );
                this.options.todos.each( function( item, index ) {
                    if ( item.id === id ) {
                        item.title = val;
                    }
                });
                this.render();
            }
        },

        deleteTodo: function( event ) {
            var id = $( event.target ).get( 'data-todo-id' );
            this.options.todos.each( function( item, index ) {
                if ( item.id === id ) {
                    this.options.todos.erase(item);
                }
            }.bind( this ));
            this.options.todos.clean();
            this.render();
        },

        clear: function() {
            var l = this.options.todos.length;
            while ( l-- ) {
                if ( this.options.todos[l].completed ) {
                    this.options.todos.splice( l, 1 );
                }
            }
            this.render();
        },

        checkbox: function( event ) {
            var id = $( event.target );
            this.options.todos.each( function( item, index ) {
                if ( item.id === id.get( 'data-todo-id' ) ) {
                    item.completed = id.checked;
                }
            });
            this.render();
        },

        toggleAll: function() {
            var checked = this.options.toggleAll.checked;
            this.options.todos.each( function( item, index ) {
                item.completed = ( checked ) ? true : false;
            });
            this.render();
        },

        stats: function() {
            var display = 'block',
                count =  this.options.todos.length;
            if ( this.options.todos.length === 0 ) display = 'none';
            $( 'footer' ).setStyle( 'display', display );
            this.options.toggleAll.setStyle( 'display', display );
            this.options.count.set( 'html', '<strong>' + count + '</strong> ' + this.pluralize( count, 'item' ) + ' left' );

            count = 0;
            this.options.todos.each( function( item, index ) {
                if ( item.completed ) count += 1;
            });
            this.options.clear.set( 'text', 'Clear completed (' + count + ')' );

            if ( count === 0 ) display = 'none';
            this.options.clear.setStyle( 'display', display );
        },

        render: function() {
            var checkbox,label, del, div, edit, li;
            var allComplete = 0,
                complete = true;
            this.saveTodos( this.options.todos );
            this.options.todoList.set( 'html', '' );
            this.options.todos.each( function( item, index ) {
                if ( item.completed ) allComplete += 1;
                checkbox = new Element( 'input', {
                    'class': 'toggle',
                    type: 'checkbox',
                    'data-todo-id': item.id,
                    checked: ( item.completed ) ? true : false,
                    events: {
                        change: this.checkbox.bind( this )
                    }
                });
                label = new Element( 'label', {
                    'data-todo-id': item.id,
                    text: item.title
                });
                del = new Element( 'button', {
                    'class': 'destroy',
                    'data-todo-id': item.id,
                    events: {
                        click: this.deleteTodo.bind( this )
                    }
                });
                div = new Element( 'div', {
                    'class': 'view',
                    'data-todo-id': item.id,
                    events: {
                        dblclick: this.editTodo
                    }
                });
                edit = new Element( 'input', {
                    id: 'input_' + item.id,
                    'data-todo-id': item.id,
                    'class': 'edit',
                    value: item.title,
                    events: {
                        keypress: function( event ) {
                            if ( event.code === this.options.ENTER_KEY ) this.updateTodo( event );
                        }.bind( this ),
                        blur: this.updateTodo.bind( this )
                    }
                });
                li = new Element( "li", {
                    id: 'li_' + item.id,
                    'class': ( item.completed ) ? 'completed' : 'incomplete'
                });
                div.adopt( checkbox, label, del );
                li.adopt( div, edit );
                this.options.todoList.adopt(li);
            }.bind( this ));
            if ( allComplete !== this.options.todos.length ) complete = false;
            this.options.toggleAll.checked = complete;
            this.stats();
        }

    });

    // Your starting point. Enjoy the ride!
    window.addEvent( 'domready', function() {

        var todo = new Todo();

    });

})( window );