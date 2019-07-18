$(document).ready(function() {
    var ingredients = [];
    d3.csv("static/js/ingredients.csv").then(function(data) {
        for(let ingredient in data){
            $('.ingredient-selection').append('<option value="'+ data[ingredient].ingredients +'">' + data[ingredient].ingredients + '</option>')
        }
        $('.ingredient-selection').select2();
    });
    
});