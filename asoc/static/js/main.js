isAnimated = false;
function mostrarResultados(resultados) {
    if(!isAnimated)
    {
        isAnimated = true;
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

        // Obtiene la suma total de mensajes
        var suma = 0;
        for (var i = 0; i < resultados.data.length; i++) {
            suma = suma + resultados.data[i].value;
        }

        // Despues se calcula el porcentaje de mensajes positivos
        porcentaje = resultados.data[0].value/suma * 100;

        // Aqui va el nombre de la pagina de Facebook
        $("#pagina").text(resultados.nombre);
        // Muestra la grafica de distribucion de los mensajes
        showChart(resultados.data);

        // Esta es la grafica de porcentaje de aceptacion
        d3.select("#agua").call(d3.liquidfillgauge, porcentaje);

        // Etiquetas para cada grafica
        d3.select("#sub1").text("Distribución de mensajes");
        d3.select("#sub2").text("Porcentaje de aceptación");
    }
}

$(document).ready(function (){

    // Cuando se le da click al boton de buscar se activa la animacion
    // y la llamada Ajax
    $('#buscar').bind('click', function() {
        $('body').addClass('page-is-changing');
        $('.cd-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            getResultados();
            $('.cd-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        });
    });
});

// Cuando se quiere generar una nueva busqueda, borra las etiquetas svg de cada grafica
// y crea nuevas
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