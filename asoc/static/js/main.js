function mostrarResultados(resultados) {
    limpiar()
    // Datos dummies
    resultados = {
        nombre: "Sanwish de frijoles",

        data:[
                {name: "positivos", value: 100},
                {name: "neutrales", value: 25}, 
                {name: "negativos", value: 50}    
            ]
    }

    var suma = 0;
    for (var i = 0; i < resultados.data.length; i++) {
        suma = suma + resultados.data[i].value;
    }

    porcentaje = resultados.data[0].value/suma * 100;

    $("#pagina").text(resultados.nombre);
    showChart(resultados.data);

    d3.select("#agua").call(d3.liquidfillgauge, porcentaje);
    d3.select("#sub1").text("Distribución de mensajes");
    d3.select("#sub2").text("Porcentaje de aceptación");
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


function limpiar(){
    d3.selectAll("svg")
        .remove();

    var div = d3.select("#graficas");
    div.append("svg")
        .attr("id", "pie")
        .attr("width", 470)
        .attr("height", 250);

    div.append("svg")
        .attr("id", "agua")
        .attr("width", 470)
        .attr("height", 250);

};