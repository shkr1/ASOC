function mostrarResultados(resultados) {

    // Datos dummies
    resultados = {
        nombre: "Sanwish de frijoles",

        data:[
                {name: "positivos", value: 100},
                {name: "neutrales", value: 25}, 
                {name: "negativos", value: 50}    
            ]
    }
    // $("#resultados").text(resultados);
    // console.log(resultados.data)
    $("#pagina").text(resultados.nombre);
    showChart(resultados.data);
}

$(document).ready(function (){
    $('#buscar').bind('click', function() {
        $('body').addClass('page-is-changing');
        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            getResultados();
            $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        });
    });
});

