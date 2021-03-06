isAnimated = false;
function mostrarResultados(resultados) {
    limpiar()
    if(!isAnimated)
    {
        isAnimated = true;
           
        var suma = 0;
        for (var i = 0; i < resultados.data.length; i++) {
            suma = suma + resultados.data[i].value;
        }

        if(suma > 0)
        {
            porcentaje = 0;
            // Despues se calcula el porcentaje de mensajes positivos
            for (var i = 0; i < resultados.data.length; i++) {
                if(resultados.data[i].name == "Positivo+" || resultados.data[i].name == "Positivo"){
                    porcentaje = porcentaje + resultados.data[i].value;
                }

                // var porcentaje_val = resultados.data[i].value/suma * 100;
                if(resultados.data[i].name == "Positivo+"){
                    $("#bl_pos_").show();
                    d3.select("#pos_").call(d3.liquidfillgauge, resultados.data[i].value, { displayPercent: false });
                }else if(resultados.data[i].name == "Positivo")
                {
                    $("#bl_pos").show();
                    d3.select("#pos").call(d3.liquidfillgauge, resultados.data[i].value, { displayPercent: false });
                }else if(resultados.data[i].name == "Neutral"){
                    $("#bl_neu").show();
                    d3.select("#neu").call(d3.liquidfillgauge, resultados.data[i].value, { displayPercent: false });
                }else if(resultados.data[i].name == "Negativo"){
                    $("#bl_neg").show();
                    d3.select("#neg").call(d3.liquidfillgauge, resultados.data[i].value, { displayPercent: false });
                }else if(resultados.data[i].name == "Negativo+"){
                    $("#bl_neg_").show();
                    d3.select("#neg_").call(d3.liquidfillgauge, resultados.data[i].value, { displayPercent: false });
                }
            }
            porcentaje = porcentaje/suma * 100;
            // Aqui va el nombre de la pagina de Facebook
            $("#pagina").text(resultados.nombre);

            $("#bl_acept").show();
            // Esta es la grafica de porcentaje de aceptacion
            if(porcentaje >= 50){
                d3.select("#acept").call(d3.liquidfillgauge, porcentaje, {
                  circleColor: "#4caf50",
                  textColor: "#43a047",
                  waveTextColor: "#a5d6a7",
                  waveColor: "#4caf50",
                  waveAnimateTime: 2000,
                  fillWithGradient: true,
                  gradientPoints: [0.2, 0, 0.9, 1],
                  gradientFromColor: "#43a047",
                  gradientToColor: "#66bb6a"
                });
            }
            else{
                d3.select("#acept").call(d3.liquidfillgauge, porcentaje, {
                  circleColor: "#f44336",
                  textColor: "#e53935",
                  waveTextColor: "#ef9a9a",
                  waveColor: "#f44336",
                  waveAnimateTime: 2000,
                  fillWithGradient: true,
                  gradientPoints: [0.2, 0, 0.9, 1],
                  gradientFromColor: "#e53935",
                  gradientToColor: "#ef5350"
                });
            }

            // Etiquetas para cada grafica
            d3.select("#no_comments").text("");
        }else{
            $("#pagina").text(resultados.nombre);
            d3.select("#no_comments").text("No hay comentarios.");
        }

        $("#post_info").html("<h5> Se analizaron " + resultados.total + " comentarios en el post más reciente con comentarios ("+
            "<a href='"+resultados.url+"posts"+"/"+resultados.id_post+"' target='_blank'>"+resultados.url+"posts"+"/"+resultados.id_post+"</a>" + 
            "), de los cuales " + suma + " tuvieron un análisis exitoso y " + resultados.fallidos + " fallaron.<br>" + 
            "<br/> Estos se distribuyen de la siguiente manera:</h5><br/>");
        $("#link_post").html()
        $("#cantidad_mensajes").html() 
    }else
    {
        console.log("No puedes hasta que se cargue.")
    }
}

$(document).ready(function (){

    $("#bl_neg").hide();
    $("#bl_neu").hide();
    $("#bl_pos").hide();
    $("#bl_pos_").hide();
    $("#bl_acept").hide();
    $("#bl_neg_").hide();
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
    $("#pagina").text("");
    $("#bl_neg_").hide();
    $("#bl_neg").hide();
    $("#bl_neu").hide();
    $("#bl_pos").hide();
    $("#bl_pos_").hide();
    $("#bl_acept").hide();
    $("#post_info").html("")

    $("#bl_neg_ g").remove();
    $("#bl_neg g").remove();
    $("#bl_neu g").remove();
    $("#bl_pos g").remove();
    $("#bl_pos_ g").remove();
    $("#bl_acept g").remove();

};