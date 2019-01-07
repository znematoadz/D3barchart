const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let dataset = [];

fetch(url)
  .then(response => response.json())
  .then(function(receivedData) {
    dataset = receivedData.data;

    let chartWidth = 1000;
    let chartHeight = 500;
    let barWidth = chartWidth / dataset.length;

    let max = d3.max(dataset);
    let maxY = max[1];
    let minDate = new Date(dataset[0][0]);
    let maxDate = new Date(dataset[dataset.length - 1][0]);

    let chart = d3
      .select(".chart")
      .append("svg")
      .attr("id", "chartSVG")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    let yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([chartHeight, 0]);

    let xScale = d3
      .scaleTime()
      .domain([minDate, maxDate])
      .range([0, chartWidth]);

    let bars = chart
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        let translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
      });

    bars
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("y", d => yScale(d[1]))
      .attr("height", d => chartHeight - yScale(d[1]))
      .attr("width", barWidth)
      .attr("id", d => dataset.indexOf(d));

    let xAxis = d3.axisBottom(xScale);

    let yAxis = d3.axisLeft(yScale);

    chart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(xAxis);

    chart
      .append("g")
      .attr("id", "y-axis")
      .attr("transfrom", "translate(50, 10)")
      .call(yAxis);

    chart
      .append("text")
      .text("Units: Billions of Dollars")
      .attr("x", 30)
      .attr("y", 210)
      .attr("transform", "rotate(-90 30 210)");

    chart
      .append("text")
      .attr("x", chartWidth / 2 + 50)
      .attr("y", chartHeight + 50)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
      .attr("class", "info");

    const tooltipHandler = document.getElementById("chartSVG");
    let wrapper = document.getElementById("container");
    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.setAttribute("id", "tooltip");
    wrapper.appendChild(tooltip);

    tooltipHandler.addEventListener("mouseover", tooltipOpen);
    document.addEventListener("mouseleave", tooltipClose);

    function tooltipOpen(event) {
      let ev = parseInt(event.target.id);

      if (!isNaN(ev)) {
        let top = event.layerY - 90;
        let left = event.layerX - 60;
        let dataDate = dataset[ev][0];
        tooltip.setAttribute("data-date", dataDate);
        let dataGDP = dataset[ev][1];
        tooltip.setAttribute("data-gdp", dataGDP);
        tooltip.innerHTML = dataDate + "<br />" + "$" + dataGDP + " B";
        tooltip.style.top = top.toString() + "px";
        tooltip.style.left = left.toString() + "px";
        tooltip.style.opacity = 1;
      } else {
        tooltip.style.opacity = 0;
      }
    }

    function tooltipClose(event) {
      tooltip.style.opacity = 0;
    }
  });
