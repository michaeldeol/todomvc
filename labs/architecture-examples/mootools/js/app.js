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
            //this.setOptions( options );
            this.loadTodos();
            this.bindEvents();
            this.render();
        },

        uuid: function( a,b ) {
            // https://gist.github.com/1308368
            for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
            return b
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

        deleteTodo: function( event ) {
            var id = $( event.target ).get( 'data-todo-id' );
            this.options.todos.each( function( item, index ) {
                if ( item.id === id ) {
                    id = index;
                    return;
                }
            });
            this.options.todos.splice( id, 1 );
            this.render();
        },

        checkbox: function( event ) {
            console.log(this.checked);
        },

        render: function() {
            this.saveTodos( this.options.todos );
            this.options.todoList.set( 'html', '' );
            this.options.todos.each( function( item, index ) {
                var checkbox = new Element( 'input', {
                    'class': 'toggle',
                    type: 'checkbox',
                    'data-todo-id': item.id,
                    events: {
                        change: this.checkbox
                    }
                });
                var label = new Element( 'label', {
                    'data-todo-id': item.id,
                    text: item.title
                });
                var del = new Element( 'button', {
                    'class': 'destroy',
                    'data-todo-id': item.id,
                    events: {
                        click: this.deleteTodo.bind( this )
                    }
                });
                var div = new Element( 'div', {
                    'class': 'view',
                    'data-todo-id': item.id,
                    events: {
                        dblclick: function() {
                            console.log('dbclick event fired');
                        }
                    }
                });
                var li = new Element( "li", {
                    id: 'li_' + item.id,
                    'class': ( item.completed ) ? 'complete' : 'incomplete'
                });
                div.adopt( checkbox, label, del );
                li.adopt( div );
                this.options.todoList.adopt(li);
            }.bind( this ));
        }

    });

    // Your starting point. Enjoy the ride!
    window.addEvent( 'domready', function() {

        // lets party
        var testDo = new Todo();

    });

})( window );