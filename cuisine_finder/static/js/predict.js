$(document).ready(function() {
    var ingredients = [];
    d3.csv("static/js/ingredients.csv").then(function(data) {
        for(let ingredient in data){
            $('.ingredient-selection').append('<option value="'+ data[ingredient].ingredients +'">' + data[ingredient].ingredients + '</option>')
        }
        $('.ingredient-selection').select2();
    });
    
});

// $(document).ready(function() {
//     var ingredients = [];
//     d3.csv("static/data/ingredients.csv").then(function(data) {
//         for(let ingredient in data){
//             $('.ingredient-selection').append('<option value="'+ data[ingredient].ingredients +'">' + data[ingredient].ingredients + '</option>')
//             var inputs = document.getElementsByClassName( 'ingredient-selection' ),
//             names  = [].map.call(inputs, function( input ) {
//                 return input.value;
//             }).join( ',' );
//         }
//         $('.ingredient-selection').select2();
//     });
//     console.log(ingredients)
//  });