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

        loadTodos: function() {
            if ( !localStorage.getItem( 'todos-mootools' ) ) {
                localStorage.setItem( 'todos-mootools', JSON.stringify( this.options.todos ) );
            }
            this.options.todos = JSON.parse( localStorage.getItem( 'todos-mootools' ) );
        },

        bindEvents: function() {
            this.options.newTodo.addEvent( 'keyup', this.create.bind(this) );
        },

        create: function( event ) {
            var val = event.target.value.trim();
            if ( event.code !== this.options.ENTER_KEY || !val ) return;
            this.options.todos.push({
                // TODO: id needs to be updated to a unique number
                id: 0,
                title: val,
                completed: false
            });
            event.target.value = "";
            this.render();
            console.log(this.options.todos);
        },

        render: function() {
            this.loadTodos();
            // TODO: This needs to be removed into it's own method
            //localStorage.setItem( 'todos-mootools', JSON.stringify( this.options.todos ) );
        }

    });

    // Your starting point. Enjoy the ride!
    window.addEvent( 'domready', function() {

        // lets party
        var testDo = new Todo();
        //console.log(testDo.options.todos);
        //console.log(testDo.options.todoApp);

    });

})( window );