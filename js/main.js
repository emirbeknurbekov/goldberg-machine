$( document ).ready(function() {
    var ball = function () {
        return Bodies.circle(100, 20, 23, {
            mass: 4,
            restitution: 0.3
        });
    }
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Events = Matter.Events,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

    var engine = Engine.create();

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: $( window ).width(),
            height: $( window ).height() - 60,
            background: '#ccc',
            wireframes: false,
            showAngleIndicator: true,
            showCollisions: true,
            showSleeping: true,
            showVelocity: true
        }
    });

    var redColor = '#C44D58',
        greenColor = '#C7F464';

    // create two boxes and a ground
    let boxA = Bodies.circle(10, 200, 20, { isSleeping: true, mass: 4, restitution: 0.3, render: {strokeStyle: redColor} });
    let plane = Bodies.rectangle(300, 280, 700, 20, {isSleeping: true, angle: Math.PI * 0.06 });
    let ground = Bodies.rectangle($( window ).width() / 2, $( window ).height() - 60, $( window ).width(), 60, { isStatic: true});
    let rec = Bodies.rectangle(600, 300, 40, 12, { isSleeping: true, angle: Math.PI * 0.56});
    // add all of the bodies to the world
    World.add(engine.world, [boxA, ground, plane, rec]);
    // World.add(engine.world, Composites.car(150, 100, 150, 30, 30));
    Engine.run(engine);
    Render.run(render);

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: $( window ).width(), y: $( window ).height() - 60 }
    });

    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.5,
                render: {
                    visible: false
                }
            }
        });

    engine.world.gravity.y = 2.5;
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    var editBody = null;

    Matter.Events.on(mouseConstraint, 'startdrag', function(event) {
         event.body.isStatic = false;
        });

    Matter.Events.on(mouseConstraint, 'enddrag', function(event) {
         event.body.isStatic = true;
         editBody = event.body;
         console.log(editBody);
        });

    $('#run-btn').click(function () {
        boxA.isSleeping = false;
        boxA.isStatic = false;
        rec.isStatic = false;
        rec.isSleeping = true;
    });

    $('#reload-btn').click(function () {
        location.reload(); 
    });

    $('#new').on('click', function () {
        World.add(engine.world, ball());
    })

    $('#edit-modal').on('shown.bs.modal', function () {
        if (editBody !== null) {
           $('#edit-name').val(editBody.label);
           $('#edit-radius').val(editBody.circleRadius);
           $('#edit-angle').val(editBody.angle);
           $('#edit-mass').val(editBody.mass);
           $('#edit-friction').val(editBody.friction);
           $('#edit-restitution').val(editBody.restitution);
        }
    })

    $('#edit-save').on('click', function () {
        editBody.label = $('#edit-name').val();
        editBody.circleRadius = +$('#edit-radius').val();
        editBody.angle = +$('#edit-angle').val();
        editBody.mass = +$('#edit-mass').val();
        editBody.friction = +$('#edit-friction').val();
        editBody.restitution = +$('#edit-restitution').val();
    })
   
});


