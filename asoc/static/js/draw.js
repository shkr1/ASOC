/**
* Dibuja una gráfica de pastel.
* Recibe como parametro data, que es un arreglo json con el siguiente formato
* [
*   {name: "nombre", value: "numero"},
*   {name: "Nombre", value: "numero"},
* ]
*/
function showChart(data) {
  
  // En este caso selecciona la etiqueta por id "pie",
  // es importante que esta etiqueta sea de tipo svg
  var svg = d3.select("#pie"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(["#3F729B", "#4B515D", "#2E2E2E", "#d0743c", "#ff8c00", "#98abc5", "#8a89a6"]);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.value; });

  var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  for (var i = data.length - 1; i >= 0; i--) {
    data[i].value = +data[i].value;  
  }

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.name); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.name; });
};